(function() {
	    const scripts = document.getElementsByTagName('script');
	    const currentScript = scripts[scripts.length - 1];
	    const shouldRender = currentScript?.getAttribute('render-md') === 'true';

	    if (shouldRender) {
		            const link = document.createElement('link');
		            link.rel = 'stylesheet';
		            link.href = 'https://cdn.jsdelivr.net/npm/github-markdown-css@5.5.0/github-markdown.min.css';
		            document.head.appendChild(link);
		        }

	    document.addEventListener('DOMContentLoaded', function() {
		            const source = document.querySelector('#content');
		            const target = document.getElementById('article-markdown');

		            if (!source || !target) return;

		            const markdownText = source.value || source.textContent || '';
		            const renderer = window.marked?.parse || window.marked;

		            if (shouldRender && typeof renderer === 'function') {
				                target.innerHTML = renderer(markdownText.trim());
				                target.classList.add('markdown-body');
				            } else {
						                target.textContent = markdownText.trim();
						                target.style.whiteSpace = 'pre-wrap';
						            }
		        });
})();
