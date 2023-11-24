import { simplePage } from "./layout/simplePage.html.js";

import { el } from "deka-dom-el";
import { example } from "./components/example.html.js";
import { h3 } from "./components/pageUtils.html.js";
/** @param {string} url */
const fileURL= url=> new URL(url, import.meta.url);
/** @param {import("./types.d.ts").PageAttrs} attrs */
export function page({ pkg, info }){
	const page_id= info.id;
	return el(simplePage, { info, pkg }).append(
		el("h2", "Listenning to the native DOM events and other Addons"),
		el("p").append(
			"We quickly introduce helper to listening to the native DOM events.",
			" ",
			"And library syntax/pattern so-called ", el("em", "Addon"), " to",
			" incorporate not only this in UI templates declaratively."
		),
		
		el(h3, "Events and listenners"),
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
			"…this is actually one of the two differences. The another one is that ", el("code", "on"),
			" accepts only object as the ", el("code", "options"), " (but it is still optional)."
		),
		el("p", { className: "notice" }).append(
			"The other difference is that there is ", el("strong", "no"), " ", el("code", "off"), " function.",
			" ",
			"You can remove listener declaratively using ", el("a", { textContent: "AbortSignal", href: "https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#signal", title: "part of addEventListener on MDN" }),
			":"
		),
		el(example, { src: fileURL("./components/examples/events/abortSignal.js"), page_id }),
		el("div", { className: "notice" }).append(
			el("p", "So, there are (typically) three ways to handle events. You can use:"),
			el("ul").append(
				el("li").append( el("code", `el("button", { textContent: "click me", "=onclick": "console.log(event)" })`)),
				el("li").append( el("code", `el("button", { textContent: "click me", onclick: console.log })`)),
				el("li").append( el("code", `el("button", { textContent: "click me" }, on("click", console.log))`))
			),
			el("p").append(
				"In the first example we force to use HTML attribute (it corresponds to ", el("code", `<button onclick="console.log(event)">click me</button>`), ").",
				" ",
				el("em", "Side note: this can be useful in case of SSR."),
				" ",
				"To study difference, you can read a nice summary here: ", el("a", { href: "https://gist.github.com/WebReflection/b404c36f46371e3b1173bf5492acc944", textContent: "GIST @WebReflection/web_events.md" }), "."
			)
		),

		el(h3, "Addons"),
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
		el(h3, "Life-cycle events"),
		el("p").append(
			"Addons are called immediately when the element is created, even it is not connected to live DOM yet.",
			" ",
			"Therefore, you can understand the Addon to be “oncreate” event."
		),
		el("p").append(
			"The library provide three additional live-cycle events corresponding to how they are named in",
			" a case of custom elements: ", el("code", "on.connected"), ", ", el("code", "on.disconnected"),
			" and ", el("code", "on.attributeChanged"), "."
		),
		el(example, { src: fileURL("./components/examples/events/live-cycle.js"), page_id }),
		el("p").append(
			"For Custom elements, we will later introduce a way to replace ", el("code", "*Callback"),
			" syntax with ", el("code", "dde:*"), " events. The ", el("code", "on.*"), " functions then",
			" listen to the appropriate Custom Elements events (see ", el("a", { textContent: "Custom element lifecycle callbacks | MDN", href: "https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements#custom_element_lifecycle_callbacks" }), ")."
		),
		el("p").append(
			"But, in case of regular elemnets the ", el("a", { href: "https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver" }).append(el("code", "MutationObserver"), " | MDN"),
			" is internaly used to track these events. Therefore, there are some drawbacks:",
		),
		el("ul").append(
			el("li").append(
				"To proper listener registration, you need to use ", el("code", "on.*"), " not `on(\"dde:*\", …)`!"
			),
			el("li").append(
				"Use sparingly! Internally, library must loop of all registered events and fires event properly.",
				" ",
				el("strong", "It is good practice to use the fact that if an element is removed, its children are also removed!"),
				" ",
				"In this spirit, we will introduce later the ", el("strong", "host"), " syntax to register",
				" clean up procedures when the component is removed from the app."
			),
		),

		el(h3, "Final notes"),
		el("p", "The library also provides a method to dispatch the events."),
		el(example, { src: fileURL("./components/examples/events/compareDispatch.js"), page_id }),
		
		el("div", { className: "notice" }).append(
			el("p", "Mnemonic"),
			el("ul").append(
				el("li").append(
					el("code", "on(<event>, <listener>[, <options>])(<element>)"), " — just ", el("code", "<element>.addEventListener(<event>, <listener>[, <options>])")
				),
				el("li").append(
					el("code", "on.<live-cycle>(<event>, <listener>[, <options>])(<element>)"), " — corresponds to custom elemnets callbacks ", el("code", "<live-cycle>Callback(...){...}"),
					". To connect to custom element see following page, else it is simulated by MutationObserver."
				),
				el("li").append(
					el("code", "dispatchEvent(<event>[, <options>])(element)"), " — just ", el("code", "<element>.dispatchEvent(new Event(<event>[, <options>]))")
				),
				el("li").append(
					el("code", "dispatchEvent(<event>[, <options>])(element, detail)"), " — just ", el("code", "<element>.dispatchEvent(new CustomEvent(<event>, { detail, ...<options> }))")
				),
			)
		),
	);
}
