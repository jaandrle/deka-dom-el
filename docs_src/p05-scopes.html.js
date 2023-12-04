import { simplePage } from "./layout/simplePage.html.js";

import { el } from "deka-dom-el";
import { example } from "./components/example.html.js";
import { h3 } from "./components/pageUtils.html.js";
import { mnemonic } from "./components/mnemonic/scopes-init.js";
import { code } from "./components/code.html.js";
/** @param {string} url */
const fileURL= url=> new URL(url, import.meta.url);

/** @param {import("./types.d.ts").PageAttrs} attrs */
export function page({ pkg, info }){
	const page_id= info.id;
	return el(simplePage, { info, pkg }).append(
		el("h2", "Using functions as UI components"),
		el("p").append(
			"For state-less components we can use functions as UI components (see “Elements” page).",
			" But in real life, we may need to handle the component live-cycle and provide",
			" JavaScript the way to properly use the ", el("a", { textContent: "Garbage collection", href: "https://developer.mozilla.org/en-US/docs/Glossary/Garbage_collection", title: "Garbage collection | MDN" }), "."
		),
		el(code, { src: fileURL("./components/examples/scopes/intro.js"), page_id }),
		el("p").append(
			"The library therefore use ", el("em", "scopes"), " to provide these functionalities.",
		),
		
		el(h3, "Scopes and hosts"),
		el("p").append(
			"The ", el("strong", "host"), " is the name for the element representing the component.",
			" This is typically element returned by function. To get reference, you can use ",
			el("code", "scope.host()"), " to applly addons just use ", el("code", "scope.host(...<addons>)"), "."
		),
		el(example, { src: fileURL("./components/examples/scopes/scopes-and-hosts.js"), page_id }),
		el("p").append(
			"To better understanding we implement function ", el("code", "elClass"), " helping to create",
			" component as class instances."
		),
		el(example, { src: fileURL("./components/examples/scopes/class-component.js"), page_id }),
		el("p").append(
			"As you can see, the ", el("code", "scope.host()"), " is stored temporarily and synchronously.",
			" Therefore, at least in the beginning of using library, it is the good practise to store",
			" ", el("code", "host"), " in the root of your component. As it may be changed, typically when",
			" there is asynchronous code in the component."
		),
		el(code, { src: fileURL("./components/examples/scopes/good-practise.js"), page_id }),

		el(h3, "Scopes, observables and cleaning magic"),
		el("p").append(
			"The ", el("code", "host"), " is internally used to register the cleaning procedure,",
			" when the component (", el("code", "host"), " element) is removed from the DOM."
		),
		el(example, { src: fileURL("./components/examples/scopes/cleaning.js"), page_id }),
		el("p").append(
			"The text content of the paragraph is changing when the value of the observable ", el("code", "textContent"),
			" is changed. Internally, there is association between ", el("code", "textContent"), " and the paragraph",
			" similar to using ", el("code", "S.on(textContent, /* update the paragraph */)"), "."
		),
		el("p").append(
			"This listener must be removed when the component is removed from the DOM. To do it, the library",
			" assign internally ", el("code", "on.disconnected(/* remove the listener */)(host())"), " to the host element."
		),
		el("p", { className: "notice" }).append(
			"The library DOM API and observables works ideally when used declaratively.",
			" It means, you split your app logic into three parts as it was itroduced in ", el("a", { textContent: "Observables", href: "http://localhost:40911/docs/p04-observables#h-introducing-observables" }), "."
		),
		el(code, { src: fileURL("./components/examples/scopes/declarative.js"), page_id }),
		el("p").append(
			"Strictly speaking, the imperative way of using the library is not prohibited.",
			" Just be careful (rather avoid) mixing declarative approach (using observables)",
			" and imperative manipulation of elements.",
		),
		el(code, { src: fileURL("./components/examples/scopes/imperative.js"), page_id }),

		el(mnemonic)
	);
}
