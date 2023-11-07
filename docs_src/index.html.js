import { el } from "deka-dom-el";
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

import { header } from "./layout/head.html.js";
/** @param {import("./types.d.ts").PageAttrs} attrs */
export function page({ pkg, info, path_target, pages, registerClientFile }){
	const page_id= info.id;
	return el().append(
		el(header, { info, pkg, path_target, pages }),
		el("main").append(
			el("p", "The library tries to provide pure JavaScript tool(s) to create reactive interfaces. "),
			el("p", "The main goals are:"),
			el("ul").append(
				el("li", "provide a small wrappers/utilities around the native JavaScript DOM"),
				el("li", "keep library size around 10kB at maximum (if possible)"),
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
			el(example, { src: new URL("./components/examples/helloWorld.js", import.meta.url), page_id, registerClientFile }),
		)
	);
}
