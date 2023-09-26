import { el } from "../jsdom.js";
import { head as headCommon } from "./layout/head.html.js";
export function head(pkg, path_target){
	return headCommon({
		id: "index",
		title: pageName(pkg),
		description: "Introducing basic concepts.",
		pkg, path_target
	});
}

import { styles, common } from "./index.css.js";
import { example, css as example_css } from "./components/example.html.js";
export const css= styles()
.include(common)
.css`
.note{
	font-size: .9rem;
	font-style: italic;
}
`
.include(example_css);
export function body(pkg){
	return el("<>").append(
		el("h1", pageName(pkg)),
		el("p").append(
			"The library tries to provide pure JavaScript tool(s) to create reactive interfaces.",
			"The main goals are:"
		),
		el("ul").append(
			el("li", "provide a small wrapper around the native JavaScript DOM"),
			el("li", "keep library size under 10kB"),
			el("li", "zero dependencies (if possible)"),
			el("li", "prefer a declarative/functional approach"),
			el("li", "unopinionated (allow alternative methods)"),
		),
		el("p", { className: "note" }).append(
			"It is, in fact, an reimplementation of ",
			el("a", {
				href: "https://github.com/jaandrle/dollar_dom_component",
				title: "GitHub repository of library. Motto: Functional DOM components without JSX and virtual DOM.",
				textContent: "jaandrle/dollar_dom_component"
			}),
			".",
		),
		example({ src: "./components/examples/helloWorld.js" })
	);
}
function pageName(pkg){
	return `\`${pkg.name}\` — Introduction/Guide`;
}
