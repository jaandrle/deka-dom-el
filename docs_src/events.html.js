import "./global.css.js";
import { el } from "deka-dom-el";
import { example } from "./components/example.html.js";

/** @param {string} url */
const fileURL= url=> new URL(url, import.meta.url);
import { header } from "./layout/head.html.js";
import { prevNext } from "./components/prevNext.html.js";
/** @param {import("./types.d.ts").PageAttrs} attrs */
export function page({ pkg, info }){
	const page_id= info.id;
	return el().append(
		el(header, { info, pkg }),
		el("main").append(
			el("h2", "Listenning to the native DOM events and other Modifiers"),
			el("p").append(
				"We quickly introduce helper to listening to the native DOM events.",
				" ",
				"And library syntax/pattern so-called ", el("em", "Modifier"), " to",
				" incorporate not only this in UI templates declaratively."
			),
			
			el("h3", "Add events listeners"),
			el("p").append(
			),

			el(prevNext, info)
		)
	);
}
