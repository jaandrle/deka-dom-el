let is_registered= {};
import { styles } from "../index.css.js";
export const css= styles().scope(example).css`
:host{
	grid-column: 1/-1;
	width: 100%;
	max-width: calc(9/5 * var(--body-max-width));
	height: calc(3/5 * var(--body-max-width));
	margin-inline: auto;
}
`
import { el } from "deka-dom-el";
/**
 * Prints code to the page and registers flems to make it interactive.
 * @param {object} attrs
 * @param {URL} attrs.src Example code file path
 * @param {string} [attrs.language="javascript"] Language of the code
 * @param {string} attrs.page_id ID of the page
 * @param {import("../types.d.ts").registerClientFile} attrs.registerClientFile
 * */
export function example({ src, language= "javascript", page_id, registerClientFile }){
	registerClientPart(page_id, registerClientFile);
	const code= s.cat(src).toString()
		.replaceAll(' from "../../../index-with-signals.js";', ' from "https://cdn.jsdelivr.net/gh/jaandrle/deka-dom-el/dist/esm-with-signals.js";');
	const id= "code-"+Math.random().toString(36).slice(2, 7);
	return el().append(
		el("div", { id, className: example.name }).append(
			el("pre").append(
				el("code", { className: "language-"+language, textContent: code })
			)
		),
		elCode({ id, content: code })
	);
}
function elCode({ id, content }){
	const options= JSON.stringify({
		files: [{ name: ".js", content }],
		toolbar: false
	});
	return el("script", `Flems(document.getElementById("${id}"), JSON.parse(${JSON.stringify(options)}));`);
}
function registerClientPart(page_id, registerClientFile){
	if(is_registered[page_id]) return;
	
	//★  Highlite code when no flems?
	document.head.append(
		el("script", { src: "https://flems.io/flems.html", type: "text/javascript", charset: "utf-8" }),
		//★ el("script", { src: "https://cdn.jsdelivr.net/npm/shiki", defer: true }),
	);
	//★ egisterClientFile(
	//★  new URL("./example.js.js", import.meta.url),
	//★  el("script", { type: "module" })
	//★ ;
	is_registered[page_id]= true;
}
