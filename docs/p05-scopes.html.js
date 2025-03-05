import { T, t } from "./utils/index.js";
export const info= {
	title: t`Scopes and Components`,
	fullTitle: t`Building Maintainable UIs with Scopes and Components`,
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
		el("p").append(...T`
			For state-less components we can use functions as UI components (see “Elements” page). But in real life,
			we may need to handle the component live-cycle and provide JavaScript the way to properly use
			the ${el("a", { textContent: t`Garbage collection`, ...references.garbage_collection })}.
		`),
		el(code, { src: fileURL("./components/examples/scopes/intro.js"), page_id }),
		el("p").append(...T`The library therefore use ${el("em", t`scopes`)} to provide these functionalities.`),

		el(h3, t`Understanding Host Elements and Scopes`),
		el("p").append(...T`
			The ${el("strong", "host")} is the name for the element representing the component. This is typically
			element returned by function. To get reference, you can use ${el("code", "scope.host()")} to applly addons
			just use ${el("code", "scope.host(...<addons>)")}.
		`),
		el("div", { className: "illustration" }).append(
			el("h4", t`Component Anatomy`),
			el("pre").append(el("code", `
// 1. Component scope created
el(MyComponent);

function MyComponent() {
  // 2. access the host element
  const { host } = scope;

  // 3. Add behavior to host
  host(
    on.click(handleClick)
  );

  // 4. Return the host element
  return el("div", {
    className: "my-component"
  }).append(
    el("h2", "Title"),
    el("p", "Content")
  );
}
			`.trim()))
		),
		el("div", { className: "function-table" }).append(
			el("h4", t`scope.host()`),
			el("dl").append(
				el("dt", t`When called with no arguments`),
				el("dd", t`Returns a reference to the host element (the root element of your component)`),

				el("dt", t`When called with addons/callbacks`),
				el("dd", t`Applies the addons to the host element and returns the host element`)
			)
		),
		el(example, { src: fileURL("./components/examples/scopes/scopes-and-hosts.js"), page_id }),

		el("div", { className: "tip" }).append(
			el("p").append(...T`
				${el("strong", "Best Practice:")} Always capture the host reference at the beginning of your component
				function using ${el("code", "const { host } = scope")} to avoid scope-related issues, especially with
				asynchronous code.
			`),
			el("p").append(...T`
				If you are interested in the implementation details, see Class-Based Components section.
			`)
		),
		el(code, { src: fileURL("./components/examples/scopes/good-practise.js"), page_id }),

		el(h3, t`Class-Based Components`),
		el("p").append(...T`
			While functional components are the primary pattern in DDE, you can also create class-based components.
			For this, we implement function ${el("code", "elClass")} and use it to demonstrate implementation details
			for better understanding of the scope logic.
		`),
		el(example, { src: fileURL("./components/examples/scopes/class-component.js"), page_id }),

		el(h3, t`Automatic Cleanup with Scopes`),
		el("p").append(...T`
			One of the most powerful features of scopes is automatic cleanup when components are removed from the DOM.
			This prevents memory leaks and ensures resources are properly released.
		`),
		el("div", { className: "illustration" }).append(
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

		el("div", { className: "note" }).append(
			el("p").append(...T`
				In this example, when you click "Remove", the component is removed from the DOM, and all its associated
				resources are automatically cleaned up, including the signal subscription that updates the text content.
				This happens because the library internally registers a disconnected event handler on the host element.
			`)
		),

		el(h3, t`Declarative vs Imperative Components`),
		el("p").append(...T`
			The library DOM API and signals works best when used declaratively. It means, you split your app logic
			into three parts as it was itroduced in ${el("a", { textContent: "Signals", ...references.signals })}.
		`),
		el("div", { className: "note" }).append(
			el("p").append(...T`
				Strictly speaking, the imperative way of using the library is not prohibited. Just be careful (rather avoid)
				mixing declarative approach (using signals) and imperative manipulation of elements.
			`)
		),
		el("div", { className: "tabs" }).append(
			el("div", { className: "tab", "data-tab": "declarative" }).append(
				el("h4", t`✅ Declarative Approach`),
				el("p", t`Define what your UI should look like based on state:`),
				el(code, { src: fileURL("./components/examples/scopes/declarative.js"), page_id }),
			),
			el("div", { className: "tab", "data-tab": "imperative" }).append(
				el("h4", t`⚠️ Imperative Approach`),
				el("p", t`Manually update the DOM in response to events:`),
				el(code, { src: fileURL("./components/examples/scopes/imperative.js"), page_id }),
			),
			el("div", { className: "tab", "data-tab": "mixed" }).append(
				el("h4", t`❌ Mixed Approach`),
				el("p", t`Just AVOID:`),
				el(code, { src: fileURL("./components/examples/scopes/mixed.js"), page_id }),
			),
		),

		el(h3, t`Advanced: Custom Scoping Control`),
		el("p").append(...T`
			In more complex applications, you may need finer control over scopes. DDE provides
			manual scope control mechanisms through ${el("code", "scope.push()")} and ${el("code", "scope.pop()")}.
		`),
		el("div", { className: "function-table" }).append(
			el("h4", t`Manual Scope Control API`),
			el("dl").append(
				el("dt", t`scope.current`),
				el("dd", t`Returns the currently active scope object.`),

				el("dt", t`scope.isolate(callback)`),
				el("dd", t`Executes the callback function within a temporary scope, then automatically restores the previous scope.
					Safer than manual push/pop for most use cases.`),

				el("dt", t`scope.push()`),
				el("dd", t`Creates a new scope and makes it the current active scope. All signals and subscriptions
					created after this call will be associated with this new scope.`),

				el("dt", t`scope.pop()`),
				el("dd", t`Restores the previous scope that was active before the matching push() call.`),
			)
		),
		el("p").append(...T`
			Custom scoping is particularly useful for:
		`),
		el("ul").append(
			el("li", t`Isolating signal dependencies in async operations`),
			el("li", t`Creating detached reactive logic that shouldn't be tied to a component's lifecycle`),
			el("li", t`Building utilities that work with signals but need scope isolation`)
		),
		el(example, { src: fileURL("./components/examples/scopes/custom-scope.js"), page_id }),
		el(example, { src: fileURL("./components/examples/scopes/with-scope.js"), page_id }),
		el("div", { className: "warning" }).append(
			el("p").append(...T`
				${el("strong", "Be careful with manual scope control!")} Always ensure you have matching push() and pop() calls,
				preferably in the same function. Unbalanced scope management can lead to memory leaks or unexpected behavior.
			`),
			el("p").append(...T`
				For most use cases, prefer using the automatic scope management provided by components.
				Manual scope control should be considered an advanced feature.
			`)
		),

		el(h3, t`Best Practices for Scopes and Components`),
		el("ol").append(
			el("li").append(...T`
				${el("strong", "Capture host early:")} Use ${el("code", "const { host } = scope")} at component start
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

		el("div", { className: "troubleshooting" }).append(
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
