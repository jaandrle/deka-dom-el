import { styles } from "../ssr.js";
const host= "."+example.name;
styles.css`
${host} {
	grid-column: full-main;
	width: calc(100% - .75em);
	height: calc(4/6 * var(--body-max-width));
	border-radius: var(--border-radius);
	box-shadow: var(--shadow);
	border: 1px solid var(--border);
}
${host} .runtime {
	background-color: whitesmoke;
}

/* CodeMirror styling to match our theme */
.CodeMirror {
	height: 100% !important;
	font-family: var(--font-mono) !important;
	font-size: .85rem !important;
	line-height: 1.5 !important;
}

/* Dark mode styles for CodeMirror */
.CodeMirror, .CodeMirror-gutters {
	background: var(--code-bg) !important;
	color: var(--text) !important;
}

/* Light mode adjustments for CodeMirror - using CSS variables */
@media (prefers-color-scheme: light) {
	/* Core syntax elements */
	.cm-s-material .cm-keyword { color: var(--shiki-token-keyword, #d73a49) !important; }
	.cm-s-material .cm-atom { color: var(--shiki-token-constant, #005cc5) !important; }
	.cm-s-material .cm-number { color: var(--shiki-token-number, #005cc5) !important; }
	.cm-s-material .cm-def { color: var(--shiki-token-function, #6f42c1) !important; }
	.cm-s-material .cm-variable { color: var(--shiki-token-variable, #24292e) !important; }
	.cm-s-material .cm-variable-2 { color: var(--shiki-token-variable, #24292e) !important; }
	.cm-s-material .cm-variable-3 { color: var(--shiki-token-variable, #24292e) !important; }
	.cm-s-material .cm-property { color: var(--shiki-token-property, #005cc5) !important; }
	.cm-s-material .cm-operator { color: var(--shiki-token-operator, #d73a49) !important; }
	.cm-s-material .cm-comment { color: var(--shiki-token-comment, #6a737d) !important; }
	.cm-s-material .cm-string { color: var(--shiki-token-string, #22863a) !important; }
	.cm-s-material .cm-string-2 { color: var(--shiki-token-string, #22863a) !important; }
	.cm-s-material .cm-tag { color: var(--shiki-token-tag, #22863a) !important; }
	.cm-s-material .cm-attribute { color: var(--shiki-token-attribute, #005cc5) !important; }
	.cm-s-material .cm-bracket { color: var(--shiki-token-punctuation, #24292e) !important; }
	.cm-s-material .cm-punctuation { color: var(--shiki-token-punctuation, #24292e) !important; }
	.cm-s-material .cm-link { color: var(--shiki-token-link, #0366d6) !important; }
	.cm-s-material .cm-error { color: #f44336 !important; }
}

/* Handle theme toggle */
html[data-theme="light"] .CodeMirror {
	background: #f5f7fa !important;
}

html[data-theme="light"] .CodeMirror-gutters {
	background: #f5f7fa !important;
	border-right: 1px solid #e5e7eb !important;
}

/* Also apply the same styles to CodeMirror with data-theme */
html[data-theme="light"] .cm-s-material .cm-keyword { color: var(--shiki-token-keyword, #d73a49) !important; }
html[data-theme="light"] .cm-s-material .cm-atom { color: var(--shiki-token-constant, #005cc5) !important; }
html[data-theme="light"] .cm-s-material .cm-number { color: var(--shiki-token-number, #005cc5) !important; }
html[data-theme="light"] .cm-s-material .cm-def { color: var(--shiki-token-function, #6f42c1) !important; }
html[data-theme="light"] .cm-s-material .cm-variable { color: var(--shiki-token-variable, #24292e) !important; }
html[data-theme="light"] .cm-s-material .cm-variable-2 { color: var(--shiki-token-variable, #24292e) !important; }
html[data-theme="light"] .cm-s-material .cm-variable-3 { color: var(--shiki-token-variable, #24292e) !important; }
html[data-theme="light"] .cm-s-material .cm-property { color: var(--shiki-token-property, #005cc5) !important; }
html[data-theme="light"] .cm-s-material .cm-operator { color: var(--shiki-token-operator, #d73a49) !important; }
html[data-theme="light"] .cm-s-material .cm-comment { color: var(--shiki-token-comment, #6a737d) !important; }
html[data-theme="light"] .cm-s-material .cm-string { color: var(--shiki-token-string, #22863a) !important; }
html[data-theme="light"] .cm-s-material .cm-string-2 { color: var(--shiki-token-string, #22863a) !important; }
html[data-theme="light"] .cm-s-material .cm-tag { color: var(--shiki-token-tag, #22863a) !important; }
html[data-theme="light"] .cm-s-material .cm-attribute { color: var(--shiki-token-attribute, #005cc5) !important; }
html[data-theme="light"] .cm-s-material .cm-bracket { color: var(--shiki-token-punctuation, #24292e) !important; }
html[data-theme="light"] .cm-s-material .cm-punctuation { color: var(--shiki-token-punctuation, #24292e) !important; }
html[data-theme="light"] .cm-s-material .cm-link { color: var(--shiki-token-link, #0366d6) !important; }
html[data-theme="light"] .cm-s-material .cm-error { color: #f44336 !important; }

/* Mobile adjustments */
@media (max-width: 767px) {
	${host} {
		height: 50vh;
		max-width: 100%;
	}
	${host} main {
		flex-grow: 1;
		display: flex;
		flex-direction: column;
	}
	${host} main > * {
		width: 100%;
		max-width: 100% !important;
	}
}
${host}[data-variant=big]{
	height: 100vh;

	main {
		flex-flow: column nowrap;
		flex-grow: 1;
	}
	main > * {
		width: 100%;
		max-width: 100% !important;
	}
}
`;

