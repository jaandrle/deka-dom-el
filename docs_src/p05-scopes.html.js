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

		el(mnemonic)
	);
}
