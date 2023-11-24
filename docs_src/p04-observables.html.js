import { simplePage } from "./layout/simplePage.html.js";

import { el } from "deka-dom-el";
import { example } from "./components/example.html.js";
import { h3 } from "./components/pageUtils.html.js";
import { mnemonicUl } from "./components/mnemonicUl.html.js";
import { code } from "./components/code.html.js";
/** @param {string} url */
const fileURL= url=> new URL(url, import.meta.url);

/** @param {import("./types.d.ts").PageAttrs} attrs */
export function page({ pkg, info }){
	const page_id= info.id;
	return el(simplePage, { info, pkg }).append(
		el("h2", "Using observables to manage reactivity"),
		el("p").append(
			"How a program responds to variable data or user",
			" interactions is one of the fundamental problems of programming.",
			" If we desire to solve the issue in a declarative manner,",
			" observables may be a viable approach.",
		),
		el(code, { src: fileURL("./components/examples/observables/intro.js"), page_id }),
		
		el(h3, "Introducing observables"),
		el("p").append(
			"Using observables, we split program logic into the three parts.",
			" Firstly (α), we create a variable (constant) representing reactive",
			" value. Somewhere later, we can register (β) a logic reacting",
			" to the observable value changes. Similarly, in a remaining part (γ), we",
			" can update the observable value."
		),
		el(example, { src: fileURL("./components/examples/observables/observables.js"), page_id }),
		el("p").append(
			"All this is just an example of ",
			el("a", { textContent: "Event-driven programming", href: "https://en.wikipedia.org/wiki/Event-driven_programming", title: "Wikipedia: Event-driven programming" }),
			" and ",
			el("a", { textContent: "Publish–subscribe pattern", href: "https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern", title: "Wikipedia: Publish–subscribe pattern" }),
			" (compare for example with ", el("a", { textContent: "fpubsub library", href: "https://www.npmjs.com/package/fpubsub", title: "NPM package: fpubsub" }), ").",
			" All three parts can be in some manner independent and still connected",
			" to the same reactive entity."
		),
		el("p").append(
			"Observables are implemented in the library as functions. To see current value",
			" of observable, just call it without any arguments ", el("code", "console.log(observable())"), ".",
			" To update the observable value, pass any argument ", el("code", "observable('a new value')"), ".",
			" For listenning the observable value changes, use ", el("code", "O.on(observable, console.log)"), "."
		),
		el("p").append(
			"Similarly to the ", el("code", "on"), " function to register DOM events listener.",
			" You can use ", el("code", "AbortController"), "/", el("code", "AbortSignal"), " to",
			" ", el("em", "off"), "/stop listenning. For representing “live” piece of code computation pattern:"
		),
		el(example, { src: fileURL("./components/examples/observables/computations-abort.js"), page_id }),
		el(mnemonicUl).append(
			el("li").append(
				el("code", "O(<value>)"), " — observable: reactive value",
			),
			el("li").append(
				el("code", "O(()=> <computation>)"), " — observable: reactive value dependent on calculation using other observables",
			),
			el("li").append(
				el("code", "O.on(<observable>, <listener>[, <options>])"), " — listen to the observable value changes",
			),
			el("li").append(
				el("code", "O.clear(...<observables>)"), " — off and clear observables",
			),
			el("li").append(
				el("code", "O(<value>, <actions>)"), " — observable: pattern to create complex reactive objects/arrays",
			),
			el("li").append(
				el("code", "O.action(<observable>, <action-name>, ...<action-arguments>)"), " — invoke an action for given observable"
			)
		),
	);
}
