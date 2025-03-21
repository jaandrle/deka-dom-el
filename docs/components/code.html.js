import { page_id, registerClientFile, styles } from "../ssr.js";
const host= "."+code.name;
styles.css`
/* Code block styling */
${host} {
	/* Theme for dark mode - matches Flems/CodeMirror dark theme */
	--shiki-color-text: #f8f8f2;
	--shiki-color-background: var(--code-bg);
	--shiki-token-constant: #82b1ff;
	--shiki-token-string: #c3e88d;
	--shiki-token-comment: #546e7a;
	--shiki-token-keyword: #c792ea;
	--shiki-token-parameter: #fd971f;
	--shiki-token-function: #80cbae;
	--shiki-token-string-expression: #c3e88d;
	--shiki-token-punctuation: #89ddff;
	--shiki-token-link: #82aaff;
	--shiki-token-variable: #f8f8f2;
	--shiki-token-number: #f78c6c;
	--shiki-token-boolean: #82b1ff;
	--shiki-token-tag: #f07178;
	--shiki-token-attribute: #ffcb6b;
	--shiki-token-property: #82b1ff;
	--shiki-token-operator: #89ddff;
	--shiki-token-regex: #c3e88d;
	--shiki-token-class: #ffcb6b;

	/* Basic styling */
	white-space: pre;
	tab-size: 2;
	overflow: auto;
	border-radius: var(--border-radius);
	font-family: var(--font-mono);
	font-size: .85rem;
	line-height: 1.5;
	position: relative;
	margin-block: 1rem;
	max-width: 100%;
}

/* Light mode overrides to match GitHub-like theme */
@media (prefers-color-scheme: light) {
	${host} {
		--shiki-color-text: #24292e;
		--shiki-color-background: var(--code-bg);
		--shiki-token-constant: #005cc5;
		--shiki-token-string: #22863a;
		--shiki-token-comment: #6a737d;
		--shiki-token-keyword: #d73a49;
		--shiki-token-parameter: #e36209;
		--shiki-token-function: #6f42c1;
		--shiki-token-string-expression: #22863a;
		--shiki-token-punctuation: #24292e;
		--shiki-token-link: #0366d6;
		--shiki-token-variable: #24292e;
		--shiki-token-number: #005cc5;
		--shiki-token-boolean: #005cc5;
		--shiki-token-tag: #22863a;
		--shiki-token-attribute: #005cc5;
		--shiki-token-property: #005cc5;
		--shiki-token-operator: #d73a49;
		--shiki-token-regex: #032f62;
		--shiki-token-class: #6f42c1;
	}
}

/* Support for theme toggles */
html[data-theme="light"] ${host} {
	--shiki-color-text: #24292e;
	--shiki-color-background: var(--code-bg);
	--shiki-token-constant: #005cc5;
	--shiki-token-string: #22863a;
	--shiki-token-comment: #6a737d;
	--shiki-token-keyword: #d73a49;
	--shiki-token-parameter: #e36209;
	--shiki-token-function: #6f42c1;
	--shiki-token-string-expression: #22863a;
	--shiki-token-punctuation: #24292e;
	--shiki-token-link: #0366d6;
	--shiki-token-variable: #24292e;
	--shiki-token-number: #005cc5;
	--shiki-token-boolean: #005cc5;
	--shiki-token-tag: #22863a;
	--shiki-token-attribute: #005cc5;
	--shiki-token-property: #005cc5;
	--shiki-token-operator: #d73a49;
	--shiki-token-regex: #032f62;
	--shiki-token-class: #6f42c1;
}

html[data-theme="dark"] ${host} {
	--shiki-color-text: #f8f8f2;
	--shiki-color-background: var(--code-bg);
	--shiki-token-constant: #82b1ff;
	--shiki-token-string: #c3e88d;
	--shiki-token-comment: #546e7a;
	--shiki-token-keyword: #c792ea;
	--shiki-token-parameter: #fd971f;
	--shiki-token-function: #80cbae;
	--shiki-token-string-expression: #c3e88d;
	--shiki-token-punctuation: #89ddff;
	--shiki-token-link: #82aaff;
	--shiki-token-variable: #f8f8f2;
	--shiki-token-number: #f78c6c;
	--shiki-token-boolean: #82b1ff;
	--shiki-token-tag: #f07178;
	--shiki-token-attribute: #ffcb6b;
	--shiki-token-property: #82b1ff;
	--shiki-token-operator: #89ddff;
	--shiki-token-regex: #c3e88d;
	--shiki-token-class: #ffcb6b;
}

/* Code block with syntax highlighting waiting for JS */
${host}[data-js=todo] {
	border: 1px solid var(--border);
	border-radius: var(--border-radius);
	padding: 1rem;
	background-color: var(--code-bg);
	position: relative;
}

/* Add a subtle loading indicator */
${host}[data-js=todo]::before {
	content: "Loading syntax highlighting...";
	position: absolute;
	top: 0.5rem;
	right: 0.5rem;
	font-size: 0.75rem;
	color: var(--text-light);
	background-color: var(--bg);
	padding: 0.25rem 0.5rem;
	border-radius: var(--border-radius);
	opacity: 0.7;
}

/* All code blocks should have consistent font and sizing */
${host} code {
	font-family: var(--font-mono);
	font-size: inherit;
	line-height: 1.5;
	padding: 0;
}
${host} pre {
	margin-block: 0;
	font-size: inherit;
}

/* Ensure line numbers (if added) are styled appropriately */
${host} .line-number {
	user-select: none;
	opacity: 0.5;
	margin-right: 1rem;
	min-width: 1.5rem;
	display: inline-block;
	text-align: right;
}

/* If there's a copy button, style it */
${host} .copy-button {
	position: absolute;
	top: 0.5rem;
	right: 0.5rem;
	background-color: var(--bg);
	color: var(--text);
	border: 1px solid var(--border);
	border-radius: var(--border-radius);
	padding: 0.25rem 0.5rem;
	font-size: 0.75rem;
	cursor: pointer;
	opacity: 0;
	transition: opacity 0.2s ease;
}

${host}:hover .copy-button {
	opacity: 1;
}
`;
import { el } from "deka-dom-el";
/**
 * @typedef {"js"|"ts"|"html"|"css"|"shell"|"-"} Language
 * */
