import "./global.css.js";
import { el } from "deka-dom-el";

import { header } from "./layout/head.html.js";
import { example } from "./components/example.html.js";
import { prevNext } from "./components/prevNext.html.js";

/** @param {string} url */
const fileURL= url=> new URL(url, import.meta.url);

/** @param {import("./types.d.ts").PageAttrs} attrs */
export function page({ pkg, info }){
	const page_id= info.id;
	return el().append(
		el(header, { info, pkg }),
		el("main").append(
			el("h2", "Listenning to the native DOM events and other Addons"),
			el("p").append(
				"We quickly introduce helper to listening to the native DOM events.",
				" ",
				"And library syntax/pattern so-called ", el("em", "Addon"), " to",
				" incorporate not only this in UI templates declaratively."
			),
			
			el("h3", "Events and listenners"),
			el("p").append(
				"In JavaScript you can listen to the native DOM events of the given element by using ",
				el("a", { href: "https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener", title: "addEventListener on MDN" }).append(
					el("code", "element.addEventListener(type, listener, options)")
				), ".",
				" ",
				"The library provides an alternative (", el("code", "on"), ") accepting the differen order",
				" of the arguments:"
			),
			el(example, { src: fileURL("./components/examples/events/compare.js"), page_id }),
			el("p").append(
				"…this is actually one of the two differences. The another one is that", el("code", "on"),
				" accepts only object as the ", el("code", "options"), " (but it is still optional)."
			),
			el("p").append(
				"The other difference is that there is ", el("strong", "no"), " ", el("code", "off"), " function.",
				" ",
				"You can remove listener declaratively using ", el("a", { textContent: "AbortSignal", href: "https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#signal", title: "part of addEventListener on MDN" }),
				":"
			),
			el(example, { src: fileURL("./components/examples/events/abortSignal.js"), page_id }),

			el("h3", "Addons"),
			el("p").append(
				"From practical point of view, ", el("em", "Addons"), " are just functions that accept any html element",
				" as their first parameter. You can see that the ", el("code", "on(…)"), " fullfills this requirement."
			),
			el("p").append(
				"You can use Addons as ≥3rd argument of ", el("code", "el"), " function. This way is possible to extends",
				" you templates by additional (3rd party) functionalities. But for now mainly, you can add events listeners:"
			),
			el(example, { src: fileURL("./components/examples/events/templateWithListeners.js"), page_id }),
			el("p").append(
				"As the example shows, you can also provide types in JSDoc+TypeScript by using global type ", el("code", "ddeElementAddon"), ".",
				" ",
				"Also notice, you can use Addons to get element reference.",
			),
			el("h3", "Life cycle events"),
			el("p", "Addons are called immediately when the element is created, event it is not connected to live DOM yet."),
			// todo

			// dispatchEvent

			el(prevNext, info)
		)
	);
}
