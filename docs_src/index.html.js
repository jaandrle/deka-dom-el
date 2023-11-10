import { el } from "deka-dom-el";
import "./global.css.js";
import { example } from "./components/example.html.js";

import { header } from "./layout/head.html.js";
import { prevNext } from "./components/prevNext.html.js";
/** @param {import("./types.d.ts").PageAttrs} attrs */
export function page({ pkg, info }){
	const page_id= info.id;
	return el().append(
		el(header, { info, pkg }),
		el("main").append(
			el("p", "The library tries to provide pure JavaScript tool(s) to create reactive interfaces."),
			el(example, { src: new URL("./components/examples/helloWorld.js", import.meta.url), page_id }),
			el(prevNext, info)
		)
	);
}
