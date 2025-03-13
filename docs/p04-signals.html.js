import { T, t } from "./utils/index.js";
export const info= {
	title: t`Signals and Reactivity`,
	fullTitle: t`Building Reactive UIs with Signals`,
	description: t`Managing reactive UI state with signals.`,
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
	/** Event-driven programming */
	wiki_event_driven: {
		title: t`Wikipedia: Event-driven programming`,
		href: "https://en.wikipedia.org/wiki/Event-driven_programming",
	},
	/** Publish–subscribe pattern */
	wiki_pubsub: {
		title: t`Wikipedia: Publish–subscribe pattern`,
		href: "https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern",
	},
	/** NPM package: fpubsub */
	fpubsub: {
		title: t`NPM package: fpubsub`,
		href: "https://www.npmjs.com/package/fpubsub",
	},
	/** JS Primitives | MDN */
	mdn_primitive: {
		title: t`Primitive | MDN`,
		href: "https://developer.mozilla.org/en-US/docs/Glossary/Primitive",
	},
	/** useReducer */
	mdn_use_reducer: {
		title: t`useReducer hook | React docs`,
		href: "https://react.dev/reference/react/useReducer",
	}
};
/** @param {import("./types.d.ts").PageAttrs} attrs */
export function page({ pkg, info }){
	const page_id= info.id;
	return el(simplePage, { info, pkg }).append(
		el("p").append(T`
			Signals provide a simple yet powerful way to create reactive applications with dd<el>. They handle the
			fundamental challenge of keeping your UI in sync with changing data in a declarative, efficient way.
		`),
		el("div", { className: "callout" }).append(
			el("h4", t`What Makes Signals Special?`),
			el("ul").append(
				el("li", t`Fine-grained reactivity without complex state management`),
				el("li", t`Automatic UI updates when data changes`),
				el("li", t`Clean separation between data, logic, and UI`),
				el("li", t`Small runtime with minimal overhead`),
				el("li").append(T`${el("strong", "In future")} no dependencies or framework lock-in`)
			)
		),
		el(code, { src: fileURL("./components/examples/signals/intro.js"), page_id }),

		el(h3, t`The 3-Part Structure of Signals`),
		el("p").append(T`
			Signals organize your code into three distinct parts, following the
			${el("a", { textContent: t`3PS principle`, href: "./#h-3ps" })}:
		`),
		el("div", { className: "signal-diagram" }).append(
			el("div", { className: "signal-part" }).append(
				el("h4", t`PART 1: Create Signal`),
				el(code, { content: "const count = S(0);", page_id }),
				el("p", t`Define a reactive value that can be observed and changed`)
			),
			el("div", { className: "signal-part" }).append(
				el("h4", t`PART 2: React to Changes`),
				el(code, { content: "S.on(count, value => updateUI(value));", page_id }),
				el("p", t`Subscribe to signal changes with callbacks or effects`)
			),
			el("div", { className: "signal-part" }).append(
				el("h4", t`PART 3: Update Signal`),
				el(code, { content: "count.set(count.get() + 1);", page_id }),
				el("p", t`Modify the signal value, which automatically triggers updates`)
			)
		),
		el(example, { src: fileURL("./components/examples/signals/signals.js"), page_id }),

		el("div", { className: "note" }).append(
			el("p").append(T`
				Signals implement the ${el("a", { textContent: t`Publish–subscribe pattern`, ...references.wiki_pubsub
				})}, a form of ${el("a", { textContent: t`Event-driven programming`, ...references.wiki_event_driven
				})}.  This architecture allows different parts of your application to stay synchronized through
				a shared signal, without direct dependencies on each other. Compare for example with ${el("a", {
					textContent: t`fpubsub library`, ...references.fpubsub })}.
			`)
		),

		el(h3, t`Signal Essentials: Core API`),
		el("div", { className: "function-table" }).append(
			el("dl").append(
				el("dt", t`Creating a Signal`),
				el("dd", t`S(initialValue) → creates a signal with the given value`),

				el("dt", t`Reading a Signal`),
				el("dd", t`signal.get() → returns the current value`),

				el("dt", t`Writing to a Signal`),
				el("dd", t`signal.set(newValue) → updates the value and notifies subscribers`),

				el("dt", t`Subscribing to Changes`),
				el("dd", t`S.on(signal, callback) → runs callback whenever signal changes`),

				el("dt", t`Unsubscribing`),
				el("dd").append(T`S.on(signal, callback, { signal: abortController.signal }) → Similarly to the
					${el("code", "on")} function to register DOM events listener.`)
			)
		),
		el("p").append(T`
			Signals can be created with any type of value, but they work best with ${el("a", { textContent:
				t`primitive types`, ...references.mdn_primitive })} like strings, numbers, and booleans.  For complex
			data types like objects and arrays, you’ll want to use Actions (covered below).
		`),

		el(h3, t`Derived Signals: Computed Values`),
		el("p").append(T`
			Computed values (also called derived signals) automatically update when their dependencies change.
			Create them by passing ${el("strong", "a function")} to ${el("code", "S()")}:
		`),
		el(example, { src: fileURL("./components/examples/signals/derived.js"), page_id }),
		el("p").append(T`
			Derived signals are read-only - you can’t call ${el("code", ".set()")} on them. Their value is always
			computed from their dependencies. They’re perfect for transforming or combining data from other signals.
		`),
		el(example, { src: fileURL("./components/examples/signals/computations-abort.js"), page_id }),

		el(h3, t`Signal Actions: For Complex State`),
		el("p").append(T`
			When working with objects, arrays, or other complex data structures. Signal Actions provide
			a structured way to modify state while maintaining reactivity.
		`),
		el("div", { className: "illustration" }).append(
			el("h4", t`Actions vs. Direct Mutation`),
			el("div", { className: "comparison" }).append(
				el("div", { className: "good-practice" }).append(
					el("h5", t`✅ With Actions`),
					el(code, { content: `
						const todos = S([], {
							add(text) {
								this.value.push(text);
								// Subscribers notified automatically
							}
						});
						// Use the action
						S.action(todos, "add", "New todo");
					`, page_id })
				),
				el("div", { className: "bad-practice" }).append(
					el("h5", t`❌ Without Actions`),
					el(code, { content: `
						const todos = S([]);
						// Directly mutating the array
						const items = todos.get();
						items.push("New todo");
						// This WON’T trigger updates!
					`, page_id }))
				),
		),
		el("p").append(T`
			In some way, you can compare it with ${el("a", { textContent: "useReducer", ...references.mdn_use_reducer })}
			hook from React. So, the ${el("code", "S(<data>, <actions>)")} pattern creates a store “machine”. We can
			then invoke (dispatch) registered action by calling ${el("code", "S.action(<signal>, <name>, ...<args>)")}
			after the action call the signal calls all its listeners. This can be stopped by calling
			${el("code", "this.stopPropagation()")} in the method representing the given action. As it can be seen in
			examples, the “store” value is available also in the function for given action (${el("code", "this.value")}).
		`),
		el(example, { src: fileURL("./components/examples/signals/actions-demo.js"), page_id }),

		el("p").append(T`
			Actions provide these benefits:
		`),
		el("ul").append(
			el("li", t`Encapsulate state change logic in named methods`),
			el("li", t`Guarantee notifications when state changes`),
			el("li", t`Prevent accidental direct mutations`),
			el("li", t`Act similar to reducers in other state management libraries`)
		),
		el("p").append(T`
			Here’s a more complete example of a todo list using signal actions:
		`),
		el(example, { src: fileURL("./components/examples/signals/actions-todos.js"), page_id }),

		el("div", { className: "tip" }).append(
			el("p").append(T`
				${el("strong", "Special Action Methods")}: Signal actions can implement special lifecycle hooks:
			`),
			el("ul").append(
				el("li").append(T`
					${el("code", "[S.symbols.onclear]()")} - Called when the signal is cleared. Use it to clean up
					resources.
				`),
			)
		),

		el(h3, t`Connecting Signals to the DOM`),
		el("p").append(T`
			Signals really shine when connected to your UI. dd<el> provides several ways to bind signals to DOM elements:
		`),

		el("div", { className: "tabs" }).append(
			el("div", { className: "tab", dataTab: "attributes" }).append(
				el("h4", t`Reactive Attributes`),
				el("p", t`Bind signal values directly to element attributes, properties, or styles:`),
				el(code, { content: `
					// Create a signal
					const color = S("blue");

					// Bind it to an element’s style
					el("div", {
						style: {
							color, // Updates when signal changes
							fontWeight: S(() => color.get() === "red" ? "bold" : "normal")
						}
					}, "This text changes color");

					// Later:
					color.set("red"); // UI updates automatically
				`, page_id }),
			),
			el("div", { className: "tab", dataTab: "elements" }).append(
				el("h4", t`Reactive Elements`),
				el("p", t`Dynamically create or update elements based on signal values:`),
				el(code, { content: `
					// Create an array signal
					const items = S(["Apple", "Banana", "Cherry"]);

					// Create a dynamic list that updates when items change
					el("ul").append(
						S.el(items, items =>
							items.map(item => el("li", item))
						)
					);

					// Later:
					S.action(items, "push", "Dragonfruit"); // List updates automatically
				`, page_id }),
			)
		),

		el("p").append(T`
			The ${el("code", "assign")} and ${el("code", "el")} functions detect signals automatically and handle binding.
			You can use special properties like ${el("code", "dataset")}, ${el("code", "ariaset")}, and
			${el("code", "classList")} for fine-grained control over specific attribute types.
		`),
		el(example, { src: fileURL("./components/examples/signals/dom-attrs.js"), page_id }),

		el("p").append(T`
			${el("code", "S.el()")} is especially powerful for conditional rendering and lists:
		`),
		el(example, { src: fileURL("./components/examples/signals/dom-el.js"), page_id }),

		el(h3, t`Best Practices for Signals`),
		el("p").append(T`
			Follow these guidelines to get the most out of signals:
		`),
		el("ol").append(
			el("li").append(T`
				${el("strong", "Keep signals small and focused")}: Use many small signals rather than a few large ones
			`),
			el("li").append(T`
				${el("strong", "Use derived signals for computations")}: Don’t recompute values in multiple places
			`),
			el("li").append(T`
				${el("strong", "Clean up signal subscriptions")}: Use AbortController (scope.host()) to prevent memory
				leaks
			`),
			el("li").append(T`
				${el("strong", "Use actions for complex state")}: Don’t directly mutate objects or arrays in signals
			`),
			el("li").append(T`
				${el("strong", "Avoid infinite loops")}: Be careful when one signal updates another in a subscription
			`)
		),

		el("div", { className: "troubleshooting" }).append(
			el("h4", t`Common Signal Pitfalls`),
			el("dl").append(
				el("dt", t`UI not updating when array/object changes`),
				el("dd", t`Use signal actions instead of direct mutation`),

				el("dt", t`Infinite update loops`),
				el("dd", t`Check for circular dependencies between signals`),

				el("dt", t`Memory leaks`),
				el("dd", t`Use AbortController or scope.host() to clean up subscriptions`),

				el("dt", t`Multiple elements updating unnecessarily`),
				el("dd", t`Split large signals into smaller, more focused ones`)
			)
		),

		el(mnemonic)
	);
}
