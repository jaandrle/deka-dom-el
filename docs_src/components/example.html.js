let loaded= false;
import { styles } from "../index.css.js";
export const css= styles().scope(example).css`
:host{
	--body-max-width: 80rem;
	height: 20rem;
}
`
import { el } from "../../jsdom.js";
export function example({ src, language= "javascript" }){
	register();
	const cwd= "components";
	src= "."+src.slice(src.indexOf(cwd)+cwd.length);
	const code= s.cat(new URL(src, import.meta.url))
		.toString()
		.replaceAll(' from "../../../index-with-signals.js";', ' from "https://cdn.jsdelivr.net/gh/jaandrle/deka-dom-el/dist/esm-with-signals.js";');
	const id= "code-"+Math.random().toString(36).slice(2, 7);
	return el("<>").append(
		el("div", { id, className: example.name }).append(
			el("pre").append(
				el("code", {
					className: "language-"+language,
					textContent: code
				})
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
	return el("script", `Flems(document.getElementById("${id}"), JSON.parse(${options}));`);
}
function register(){
	if(loaded) return;
	document.head.append(
		el("script", { src: "https://flems.io/flems.html", type: "text/javascript", charset: "utf-8" })
	);
	loaded= true;
}
