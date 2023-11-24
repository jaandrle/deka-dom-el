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
		el("h2", "Using signals to manage reactivity"),
		el("p").append(
			"How a program responds to variable data or user",
			" interactions is one of the fundamental problems of programming.",
			" If we desire to solve the issue in a declarative manner,",
			" signals may be a viable approach.",
		),
		el(example, { src: fileURL("./components/examples/signals/intro.js"), page_id }),
		
		el(h3, "Introducing signals"),
		el("p").append(
			"Using signals, we split program logic into the three parts.",
			" Firstly (α), we create a variable (constant) representing reactive",
			" value. Somewhere later, we can register (β) a logic reacting",
			" to the signal value changes. Similarly, in a remaining part (γ), we",
			" can update the signal value."
		),
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
			"Signals are implemented in the library as functions. To see current value",
			" of signal, just call it without any arguments ", el("code", "console.log(signal())"), ".",
			" To update the signal value, pass any argument ", el("code", "signal('a new value')"), ".",
			" For listenning the signal value changes, use ", el("code", "S.on(signal, console.log)"), "."
		),
		el("p").append(
			"Similarly to the ", el("code", "on"), " function to register DOM events listener.",
			" You can use ", el("code", "AbortController"), "/", el("code", "AbortSignal"), " to",
			" ", el("em", "off"), "/stop listenning. For representing “live” piece of code computation pattern:"
		),
		el(example, { src: fileURL("./components/examples/signals/computations-abort.js"), page_id }),
		el("div", { className: "notice" }).append(
			el("p", "Mnemonic"),
			el("ul").append(
				el("li").append(
					el("code", "S(<value>)"), " — signal: reactive value",
				),
				el("li").append(
					el("code", "S(()=> <computation>)"), " — signal: reactive value dependent on calculation using other signals",
				),
				el("li").append(
					el("code", "S.on(<signal>, <listener>[, <options>])"), " — listen to the signal value changes",
				),
				el("li").append(
					el("code", "S.clear(...<signals>)"), " — off and clear signals",
				),
				el("li").append(
					el("code", "S(<value>, <actions>)"), " — signal: pattern to create complex reactive objects/arrays",
				),
				el("li").append(
					el("code", "S.action(<signal>, <action-name>, ...<action-arguments>)"), " — invoke an action for given signal"
				)
			)
		),
	);
}
