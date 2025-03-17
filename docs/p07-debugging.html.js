import { T, t } from "./utils/index.js";
export const info= {
	title: t`Debugging`,
	fullTitle: t`Debugging applications with dd<el>`,
	description: t`Techniques for debugging applications using dd<el>, especially signals.`,
};

import { el } from "deka-dom-el";
import { simplePage } from "./layout/simplePage.html.js";
import { example } from "./components/example.html.js";
import { h3 } from "./components/pageUtils.html.js";
import { code } from "./components/code.html.js";
/** @param {string} url */
const fileURL= url=> new URL(url, import.meta.url);

/** @param {import("./types.d.ts").PageAttrs} attrs */
export function page({ pkg, info }){
	const page_id= info.id;
	return el(simplePage, { info, pkg }).append(
		el("p").append(T`
			Debugging is an essential part of application development. This guide provides techniques
			and best practices for debugging applications built with dd<el>, with a focus on signals.
		`),

		el(h3, t`Debugging signals`),
		el("p").append(T`
			Signals are reactive primitives that update the UI when their values change. When debugging signals,
			you need to track their values, understand their dependencies, and identify why updates are or aren’t
			happening.
		`),

		el("h4", t`Inspecting signal values`),
		el("p").append(T`
			The simplest way to debug a signal is to log its current value by calling the get or valueOf method:
		`),
		el(code, { content: `
			const signal = S(0);
			console.log('Current value:', signal.valueOf());
		`, page_id }),
		el("div", { className: "warning" }).append(
			el("p").append(T`
				${el("code", "signal.get")} is OK, but in some situations may lead to unexpected results:
			`),
			el(code, { content: `
				const signal = S(0);
				const derived = S(()=> {
					console.log('Current value:', signal.get());
					// ↑ in rare cases this will register unwanted dependency
					// but typically this is fine ↓
					return signal.get() + 1;
				});
			` })
		),
		el("p").append(T`
			You can also monitor signal changes by adding a listener:
		`),
		el(code, { content: `
			// Log every time the signal changes
			S.on(signal, value => console.log('Signal changed:', value));
		`, page_id }),

		el("h4", t`Debugging derived signals`),
		el("p").append(T`
			With derived signals (created with ${el("code", "S(() => computation))")}), debugging is a bit more complex
			because the value depends on other signals. To understand why a derived signal isn’t updating correctly:
		`),
		el("ol").append(
			el("li", t`Check that all dependency signals are updating correctly`),
			el("li", t`Add logging/debugger inside the computation function to see when it runs`),
			el("li", t`Verify that the computation function actually accesses the signal values with .get()`)
		),
		el(example, { src: fileURL("./components/examples/debugging/consoleLog.js"), page_id }),

		el("h4", t`Examining signal via DevTools`),
		el("p").append(T`
			${el("code", "<signal>.__dde_signal")} - A Symbol property used to identify and store the internal state of
			signal objects. It contains the following information:
		`),
		el("ul").append(
			el("li", t`listeners: A Set of functions called when the signal value changes`),
			el("li", t`actions: Custom actions that can be performed on the signal`),
			el("li", t`onclear: Functions to run when the signal is cleared`),
			el("li", t`host: Reference to the host element/scope in which the signal was created`),
			el("li", t`readonly: Boolean flag indicating if the signal is read-only`)
		),
		el("p").append(T`
			…to determine the current value of the signal, call ${el("code", "signal.valueOf()")}. Don’t hesitate to
			use the debugger to inspect the signal object.
		`),

		el("h4", t`Debugging with breakpoints`),
		el("p").append(T`
			Effective use of breakpoints can help track signal flow:
		`),
		el("ul").append(
			el("li").append(T`
				Set breakpoints in signal update methods to track when values change
			`),
			el("li").append(T`
				Use conditional breakpoints to only break when specific signals change to certain values
			`),
			el("li").append(T`
				Set breakpoints in your signal computation functions to see when derived signals recalculate
			`),
			el("li").append(T`
				Use performance profiling to identify bottlenecks in signal updates
			`)
		),

		el(h3, t`Common signal debugging issues`),
		el("h4", t`Signal updates not triggering UI changes`),
		el("p", t`If signal updates aren’t reflected in the UI, check:`),
		el("ul").append(
			el("li", t`That you’re using signal.set() to update the value, not modifying objects/arrays directly`),
			el("li", t`For mutable objects, ensure you’re using actions or making proper copies before updating`),
			el("li", t`That the signal is actually connected to the DOM element (check your S.el or attribute binding
				code)`),
			el("li").append(T`
				That you’re passing signal corecctly (without using ${el("code", "*.get()")}) and for ${el("code",
				"S.el")} that you passing (derived) signals not a function (use ${el("code",
				"S.el(S(()=> count.get() % 2), odd=> …)")}).
			`),
		),
		el(code, { src: fileURL("./components/examples/debugging/mutations.js"), page_id }),

		el("h4", t`Memory leaks with signal listeners`),
		el("p").append(T`
			Signal listeners can cause memory leaks if not properly cleaned up. Always use AbortSignal
			to cancel listeners when they are used ouside the dd<el> knowledge (el, assign, S.el, … auto cleanup
			unnecessarily signals automatically).
		`),

		el("h4", t`Performance issues with frequently updating signals`),
		el("p", t`If you notice performance issues with signals that update very frequently:`),
		el("ul").append(
			el("li", t`Consider debouncing or throttling signal updates`),
			el("li", t`Make sure derived signals don’t perform expensive calculations unnecessarily`),
			el("li", t`Keep signal computations focused and minimal`)
		),
		el(code, { src: fileURL("./components/examples/debugging/debouncing.js"), page_id }),

		el(h3, t`Browser DevTools tips for components and reactivity`),
		el("p").append(T`
			When debugging in the browser, dd<el> provides several helpful DevTools-friendly features:
		`),

		el("h4", t`Finding reactive elements in the DOM`),
		el("p").append(T`
			When using ${el("code", "S.el()")}, dd<el> creates reactive elements in the DOM
			that are automatically updated when signal values change. These elements are wrapped in special
			comment nodes for debugging (to be true they are also used internally, so please do not edit them by hand):
		`),
		el(code, { src: fileURL("./components/examples/debugging/dom-reactive-mark.html"), page_id }),
		el("p").append(T`
			This is particularly useful when debugging why a reactive section isn’t updating as expected.
			You can inspect the elements between the comment nodes to see their current state and the
			signal connections through \`__dde_reactive\` of the host element.
		`),

		el("h4", t`Identifying components in the DOM`),
		el("p").append(T`
			dd<el> marks components in the DOM with special comment nodes to help you identify component boundaries.
			Components created with ${el("code", "el(MyComponent)")} are marked with comment nodes
			${el("code", `<!--<dde:mark type="component" name="MyComponent" host="parentElement"/>-->`)} and
			includes:
		`),
		el("ul").append(
			el("li", t`type - Identifies the type of marker ("component", "reactive", …)`),
			el("li", t`name - The name of the component function`),
			el("li", t`host - Indicates whether the host is "this" (for DocumentFragments) or "parentElement"`),
		),

		el("h4", t`Identifying reactive elements in the DOM`),
		el("p").append(T`
			You can inspect (host) element relationships and bindings with signals in the DevTools console using
			${el("code", "$0.__dde_reactive")} (for currently selected element). In the console you will see a list of
			${el("code", `[ [ signal, listener ], element, property ]`)}, where:
		`),
		el("ul").append(
			el("li", t`signal — the signal triggering the changes`),
			el("li", t`listener — the listener function (this is an internal function for dd<el>)`),
			el("li", t`element — the DOM element that is bound to the signal`),
			el("li", t`property — the attribute or property name which is changing based on the signal`),
		),
		el("p").append(T`
			…the structure of \`__dde_reactive\` utilizes the browser’s behavior of packing the first field,
			so you can see the element and property that changes in the console right away. These properties make it
			easier to understand the reactive structure of your application when inspecting elements.
		`),
		el(example, { src: fileURL("./components/examples/signals/debugging-dom.js"), page_id }),

		el("p", { className: "note" }).append(T`
			${el("code", "<element>.__dde_reactive")} - An array property on DOM elements that tracks signal-to-element
			relationships.  This allows you to quickly identify which elements are reactive and what signals they’re
			bound to. Each entry in the array contains:
		`),

		el("h4", t`Inspecting events and listeners in DevTools`),
		el("p").append(T`
			Modern browser DevTools provide built-in tools for inspecting event listeners attached to DOM elements.
			For example, in Firefox and Chrome, you can:
		`),
		el("ol").append(
			el("li", t`Select an element in the Elements/Inspector panel`),
			el("li", t`Look for the "Event Listeners" tab or section`),
			el("li", t`See all event listeners attached to the element, including those added by dd<el>`)
		),
		el("p").append(T`
			Additionally, dd<el> provides special markers in the DOM that help identify debug information.
			Look for comments with ${el("code", "dde:mark")}, ${el("code", "dde:disconnected")} and ${el("code",
				"__dde_reactive")} which indicate components, reactive regions, and other internal relationships:
		`),
		el("figure").append(
			el("img", {
				src: "./assets/devtools.png",
				alt: "Screenshot of DevTools showing usage of “event” button to inspect event listeners",
			}),
			el("figcaption", t`Firefox DevTools showing dd<el> debugging information with event listeners and reactive
				markers`)
		),
	);
}