/**
 * Prints code to the page and registers flems to make it interactive.
 * @param {object} attrs
 * @param {string} [attrs.id]
 * @param {string} [attrs.className]
 * @param {URL} [attrs.src] Example code file path
 * @param {string} [attrs.content] Example code
 * @param {Language} [attrs.language="-s"] Language of the code
 * */
export function code({ id, src, content, language= "-", className= host.slice(1) }){
	if(src){
		content= s.cat(src);
		if(language=== "-") language= /** @type {Language} */(src.pathname.split(".").pop());
	}
	content= normalizeIndentation(content);
	let dataJS;
	if(language!== "-"){
		registerClientPart();
		dataJS= "todo";
	}
	return el("div", { id, className, dataJS, tabIndex: 0 }).append(
		el("code", { className: "language-"+language, textContent: content.trim() })
	);
}
export function pre({ content }){
	content= normalizeIndentation(content);
	return el("pre").append(el("code", content.trim()));
}
let is_registered= {};
function registerClientPart(){
	if(is_registered[page_id]) return;

	// Add Shiki with a more reliable loading method
	document.head.append(
		// Use a newer version of Shiki with better performance
		el("script", { src: "https://cdn.jsdelivr.net/npm/shiki@0.14.3/dist/index.unpkg.iife.js", defer: true }),
	);

	registerClientFile(
		new URL("./code.js.js", import.meta.url),
		{
			head: el("script", { type: "module" }),
		}
	);

	is_registered[page_id]= true;
}
/** @param {string} src */
function normalizeIndentation(src){
	const lines= src.split("\n");
	const min_indent= Math.min(...lines.map(line=> line.search(/\S/)).filter(i=> i >= 0));
	return lines.map(line=> line.slice(min_indent)).join("\n");
}
