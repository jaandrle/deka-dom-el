import { styles } from "../ssr.js";
const host= "."+example.name;
styles.css`
${host}{
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
`;

const dde_content= s.cat(new URL("../../dist/esm-with-observables.js", import.meta.url)).toString();

import { el } from "deka-dom-el";
import { code } from "./code.html.js";
import { relative } from "node:path";
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
		.replaceAll(/ from "deka-dom-el(\/observables)?";/g, ' from "./esm-with-observables.js";');
	const id= "code-example-"+generateCodeId(src);
	return el().append(
		el(code, { id, content, language, className: example.name }),
		elCode({ id, content, extension: "."+language })
	);
}
function elCode({ id, content, extension: name }){
	const options= JSON.stringify({
		files: [{ name, content }, { name: "esm-with-observables.js", content: dde_content }],
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
