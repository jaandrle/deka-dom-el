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
			el(example, { src: new URL("./components/examples/helloWorld.js", import.meta.url), page_id, registerClientFile }),
		)
	);
}
