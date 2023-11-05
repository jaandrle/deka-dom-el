const langs= {
	javascript: 'js',
	js: 'js',
	html: 'html',
};

const highlighter= await shiki.getHighlighter({
	theme: 'css-variables',
	langs: ['js', 'html', 'shell'],
});
const codeBlocks= document.querySelectorAll('pre code[class*="language-"]');

codeBlocks.forEach((block)=> {
	const lang= block.className.replace('language-', '');
	const html= highlighter.codeToHtml(block.textContent, {
		lang: langs[lang] || lang,
	});
	block.innerHTML= html;
});
