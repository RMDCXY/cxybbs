#!/usr/bin/env python3
import os
import re
import subprocess
from datetime import datetime, timezone
from pathlib import Path
from dataclasses import dataclass
from typing import List, Set, Dict, Any

ROOT_FILES = {"index.html", "articles/index.html"}
RSS_PATH = Path("rss.xml")
BASE_URL = "https://cxybbs.top"

# 固定的欢迎条目（手动修正 RSS 中包含的）
WELCOME_ITEM = {
    "title": "欢迎订阅CXYBBS~",
    "link": "https://cxybbs.top",
    "description": "建议开启RSS阅读器的“嵌入网页”“iframe”等选项，否则可能无法正常阅读专栏~",
    "guid": "https://cxybbs.top",
}


@dataclass
class Section:
    title: str = ""
    subtitle: str = ""
    href: str = ""


def extract_div_block(text: str, start: int):
    """提取从 start 开始的 <div> 块，返回 (block_text, next_pos)"""
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


def parse_sections(file_path: Path) -> List[Section]:
    """从 index.html 或 articles/index.html 中提取所有 section-card 信息"""
    if not file_path.exists():
        return []
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
            title_match = re.search(
                r'<div[^>]*class=["\'][^"\']*section-title[^"\']*["\'][^>]*>(.*?)</div>',
                block, re.S
            )
            subtitle_match = re.search(
                r'<div[^>]*class=["\'][^"\']*section-subtitle[^"\']*["\'][^>]*>(.*?)</div>',
                block, re.S
            )
            # 只取第一个 <a> 标签的 href（即最重要的链接）
            href_match = re.search(r'<a[^>]*href=["\']([^"\']+)["\']', block)
            if title_match and href_match:
                title = title_match.group(1).strip()
                subtitle = subtitle_match.group(1).strip() if subtitle_match else ""
                href = href_match.group(1).strip()
                results.append(Section(title=title, subtitle=subtitle, href=href))
            idx = new_pos
        else:
            idx = line_end + 1
    return results


def run_git_diff() -> Set[str]:
    """获取本次 push 或 workflow_dispatch 中变更的文件列表"""
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


def is_force_update() -> bool:
    """强制更新条件：手动触发或环境变量 FORCE_RSS_UPDATE=true"""
    if os.environ.get("FORCE_RSS_UPDATE", "false").lower() == "true":
        return True
    if os.environ.get("GITHUB_EVENT_NAME") == "workflow_dispatch":
        return True
    return False


def normalize_link(href: str) -> str:
    """将相对路径转换为绝对 URL"""
    href = href.strip()
    if href.startswith(("http://", "https://")):
        return href
    if href.startswith("./"):
        href = href[2:]
    if href.endswith(".html"):
        href = href[:-5]  # 移除 .html
    if href.startswith("/"):
        return f"{BASE_URL}{href}"
    if href.startswith("#"):
        return f"{BASE_URL}/{href}"
    return f"{BASE_URL}/{href}"


def parse_article_pubdate(subtitle: str) -> str | None:
    """从副标题中提取日期，并转换为 RFC 822 格式"""
    if not subtitle.startswith("撰写于"):
        return None
    date_text = subtitle[len("撰写于"):].strip().rstrip("。")
    match = re.search(r"(\d{4})年\s*(\d{1,2})月\s*(\d{1,2})日", date_text)
    if not match:
        return None
    year, month, day = map(int, match.groups())
    dt = datetime(year, month, day, tzinfo=timezone.utc)
    return dt.strftime("%a, %d %b %Y %H:%M:%S GMT")


def build_rss_items(home_sections: List[Section], article_sections: List[Section]) -> List[Dict[str, str]]:
    """构建期望的 RSS items 列表（包含固定的欢迎条目）"""
    items = []
    seen_guids: Set[str] = set()

    # 1. 固定欢迎条目
    if WELCOME_ITEM["guid"] not in seen_guids:
        seen_guids.add(WELCOME_ITEM["guid"])
        items.append(WELCOME_ITEM.copy())

    # 2. 首页 sections（外部链接或项目）
    for section in home_sections:
        link = normalize_link(section.href)
        # 跳过明显的锚点链接（以 /# 开头）—— 实际上现在只取第一个a，不会出现锚点，但保留安全检查
        if link.startswith(f"{BASE_URL}/#"):
            continue
        item = {
            "title": section.title,
            "link": link,
            "description": section.subtitle,
            "guid": link,
        }
        if item["guid"] not in seen_guids:
            seen_guids.add(item["guid"])
            items.append(item)

    # 3. 专栏文章 sections
    for section in article_sections:
        link = normalize_link(section.href)
        # 从链接中提取文章 ID（例如 /articles/01）
        match = re.search(r"/articles/([0-9A-Za-z_-]+)$", link)
        if match:
            article_id = match.group(1)
            title = f"专栏#{article_id} - {section.title}"
        else:
            title = section.title
        description = section.subtitle
        if description.startswith("撰写于"):
            description = f"本专栏{description}。"
        item = {
            "title": title,
            "link": link,
            "description": description,
            "guid": link,
        }
        pubdate = parse_article_pubdate(section.subtitle)
        if pubdate:
            item["pubDate"] = pubdate
        if item["guid"] not in seen_guids:
            seen_guids.add(item["guid"])
            items.append(item)

    return items


