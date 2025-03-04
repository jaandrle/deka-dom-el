import { T, t } from "./utils/index.js";
export const info= {
	title: t`Debugging`,
	description: t`Techniques for debugging applications using deka-dom-el, especially signals.`,
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
		el("h2", t`Debugging applications with deka-dom-el`),
		el("p").append(...T`
			Debugging is an essential part of application development. This guide provides techniques
			and best practices for debugging applications built with deka-dom-el, with a focus on signals.
		`),

		el(h3, t`Debugging signals`),
		el("p").append(...T`
			Signals are reactive primitives that update the UI when their values change. When debugging signals,
			you need to track their values, understand their dependencies, and identify why updates are or aren't happening.
		`),

		el("h4", t`Inspecting signal values`),
		el("p").append(...T`
			The simplest way to debug a signal is to log its current value by calling the get method:
		`),
		el("pre").append(
			el("code", "const signal = S(0);\nconsole.log('Current value:', signal.get());")
		),
		el("p").append(...T`
			You can also monitor signal changes by adding a listener:
		`),
		el("pre").append(
			el("code", "// Log every time the signal changes\nS.on(signal, value => console.log('Signal changed:', value));")
		),

		el("h4", t`Debugging derived signals`),
		el("p").append(...T`
			With derived signals (created with S(() => computation)), debugging is a bit more complex
			because the value depends on other signals. To understand why a derived signal isn't updating correctly:
		`),
		el("ol").append(
			el("li", t`Check that all dependency signals are updating correctly`),
			el("li", t`Add logging inside the computation function to see when it runs`),
			el("li", t`Verify that the computation function actually accesses the signal values with .get()`)
		),
		el(example, { src: fileURL("./components/examples/debugging/consoleLog.js"), page_id }),

		el(h3, t`Common signal debugging issues`),
		el("h4", t`Signal updates not triggering UI changes`),
		el("p").append(...T`
			If signal updates aren't reflected in the UI, check:
		`),
		el("ul").append(
			el("li", t`That you're using signal.set() to update the value, not modifying objects/arrays directly`),
			el("li", t`For mutable objects, ensure you're using actions or making proper copies before updating`),
			el("li", t`That the signal is actually connected to the DOM element (check your S.el or attribute binding code)`)
		),
		el(code, { src: fileURL("./components/examples/debugging/mutations.js"), page_id }),

		el("h4", t`Memory leaks with signal listeners`),
		el("p").append(...T`
			Signal listeners can cause memory leaks if not properly cleaned up. Always use AbortSignal
			to cancel listeners.
		`),

		el("h4", t`Performance issues with frequently updating signals`),
		el("p").append(...T`
			If you notice performance issues with signals that update very frequently:
		`),
		el("ul").append(
			el("li", t`Consider debouncing or throttling signal updates`),
			el("li", t`Make sure derived signals don't perform expensive calculations unnecessarily`),
			el("li", t`Keep signal computations focused and minimal`)
		),
		el(code, { src: fileURL("./components/examples/debugging/debouncing.js"), page_id }),

		el(h3, t`Browser DevTools tips for deka-dom-el`),
		el("p").append(...T`
			When debugging in the browser, here are some helpful techniques:
		`),
		el("ul").append(
			el("li").append(...T`
				Use the Elements panel to inspect the DOM structure created by deka-dom-el
			`),
			el("li").append(...T`
				Set breakpoints in your signal handlers and actions
			`),
			el("li").append(...T`
				Use performance profiling to identify bottlenecks in signal updates
			`),
		),
	);
}
