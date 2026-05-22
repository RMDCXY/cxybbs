#!/usr/bin/env python3
import os
import re
import subprocess
import sys
from pathlib import Path
from dataclasses import dataclass

ROOT_FILES = {"index.html", "articles/index.html"}
RSS_PATH = Path("rss.xml")

@dataclass
class Section:
    title: str = ""
    subtitle: str = ""
    href: str = ""


def extract_div_block(text: str, start: int) -> tuple[str, int] | tuple[None, int]:
    end_tag = "</div>"
    start_tag = "<div"
    open_pos = text.find('>', start)
    if open_pos == -1:
        return None, len(text)
    depth = 1
    pos = open_pos + 1
    while depth > 0:
        next_open = text.find(start_tag, pos)
        next_close = text.find(end_tag, pos)
        if next_close == -1:
            break
        if next_open != -1 and next_open < next_close:
            depth += 1
            pos = next_open + len(start_tag)
        else:
            depth -= 1
            pos = next_close + len(end_tag)
    if depth != 0:
        return None, pos
    return text[start:pos], pos


def parse_sections(file_path: Path) -> list[Section]:
    html = file_path.read_text(encoding="utf-8")
    sections_start = html.find('<div class="sections"')
    if sections_start == -1:
        sections_start = html.find("<div class='sections'")
    if sections_start == -1:
        return []

    section_html, _ = extract_div_block(html, sections_start)
    if not section_html:
        return []

    results = []
    idx = 0
    while True:
        idx = section_html.find('<div', idx)
        if idx == -1:
            break
        line_end = section_html.find('>', idx)
        if line_end == -1:
            break
        tag_text = section_html[idx:line_end + 1]
        if 'section-card' in tag_text:
            block, new_pos = extract_div_block(section_html, idx)
            if not block:
                idx = line_end + 1
                continue
            title_match = re.search(r'<div[^>]*class=["\"][^"\"]*section-title[^"\"]*["\"][^>]*>(.*?)</div>', block, re.S)
            subtitle_match = re.search(r'<div[^>]*class=["\"][^"\"]*section-subtitle[^"\"]*["\"][^>]*>(.*?)</div>', block, re.S)
            href_match = re.search(r'<a[^>]*href=["\"]([^"\"]+)["\"]', block)
            if title_match and href_match:
                title = title_match.group(1).strip()
                subtitle = subtitle_match.group(1).strip() if subtitle_match else ""
                href = href_match.group(1).strip()
                results.append(Section(title=title, subtitle=subtitle, href=href))
            idx = new_pos
        else:
            idx = line_end + 1
    return results


def run_git_diff() -> set[str]:
    before = os.environ.get("GITHUB_EVENT_BEFORE")
    sha = os.environ.get("GITHUB_SHA")
    args = ["git", "diff", "--name-only"]
    if before and before != "0000000000000000000000000000000000000000" and sha:
        args.extend([before, sha])
    else:
        args.extend(["HEAD~1", "HEAD"])
    try:
        output = subprocess.check_output(args, text=True, stderr=subprocess.DEVNULL)
    except subprocess.CalledProcessError:
        return set()
    return {line.strip().replace('\\', '/') for line in output.splitlines() if line.strip()}


def parse_sections(file_path: Path) -> list[Section]:
    parser = SectionsParser()
    text = file_path.read_text(encoding="utf-8")
    parser.feed(text)
    results = []
    for section in parser.sections:
        title = section.title.strip()
        subtitle = section.subtitle.strip()
        href = section.href.strip()
        if title and href:
            results.append(Section(title=title, subtitle=subtitle, href=href))
    return results


def normalize_link(href: str) -> str:
    href = href.strip()
    if href.startswith("./"):
        href = href[2:]
    if href.endswith(".html"):
        href = href[: -len(".html")]
    return href


def build_rss_items(home_sections: list[Section], article_sections: list[Section]) -> list[dict]:
    items = []
    for section in home_sections:
        link = normalize_link(section.href)
        items.append({
            "title": section.title,
            "link": link,
            "description": section.subtitle,
            "guid": link,
        })
    for section in article_sections:
        link = normalize_link(section.href)
        match = re.search(r"/articles/([0-9A-Za-z_-]+)$", link)
        if match:
            article_id = match.group(1)
            title = f"专栏#{article_id} - {section.title}"
        else:
            title = section.title
        description = section.subtitle
        if description.startswith("撰写于"):
            description = f"本专栏{description}。"
        items.append({
            "title": title,
            "link": link,
            "description": description,
            "guid": link,
        })
    return items


def parse_existing_rss_items(rss_text: str) -> list[dict]:
    items = []
    pattern = re.compile(
        r"<item>\s*<title>(.*?)</title>\s*<link>(.*?)</link>\s*<description>(.*?)</description>\s*<guid>(.*?)</guid>\s*</item>",
        re.DOTALL,
    )
    matches = pattern.findall(rss_text)
    if not matches:
        return []
    for title, link, description, guid in matches[1:]:
        items.append({
            "title": title.strip(),
            "link": link.strip(),
            "description": description.strip(),
            "guid": guid.strip(),
        })
    return items


def format_rss_items(items: list[dict]) -> str:
    formatted = []
    for item in items:
        formatted.append(
            "    <item>\n"
            f"      <title>{item['title']}</title>\n"
            f"      <link>{item['link']}</link>\n"
            f"      <description>{item['description']}</description>\n"
            f"      <guid>{item['guid']}</guid>\n"
            "    </item>"
        )
    return "\n\n".join(formatted)


def update_rss_file(home_sections: list[Section], article_sections: list[Section]) -> bool:
    content = RSS_PATH.read_text(encoding="utf-8")
    existing_items = parse_existing_rss_items(content)
    desired_items = build_rss_items(home_sections, article_sections)

    if existing_items == desired_items:
        print("RSS content already matches section content. No update needed.")
        return False

    match = re.search(r"^(.*?</item>)(.*?)(</channel>.*)$", content, re.DOTALL)
    if not match:
        raise SystemExit("Unable to locate RSS item section in rss.xml")

    prefix = match.group(1).rstrip()
    suffix = match.group(3)
    new_items = format_rss_items(desired_items)
    updated = f"{prefix}\n\n{new_items}\n{suffix}"
    RSS_PATH.write_text(updated, encoding="utf-8")
    print("rss.xml updated")
    return True


def main() -> int:
    changed_files = run_git_diff()
    relevant = ROOT_FILES.intersection(changed_files)
    if not relevant:
        print("No changes in index.html or articles/index.html. Skipping RSS update.")
        return 0

    home_sections = parse_sections(Path("index.html"))
    article_sections = parse_sections(Path("articles/index.html"))
    if not home_sections and not article_sections:
        print("No sections found in HTML files. Skipping RSS update.")
        return 0

    updated = update_rss_file(home_sections, article_sections)
    return 0 if updated or True else 0


if __name__ == "__main__":
    raise SystemExit(main())