def parse_existing_rss_items(rss_text: str) -> List[Dict[str, str]]:
    """从现有 rss.xml 中提取 items（忽略模板示例）"""
    items = []
    item_pattern = re.compile(r"<item>(.*?)</item>", re.DOTALL)
    for item_xml in item_pattern.findall(rss_text):
        title_match = re.search(r"<title>(.*?)</title>", item_xml, re.DOTALL)
        link_match = re.search(r"<link>(.*?)</link>", item_xml, re.DOTALL)
        desc_match = re.search(r"<description>(.*?)</description>", item_xml, re.DOTALL)
        guid_match = re.search(r"<guid>(.*?)</guid>", item_xml, re.DOTALL)
        pub_match = re.search(r"<pubDate>(.*?)</pubDate>", item_xml, re.DOTALL)

        if title_match and link_match and desc_match and guid_match:
            item = {
                "title": title_match.group(1).strip(),
                "link": link_match.group(1).strip(),
                "description": desc_match.group(1).strip(),
                "guid": guid_match.group(1).strip(),
            }
            if pub_match:
                item["pubDate"] = pub_match.group(1).strip()
            items.append(item)
    return items


def items_equal(a: List[Dict], b: List[Dict]) -> bool:
    """比较两个 item 列表是否内容相同（忽略顺序，按 guid 排序）"""
    if len(a) != len(b):
        return False
    key = lambda x: x.get("guid", "")
    return sorted(a, key=key) == sorted(b, key=key)


def format_rss_items(items: List[Dict[str, str]]) -> str:
    """将 items 列表格式化为 RSS XML 字符串"""
    formatted = []
    for item in items:
        lines = [
            "    <item>",
            f"      <title>{item['title']}</title>",
            f"      <link>{item['link']}</link>",
            f"      <description>{item['description']}</description>",
        ]
        if item.get("pubDate"):
            lines.append(f"      <pubDate>{item['pubDate']}</pubDate>")
        lines.append(f"      <guid>{item['guid']}</guid>")
        lines.append("    </item>")
        formatted.append("\n".join(lines))
    return "\n\n".join(formatted)


def update_rss_file(home_sections: List[Section], article_sections: List[Section], force: bool = False) -> bool:
    """
    更新 rss.xml 文件。
    如果 force=False 且内容无变化，则返回 False 不写入。
    如果 force=True，则无论内容是否相同都强制写入并返回 True。
    """
    content = RSS_PATH.read_text(encoding="utf-8")
    desired_items = build_rss_items(home_sections, article_sections)

    if not force:
        existing_items = parse_existing_rss_items(content)
        if items_equal(existing_items, desired_items):
            print("RSS content already matches section content. No update needed.")
            return False

    # 定位 <item> 列表的起始和结束位置，替换中间的 items
    match = re.search(r"(.*?<item>.*?</item>.*?)(</channel>.*)$", content, re.DOTALL)
    if not match:
        # 兼容可能没有预先存在的 item 的情况
        match = re.search(r"(.*?)(</channel>.*)$", content, re.DOTALL)
        if not match:
            raise SystemExit("Unable to locate channel section in rss.xml")
        prefix = match.group(1).rstrip()
        suffix = match.group(2)
        new_items = format_rss_items(desired_items)
        updated = f"{prefix}\n\n{new_items}\n{suffix}"
    else:
        prefix = match.group(1).rstrip()
        suffix = match.group(2)
        new_items = format_rss_items(desired_items)
        updated = f"{prefix}\n\n{new_items}\n{suffix}"

    RSS_PATH.write_text(updated, encoding="utf-8")
    print("rss.xml updated" + (" (forced)" if force else ""))
    return True


def main() -> int:
    force = is_force_update()

    if force:
        print("Force update enabled (manual trigger). Will regenerate RSS even if content unchanged.")
    else:
        changed_files = run_git_diff()
        relevant = ROOT_FILES.intersection(changed_files)
        if not relevant:
            print("No changes in index.html or articles/index.html. Skipping RSS update.")
            return 0

    # 解析两个 HTML 文件
    home_sections = parse_sections(Path("index.html"))
    article_sections = parse_sections(Path("articles/index.html"))

    if not home_sections and not article_sections:
        print("No sections found in HTML files. Skipping RSS update.")
        return 0

    updated = update_rss_file(home_sections, article_sections, force=force)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())