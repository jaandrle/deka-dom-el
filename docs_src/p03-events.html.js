export const info= {
	title: "Events and Addons",
	description: "Using not only events in UI declaratively.",
};

import { el } from "deka-dom-el";
import { simplePage } from "./layout/simplePage.html.js";
import { example } from "./components/example.html.js";
import { h3 } from "./components/pageUtils.html.js";
import { mnemonic } from "./components/mnemonic/events-init.js";
import { code } from "./components/code.html.js";
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
		
		el(code, { src: fileURL("./components/examples/events/intro.js"), page_id }),
		
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
		el("p").append(
			"To provide intuitive behaviour, similar also to how the life-cycle events works in other",
			" frameworks/libraries, deka-dom-el library ensures that ", el("code", "on.connected"),
			" and ", el("code", "on.disconnected"), " are called only once and only when the element",
			" is (dis)connected to live DOM. The solution is inspired by ", el("a", { textContent: "Vue", href: "https://vuejs.org/guide/extras/web-components.html#lifecycle", title: "Vue and Web Components | Lifecycle" }), ".",
			" For using native behaviour re-(dis)connecting element, use:"
		),
		el("ul").append(
			el("li").append("custom ", el("code", "MutationObserver"), " or logic in (dis)", el(code, "connectedCallback"), " or…"),
			el("li").append("re-add ", el("code", "on.connected"), " or ", el("code", "on.disconnected"), " listeners.")
		),

		el(h3, "Final notes"),
		el("p", "The library also provides a method to dispatch the events."),
		el(example, { src: fileURL("./components/examples/events/compareDispatch.js"), page_id }),
		
		el(mnemonic)
	);
}
