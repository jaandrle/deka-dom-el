import { T, t } from "./utils/index.js";
export const info= {
	title: t`Signals and reactivity`,
	description: t`Handling reactivity in UI via signals.`,
};

import { el } from "deka-dom-el";
import { simplePage } from "./layout/simplePage.html.js";
import { example } from "./components/example.html.js";
import { h3 } from "./components/pageUtils.html.js";
import { mnemonic } from "./components/mnemonic/signals-init.js";
import { code } from "./components/code.html.js";
/** @param {string} url */
const fileURL= url=> new URL(url, import.meta.url);
const references= {
	wiki_event_driven: { /** Event-driven programming */
		title: t`Wikipedia: Event-driven programming`,
		href: "https://en.wikipedia.org/wiki/Event-driven_programming",
	},
	wiki_pubsub: { /** Publish–subscribe pattern */
		title: t`Wikipedia: Publish–subscribe pattern`,
		href: "https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern",
	},
	fpubsub: { /** NPM package: fpubsub */
		title: t`NPM package: fpubsub`,
		href: "https://www.npmjs.com/package/fpubsub",
	},
	mdn_primitive: { /** JS Primitives | MDN */
		title: t`Primitive | MDN`,
		href: "https://developer.mozilla.org/en-US/docs/Glossary/Primitive",
	},
	mdn_use_reducer: { /** useReducer */
		title: t`useReducer hook | React docs`,
		href: "https://react.dev/reference/react/useReducer",
	}
};
/** @param {import("./types.d.ts").PageAttrs} attrs */
export function page({ pkg, info }){
	const page_id= info.id;
	return el(simplePage, { info, pkg }).append(
		el("h2", t`Using signals to manage reactivity`),
		el("p").append(...T`
			How a program responds to variable data or user interactions is one of the fundamental problems of
			programming. If we desire to solve the issue in a declarative manner, signals may be a viable approach.
		`),
		el(code, { src: fileURL("./components/examples/signals/intro.js"), page_id }),
		
		el(h3, t`Introducing signals`),
		el("p").append(...T`
			Let’s re-introduce
			${el("a", { textContent: t`3PS principle`, href: "./#h-event-driven-programming--parts-separation--ps" })}.
		`),
		el("p").append(...T`
			Using signals, we split program logic into the three parts. Firstly (α), we create a variable (constant)
			representing reactive value. Somewhere later, we can register (β) a logic reacting to the signal value
			changes. Similarly, in a remaining part (γ), we can update the signal value.
		`),
		el(example, { src: fileURL("./components/examples/signals/signals.js"), page_id }),
		el("p").append(...T`
			All this is just an example of 
			${el("a", { textContent: t`Event-driven programming`, ...references.wiki_event_driven })} and
			${el("a", { textContent: t`Publish–subscribe pattern`, ...references.wiki_pubsub })} (compare for example
			with ${el("a", { textContent: t`fpubsub library`, ...references.fpubsub })}). All three parts can be in
			some manner independent and still connected to the same reactive entity.
		`),
		el("p").append(...T`
			Signals are implemented in the library as functions. To see current value of signal, just call it without
			any arguments ${el("code", "console.log(signal())")}. To update the signal value, pass any argument
			${el("code", `signal('${t`a new value`}')`)}. For listenning the signal value changes, use
			${el("code", "S.on(signal, console.log)")}.
		`),
		el("p").append(...T`
			Similarly to the ${el("code", "on")} function to register DOM events listener. You can use
			${el("code", "AbortController")}/${el("code", "AbortSignal")} to ${el("em", "off")}/stop listenning. In
			example, you also found the way for representing “live” piece of code computation pattern (derived signal):
		`),
		el(example, { src: fileURL("./components/examples/signals/computations-abort.js"), page_id }),

		el(h3, t`Signals and actions`),
		el("p").append(...T`
			${el("code", `S(/* ${t`primitive`} */)`)} allows you to declare simple reactive variables, typically, around
			${el("em", t`immutable`)} ${el("a", { textContent: t`primitive types`, ...references.mdn_primitive })}.
			However, it may also be necessary to use reactive arrays, objects, or other complex reactive structures.
		`),
		el(example, { src: fileURL("./components/examples/signals/actions-demo.js"), page_id }),
		el("p", t`…but typical user-case is object/array (maps, sets and other mutable objects):`),
		el(example, { src: fileURL("./components/examples/signals/actions-todos.js"), page_id }),
		el("p").append(...T`
			In some way, you can compare it with ${el("a", { textContent: "useReducer", ...references.mdn_use_reducer })}
			hook from React. So, the ${el("code", "S(<data>, <actions>)")} pattern creates a store “machine”. We can
			then invoke (dispatch) registered action by calling ${el("code", "S.action(<signal>, <name>, ...<args>)")}
			after the action call the signal calls all its listeners. This can be stopped by calling
			${el("code", "this.stopPropagation()")} in the method representing the given action. As it can be seen in
			examples, the “store” value is available also in the function for given action (${el("code", "this.value")}).
		`),

		el(h3, t`Reactive DOM attributes and elements`),
		el("p", t`There are on basic level two distinc situation to mirror dynamic value into the DOM/UI`),
		el("ol").append(
			el("li", t`to change some attribute(s) of existing element(s)`),
			el("li", t`to generate elements itself dynamically – this covers conditions and loops`)
		),
		el(example, { src: fileURL("./components/examples/signals/dom-attrs.js"), page_id }),
		el("p").append(...T`
			To derived attribute based on value of signal variable just use the signal as a value of the attribute
			(${el("code", "assign(element, { attribute: S('value') })")}). ${el("code", "assign")}/${el("code", "el")}
			 provides ways to glue reactive attributes/classes more granularly into the DOM. Just use dedicated build-in
			 attributes ${el("code", "dataset")}, ${el("code", "ariaset")} and ${el("code", "classList")}.
		`),
		el("p").append(...T`
			For computation, you can use the “derived signal” (see above) like
			${el("code", "assign(element, { textContent: S(()=> 'Hello '+WorldSignal()) })")}. This is read-only signal
			its value is computed based on given function and updated when any signal used in the function changes.
		`),
		el("p").append(...T`
			To represent part of the template filled dynamically based on the signal value use
			${el("code", "S.el(signal, DOMgenerator)")}. This was already used in the todo example above or see:
		`),
		el(example, { src: fileURL("./components/examples/signals/dom-el.js"), page_id }),

		el(mnemonic)
	);
}
