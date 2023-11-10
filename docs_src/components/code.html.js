import { registerClientFile, styles } from "../ssr.js";
styles.scope(code).css`
:host{
	--shiki-color-text: #e9eded;
	--shiki-color-background: #212121;
	--shiki-token-constant: #82b1ff;
	--shiki-token-string: #c3e88d;
	--shiki-token-comment: #546e7a;
	--shiki-token-keyword: #c792ea;
	--shiki-token-parameter: #AA0000;
	--shiki-token-function: #80cbae;
	--shiki-token-string-expression: #c3e88d;
	--shiki-token-punctuation: var(--code);
	--shiki-token-link: #EE0000;
	white-space: pre;
}
:host[data-js=todo]{
	border: 1px solid var(--border);
	border-radius: var(--standard-border-radius);
	margin-bottom: 1rem;
	${/* to fix shift when → dataJS=done */""}
	margin-top: 18.4px;
	padding: 1rem 1.4rem;
}
`;
import { el } from "deka-dom-el";
/**
 * Prints code to the page and registers flems to make it interactive.
 * @param {object} attrs
 * @param {string} [attrs.id]
 * @param {string} [attrs.className]
 * @param {string} attrs.content Example code file path
 * @param {"js"|"ts"|"html"|"css"} [attrs.language="js"] Language of the code
 * @param {string} [attrs.page_id] ID of the page, if setted it registers shiki
 * */
export function code({ id, content, language= "js", className= "code", page_id }){
	let dataJS;
	if(page_id){
		registerClientPart(page_id);
		dataJS= "todo";
	}
	return el("div", { id, className, dataJS }).append(
		el("code", { className: "language-"+language, textContent: content })
	);
}
let is_registered= {};
/** @param {string} page_id */
function registerClientPart(page_id){
	if(is_registered[page_id]) return;
	
	document.head.append(
		 el("script", { src: "https://cdn.jsdelivr.net/npm/shiki", defer: true }),
	);
	registerClientFile(
		new URL("./code.js.js", import.meta.url),
		el("script", { type: "module" })
	);
	is_registered[page_id]= true;
}
