(function() {
    var scripts = document.getElementsByTagName('script');
    var shouldRender = scripts[scripts.length - 1]?.getAttribute('render-md') === 'true';

    var copyIconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="18px" viewBox="0 0 24 24"><path fill="#666666" d="M21 8.94a1.3 1.3 0 0 0-.06-.27v-.09a1 1 0 0 0-.19-.28l-6-6a1 1 0 0 0-.28-.19a.3.3 0 0 0-.09 0a.9.9 0 0 0-.33-.11H10a3 3 0 0 0-3 3v1H6a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3v-1h1a3 3 0 0 0 3-3zm-6-3.53L17.59 8H16a1 1 0 0 1-1-1ZM15 19a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h1v7a3 3 0 0 0 3 3h5Zm4-4a1 1 0 0 1-1 1h-8a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3v3a3 3 0 0 0 3 3h3Z"/></svg>';
    var copiedIconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="18px" viewBox="0 0 24 24"><path fill="#0ba800" d="m9 16.2l-3.5-3.5a.984.984 0 0 0-1.4 0a.984.984 0 0 0 0 1.4l4.19 4.19c.39.39 1.02.39 1.41 0L20.3 7.7a.984.984 0 0 0 0-1.4a.984.984 0 0 0-1.4 0z"/></svg>';

    if (shouldRender) {
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/github-markdown-css@5.5.0/github-markdown.min.css';
        document.head.appendChild(link);
    }

    function render() {
        var source = document.getElementById('article-markdown-source');
        var target = document.getElementById('article-markdown');
        if (!source || !target) return;

        var text = source.value || source.textContent || '';
        if (shouldRender && window.marked && typeof window.marked.parse === 'function') {
            var result = window.marked.parse(text.trim());
            if (result && typeof result.then === 'function') {
                result.then(function(html) {
                    target.innerHTML = html;
                    target.classList.add('markdown-body');
                    fixStyles(target);
                    addCodeCopyButtons(target);
                });
            } else {
                target.innerHTML = result;
                target.classList.add('markdown-body');
                fixStyles(target);
                addCodeCopyButtons(target);
            }
        } else {
            target.innerText = text.trim();
        }
    }

    function fixStyles(container) {
        container.style.backgroundColor = 'transparent';
        container.style.color = 'white';
    }

    function addCodeCopyButtons(container) {
        var codeBlocks = container.querySelectorAll('pre > code, code:not(pre code)');
        codeBlocks.forEach(function(code) {
            if (code.dataset.copyButtonAdded) return;
            code.dataset.copyButtonAdded = 'true';

            var button = document.createElement('button');
            button.type = 'button';
            button.className = 'md-copy-btn';
            button.setAttribute('aria-label', '复制代码');
            button.setAttribute('title', '复制代码');
            button.innerHTML = copyIconSvg;
            button.style.border = 'none';
            button.style.borderRadius = '0';
            button.style.background = 'transparent';
            button.style.color = 'inherit';
            button.style.cursor = 'pointer';
            button.style.display = 'flex';
            button.style.alignItems = 'center';
            button.style.justifyContent = 'center';
            button.style.zIndex = '10';
            button.style.lineHeight = '1';
            button.style.fontSize = '1rem';
            button.style.padding = '0.15rem';
            button.style.width = '1.8rem';
            button.style.height = '1.8rem';
            button.style.position = 'absolute';
            button.style.top = '0.4rem';
            button.style.right = '0.35rem';
            button.style.minWidth = '1.6rem';
            button.style.minHeight = '1.6rem';

            button.addEventListener('click', function(event) {
                event.preventDefault();
                var text = code.innerText || '';
                if (!text) return;
                copyTextToClipboard(text).then(function() {
                    button.innerHTML = copiedIconSvg;
                    setTimeout(function() {
                        button.innerHTML = copyIconSvg;
                    }, 2500);
                });
            });

            var pre = code.parentElement;
            if (pre && pre.tagName === 'PRE') {
                pre.style.position = 'relative';
                pre.appendChild(button);
            } else {
                code.style.background = '#161B12';
                code.style.color = '#e6e6e6';
                code.style.borderRadius = '0.35rem';
                code.style.padding = '0.1rem 0.35rem';
                code.style.lineHeight = '1.4';
                code.style.whiteSpace = 'pre';
                button.style.top = '50%';
                button.style.right = '5px';
                button.style.transform = 'translateY(-50%)';
                button.style.width = '1.6rem';
                button.style.height = '1.6rem';
                button.style.padding = '0.12rem';

                var wrapper = document.createElement('span');
                wrapper.style.position = 'relative';
                wrapper.style.display = 'inline-block';
                wrapper.style.verticalAlign = 'middle';
                wrapper.style.paddingRight = '2.1rem';
                wrapper.style.marginRight = '-2.1rem';
                wrapper.style.whiteSpace = 'nowrap';
                code.parentNode.insertBefore(wrapper, code);
                wrapper.appendChild(code);
                wrapper.appendChild(button);
            }
        });
    }

    function copyTextToClipboard(text) {
        if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
            return navigator.clipboard.writeText(text);
        }

        return new Promise(function(resolve, reject) {
            var textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.left = '-9999px';
            textarea.style.top = '0';
            document.body.appendChild(textarea);
            textarea.focus();
            textarea.select();
            try {
                var successful = document.execCommand('copy');
                document.body.removeChild(textarea);
                successful ? resolve() : reject();
            } catch (err) {
                document.body.removeChild(textarea);
                reject(err);
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', render);
    } else {
        render();
    }

    window.fixMarkdownStyles = fixStyles;
    window.addCodeCopyButtons = addCodeCopyButtons;
})();