const dde_content= s.cat(new URL("../../dist/esm-with-signals.js", import.meta.url)).toString();

import { el } from "deka-dom-el";
import { code } from "./code.html.js";
import { relative } from "node:path";
/**
 * Prints code to the page and registers flems to make it interactive.
 * @param {object} attrs
 * @param {URL} attrs.src Example code file path
 * @param {"js"|"ts"|"html"|"css"} [attrs.language="js"] Language of the code
 * @param {"normal"|"big"} [attrs.variant="normal"] Size of the example
 * @param {string} attrs.page_id ID of the page
 * */
export function example({ src, language= "js", variant= "normal", page_id }){
	registerClientPart(page_id);
	const content= s.cat(src).toString()
		.replaceAll(/ from "deka-dom-el(\/signals)?";/g, ' from "./esm-with-signals.js";');
	const id= "code-example-"+generateCodeId(src);
	return el().append(
		el(code, { id, content, language, className: example.name }, el=> el.dataset.variant= variant),
		elCode({ id, content, extension: "."+language })
	);
}
function elCode({ id, content, extension: name }){
	const options= JSON.stringify({
		files: [{ name, content }, { name: "esm-with-signals.js", content: dde_content }],
		toolbar: false
	});
	return el("script", `Flems(document.getElementById("${id}"), JSON.parse(${JSON.stringify(options)}));`);
}
let is_registered= {};
/** @param {string} page_id */
function registerClientPart(page_id){
	if(is_registered[page_id]) return;

	document.head.append(
		el("script", { src: "https://flems.io/flems.html", type: "text/javascript", charset: "utf-8" }),
	);
	is_registered[page_id]= true;
}
const store_prev= new Map();
/** @param {URL} src */
function generateCodeId(src){
	const candidate= parseInt(relative((new URL("..", import.meta.url)).pathname, src.pathname)
		.split("")
		.map(ch=> ch.charCodeAt(0))
		.join(""), 10)
		.toString(36)
		.replace(/000+/g, "");
	const count= 1 + ( store_prev.get(candidate) || 0 );
	store_prev.set(candidate, count);
	return count.toString()+"-"+candidate;
}
