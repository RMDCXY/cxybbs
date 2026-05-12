(function() {
    var scripts = document.getElementsByTagName('script');
    var shouldRender = scripts[scripts.length - 1]?.getAttribute('render-md') === 'true';

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
                });
            } else {
                target.innerHTML = result;
                target.classList.add('markdown-body');
                fixStyles(target);
            }
        } else {
            target.innerText = text.trim();
        }
    }

    function fixStyles(container) {
        container.style.backgroundColor = 'transparent';
        container.style.color = 'white';
        
        var codes = container.querySelectorAll('pre, code');
        codes.forEach(function(code) {
            code.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
            code.style.color = '#e6e6e6';
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', render);
    } else {
        render();
    }
})();
