(function() {
    const scripts = document.getElementsByTagName('script');
    const render = scripts[scripts.length - 1]?.getAttribute('render-md') === 'true';

    if (render) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/github-markdown-css@5.5.0/github-markdown.min.css';
        document.head.appendChild(link);
    }

    document.addEventListener('DOMContentLoaded', () => {
        const source = document.querySelector('#article-markdown-source');
        const target = document.querySelector('#article-markdown');
        if (!source || !target) return;

        const text = source.value || source.textContent || '';
        const markedFn = window.marked?.parse || window.marked;

        if (render && typeof markedFn === 'function') {
            target.innerHTML = markedFn(text.trim());
            target.classList.add('markdown-body');
            target.style.whiteSpace = 'normal';
        } else {
            target.textContent = text.trim();
            target.style.whiteSpace = 'pre-wrap';
        }
    });
})();
