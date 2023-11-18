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
			el("p").append(
				"We start with creating and modifying a static elements and end up with UI templates.",
				" ",
				el("i").append(
					"From ", el("code", "document.createElement"), " to ", el("code", "el"), "."
				),
				" ",
				"Then we go through the native events system and the way to include it declaratively in UI templates.",
				" ",
				el("i").append(
					"From ", el("code", "element.addEventListener"), " to ", el("code", "on"), "."
				),
			),
			el("p").append(
				"Next step is providing interactivity not only for our UI templates.",
				" ",
				"We introduce signals (", el("code", "S"), ") and how them incorporate to UI templates.",
			),
			el("p").append(
				"Now we will clarify how the signals are incorporated into our templates with regard ",
				"to application performance. This is not the only reason the library uses ",
				el("code", "scope"), "s. We will look at how they work in components represented ",
				"in JavaScript by functions."
			),
			el(example, { src: new URL("./components/examples/helloWorld.js", import.meta.url), page_id }),
			el(prevNext, info)
		)
	);
}
