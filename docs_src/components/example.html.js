import { styles } from "../ssr.js";
styles.scope(example).css`
:host{
	grid-column: full-main;
	width: 100%;
	max-width: calc(9/5 * var(--body-max-width));
	height: calc(3/5 * var(--body-max-width));
	margin-inline: auto;
}
.CodeMirror, .CodeMirror-gutters {
	background: #212121 !important;
	border: 1px solid white;
}
`
import { el } from "deka-dom-el";
import { code } from "./code.html.js";
/**
 * Prints code to the page and registers flems to make it interactive.
 * @param {object} attrs
 * @param {URL} attrs.src Example code file path
 * @param {"js"|"ts"|"html"|"css"} [attrs.language="js"] Language of the code
 * @param {string} attrs.page_id ID of the page
 * */
export function example({ src, language= "js", page_id }){
	registerClientPart(page_id);
	const content= s.cat(src).toString()
		.replaceAll(/ from "deka-dom-el(\/signals)?";/g, ' from "https://cdn.jsdelivr.net/gh/jaandrle/deka-dom-el/dist/esm-with-signals.js";');
	const id= "code-"+Math.random().toString(36).slice(2, 7);
	return el().append(
		el(code, { id, content, language, className: example.name }),
		elCode({ id, content, extension: "."+language })
	);
}
function elCode({ id, content, extension: name }){
	const options= JSON.stringify({
		files: [{ name, content }],
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
