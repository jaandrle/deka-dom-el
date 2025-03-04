import { T, t } from "./utils/index.js";
export const info= {
	title: t`Scopes and Components`,
	description: t`Organizing UI into reusable, manageable components`,
};

import { el } from "deka-dom-el";
import { simplePage } from "./layout/simplePage.html.js";
import { example } from "./components/example.html.js";
import { h3 } from "./components/pageUtils.html.js";
import { mnemonic } from "./components/mnemonic/scopes-init.js";
import { code } from "./components/code.html.js";
/** @param {string} url */
const fileURL= url=> new URL(url, import.meta.url);
const references= {
	/** Garbage collection on MDN */
	garbage_collection: {
		title: t`MDN documentation page for Garbage collection`,
		href: "https://developer.mozilla.org/en-US/docs/Glossary/Garbage_collection",
	},
	/** Signals */
	signals: {
		title: t`Signals section on this library`,
		href: "./p04-signals#h-introducing-signals",
	}
};
/** @param {import("./types.d.ts").PageAttrs} attrs */
export function page({ pkg, info }){
	const page_id= info.id;
	return el(simplePage, { info, pkg }).append(
		el("h2", t`Building Maintainable UIs with Scopes and Components`),
		el("p").append(...T`
			Scopes provide a structured way to organize your UI code into reusable components that properly
			manage their lifecycle, handle cleanup, and maintain clear boundaries between different parts of your application.
		`),
		el("div", { class: "dde-callout" }).append(
			el("h4", t`Why Use Scopes?`),
			el("ul").append(
				el("li", t`Automatic resource cleanup when components are removed from DOM`),
				el("li", t`Clear component boundaries with explicit host elements`),
				el("li", t`Simplified event handling with proper "this" binding`),
				el("li", t`Seamless integration with signals for reactive components`),
				el("li", t`Better memory management with ${el("a", { textContent: t`GC`, ...references.garbage_collection })}`)
			)
		),
		el(code, { src: fileURL("./components/examples/scopes/intro.js"), page_id }),

		el(h3, t`Understanding Host Elements and Scopes`),
		el("div", { class: "dde-illustration" }).append(
			el("h4", t`Component Anatomy`),
			el("pre").append(el("code", `
┌─────────────────────────────────┐
│ // 1. Component scope created   │
│ el(MyComponent);                │
│                                 │
│ function MyComponent() {        │
│   // 2. access the host element │
│   const { host } = scope;       │
│                                 │
│   // 3. Add behavior to host    │
│   host(                         │
│     on.click(handleClick)       │
│   );                            │
│                                 │
│   // 4. Return the host element │
│   return el("div", {           │
│     className: "my-component"   │
│   }).append(                    │
│     el("h2", "Title"),          │
│     el("p", "Content")          │
│   );                            │
│ }                               │
└─────────────────────────────────┘
			`))
		),
		el("p").append(...T`
			The ${el("strong", "host element")} is the root element of your component - typically the element returned
			by your component function. It serves as the identity of your component in the DOM.
		`),
		el("div", { class: "dde-function-table" }).append(
			el("h4", t`scope.host()`),
			el("dl").append(
				el("dt", t`When called with no arguments`),
				el("dd", t`Returns a reference to the host element (the root element of your component)`),

				el("dt", t`When called with addons/callbacks`),
				el("dd", t`Applies the addons to the host element and returns the host element`)
			)
		),
		el(example, { src: fileURL("./components/examples/scopes/scopes-and-hosts.js"), page_id }),

		el("div", { class: "dde-tip" }).append(
			el("p").append(...T`
				${el("strong", "Best Practice:")} Always capture the host reference at the beginning of your component function
				using ${el("code", "const { host } = scope")} to avoid scope-related issues, especially with asynchronous code.
			`)
		),

		el(h3, t`Class-Based Components`),
		el("p").append(...T`
			While functional components are the primary pattern in DDE, you can also create class-based components
			for more structured organization of component logic.
		`),
		el(example, { src: fileURL("./components/examples/scopes/class-component.js"), page_id }),

		el("p").append(...T`
			This pattern can be useful when:
		`),
		el("ul").append(
			el("li", t`You have complex component logic that benefits from object-oriented organization`),
			el("li", t`You need private methods and properties for your component`),
			el("li", t`You're transitioning from another class-based component system`)
		),
		el("div", { class: "dde-tip" }).append(
			el("p").append(...T`
				${el("strong", "Note:")} Even with class-based components, follow the best practice of storing the host reference
				early in your component code. This ensures proper access to the host throughout the component's lifecycle.
			`)
		),
		el(code, { src: fileURL("./components/examples/scopes/good-practise.js"), page_id }),

		el(h3, t`Automatic Cleanup with Scopes`),
		el("p").append(...T`
			One of the most powerful features of scopes is automatic cleanup when components are removed from the DOM.
			This prevents memory leaks and ensures resources are properly released.
		`),
		el("div", { class: "dde-illustration" }).append(
			el("h4", t`Lifecycle Flow`),
			el("pre").append(el("code", `
1. Component created → scope established
2. Component added to DOM → connected event
3. Component interactions happen
4. Component removed from DOM → disconnected event
5. Automatic cleanup of:
	- Event listeners
	- Signal subscriptions
	- Custom cleanup code
			`))
		),
		el(example, { src: fileURL("./components/examples/scopes/cleaning.js"), page_id }),

		el("div", { class: "dde-note" }).append(
			el("p").append(...T`
				In this example, when you click "Remove", the component is removed from the DOM, and all its associated
				resources are automatically cleaned up, including the signal subscription that updates the text content.
				This happens because the library internally registers a disconnected event handler on the host element.
			`)
		),

		el(h3, t`Declarative vs Imperative Components`),
		el("p").append(...T`
			Scopes work best with a declarative approach to UI building, especially when combined
			with ${el("a", { textContent: "signals", ...references.signals })} for state management.
		`),
		el("div", { class: "dde-tabs" }).append(
			el("div", { class: "tab", "data-tab": "declarative" }).append(
				el("h4", t`✅ Declarative Approach`),
				el("p", t`Define what your UI should look like based on state:`),
				el("pre").append(el("code", `function Counter() {
	const { host } = scope;

	// Define state
	const count = S(0);

	// Define behavior
	const increment = () => count.set(count.get() + 1);

	// UI automatically updates when count changes
	return el("div").append(
		el("p", S(() => "Count: " + count.get())),
		el("button", {
			onclick: increment,
			textContent: "Increment"
		})
	);
}`))
			),
			el("div", { class: "tab", "data-tab": "imperative" }).append(
				el("h4", t`⚠️ Imperative Approach`),
				el("p", t`Manually update the DOM in response to events:`),
				el("pre").append(el("code", `function Counter() {
	const { host } = scope;

	let count = 0;
	const counterText = el("p", "Count: 0");

	// Manually update DOM element
	const increment = () => {
		count++;
		counterText.textContent = "Count: " + count;
	};

	return el("div").append(
		counterText,
		el("button", {
			onclick: increment,
			textContent: "Increment"
		})
	);
}`))
			)
		),

		el(code, { src: fileURL("./components/examples/scopes/declarative.js"), page_id }),

		el("div", { class: "dde-note" }).append(
			el("p").append(...T`
				While DDE supports both declarative and imperative approaches, the declarative style is recommended
				as it leads to more maintainable code with fewer opportunities for bugs. Signals handle the complexity
				of keeping your UI in sync with your data.
			`)
		),
		el(code, { src: fileURL("./components/examples/scopes/imperative.js"), page_id }),

		el(h3, t`Best Practices for Scopes and Components`),
		el("ol").append(
			el("li").append(...T`
				${el("strong", "Capture host early:")} Use ${el("code", "const { host } = scope")} at component start
			`),
			el("li").append(...T`
				${el("strong", "Return a single root element:")} Components should have one host element that contains all others
			`),
			el("li").append(...T`
				${el("strong", "Prefer declarative patterns:")} Use signals to drive UI updates rather than manual DOM manipulation
			`),
			el("li").append(...T`
				${el("strong", "Keep components focused:")} Each component should do one thing well
			`),
			el("li").append(...T`
				${el("strong", "Add explicit cleanup:")} For resources not managed by DDE, use ${el("code", "on.disconnected")}
			`)
		),

		el("div", { class: "dde-troubleshooting" }).append(
			el("h4", t`Common Scope Pitfalls`),
			el("dl").append(
				el("dt", t`Losing host reference in async code`),
				el("dd", t`Store host reference early with const { host } = scope`),

				el("dt", t`Memory leaks from custom resources`),
				el("dd", t`Use host(on.disconnected(cleanup)) for manual resource cleanup`),

				el("dt", t`Event handlers with incorrect 'this'`),
				el("dd", t`Use arrow functions or .bind() to preserve context`),

				el("dt", t`Mixing declarative and imperative styles`),
				el("dd", t`Choose one approach and be consistent throughout a component`)
			)
		),

		el(mnemonic)
	);
}
