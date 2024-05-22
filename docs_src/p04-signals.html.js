export const info= {
	title: "Signals and reactivity",
	description: "Handling reactivity in UI via signals.",
};

import { el } from "deka-dom-el";
import { simplePage } from "./layout/simplePage.html.js";
import { example } from "./components/example.html.js";
import { h3 } from "./components/pageUtils.html.js";
import { mnemonic } from "./components/mnemonic/signals-init.js";
import { code } from "./components/code.html.js";
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
		el(code, { src: fileURL("./components/examples/signals/intro.js"), page_id }),
		
		el(h3, "Introducing signals"),
		el("p").append(
			"Using signals, we split program logic into the three parts.",
			" Firstly (α), we create a variable (constant) representing reactive",
			" value. Somewhere later, we can register (β) a logic reacting",
			" to the signal value changes. Similarly, in a remaining part (γ), we",
			" can update the signal value."
		),
		el(example, { src: fileURL("./components/examples/signals/signals.js"), page_id }),
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
			" ", el("em", "off"), "/stop listenning. In example, you also found the way for representing",
			" “live” piece of code computation pattern (derived signal):"
		),
		el(example, { src: fileURL("./components/examples/signals/computations-abort.js"), page_id }),

		el(h3, "Signals and actions"),
		el("p").append(
			el("code", "S(/* primitive */)"), " allows you to declare simple reactive variables, typically",
			" around ", el("em", "immutable"), " ", el("a", { textContent: "primitive types", title: "Primitive | MDN", href: "https://developer.mozilla.org/en-US/docs/Glossary/Primitive" }), ".",
			" ",
			"However, it may also be necessary to use reactive arrays, objects, or other complex reactive structures."
		),
		el(example, { src: fileURL("./components/examples/signals/actions-demo.js"), page_id }),
		el("p", "…but typical user-case is object/array (maps, sets and other mutable objects):"),
		el(example, { src: fileURL("./components/examples/signals/actions-todos.js"), page_id }),
		el("p").append(
			"In some way, you can compare it with ", el("a", { textContent: "useReducer", href: "https://react.dev/reference/react/useReducer", title: "useReducer hook | React docs" }),
			" hook from React. So, the ", el("code", "S(<data>, <actions>)"), " pattern creates",
			" a store “machine”. We can then invoke (dispatch) registered action by calling",
			" ", el("code", "S.action(<signal>, <name>, ...<args>)"), " after the action call",
			" the signal calls all its listeners. This can be stopped by calling ", el("code", "this.stopPropagation()"),
			" in the method representing the given action. As it can be seen in examples, the “store” value is",
			" available also in the function for given action (", el("code", "this.value"), ")."
		),

		el(h3, "Reactive DOM attributes and elements"),
		el("p", "There are on basic level two distinc situation to mirror dynamic value into the DOM/UI"),
		el("ol").append(
			el("li", "to change some attribute(s) of existing element(s)"),
			el("li", "to generate elements itself dynamically – this covers conditions and loops")
		),
		el(example, { src: fileURL("./components/examples/signals/dom-attrs.js"), page_id }),
		el("p").append(
			"To derived attribute based on value of signal variable just use the signal as",
			" a value of the attribute (", el("code", "assign(element, { attribute: S('value') })"), ").",
			" ", el("code", "assign"), "/", el("code", "el"), " provides ways to glue reactive attributes/classes",
			" more granularly into the DOM. Just use dedicated build-in attributes ", el("code", "dataset"), ", ",
			el("code", "ariaset"), " and ", el("code", "classList"), "."
		),
		el("p").append(
			"For computation, you can use the “derived signal” (see above) like ", el("code", "assign(element, { textContent: S(()=> 'Hello '+WorldSignal()) })"), ".",
			" ",
			"This is read-only signal its value is computed based on given function and updated when any signal used in the function changes."
		),
		el("p").append(
			"To represent part of the template filled dynamically based on the signal value use ", el("code", "S.el(signal, DOMgenerator)"), ".",
			" This was already used in the todo example above or see:"
		),
		el(example, { src: fileURL("./components/examples/signals/dom-el.js"), page_id }),

		el(mnemonic)
	);
}
