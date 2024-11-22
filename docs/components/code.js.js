const highlighter= await globalThis.shiki.getHighlighter({
	theme: "css-variables",
	langs: ["js", "ts", "css", "html", "shell"],
});
const codeBlocks= document.querySelectorAll('code[class*="language-"]');

codeBlocks.forEach((block)=> {
	const lang= block.className.replace("language-", "");
	block.parentElement.dataset.js= "done";
	const html= highlighter.codeToHtml(block.textContent, { lang });
	block.innerHTML= html;
});
