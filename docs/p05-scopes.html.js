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
			we may need to handle the component's life-cycle and provide JavaScript the way to properly use
			the ${el("a", { textContent: t`Garbage collection`, ...references.garbage_collection })}.
		`),
		el(code, { src: fileURL("./components/examples/scopes/intro.js"), page_id }),
		el("p").append(...T`The library therefore uses ${el("em", t`scopes`)} to provide these functionalities.`),

		el(h3, t`Understanding Host Elements and Scopes`),
		el("p").append(...T`
			The ${el("strong", "host")} is the name for the element representing the component. This is typically the
			element returned by a function. To get a reference, you can use ${el("code", "scope.host()")}. To apply addons,
			just use ${el("code", "scope.host(...<addons>)")}.
		`),
		el("p").append(...T`
			Scopes are primarily needed when signals are used in DOM templates (with ${el("code", "el")}, ${el("code",
				"assign")}, or ${el("code", "S.el")}). They provide a way for automatically removing signal listeners
			and cleaning up unused signals when components are removed from the DOM.
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
			While functional components are the primary pattern in dd<el>, you can also create class-based components.
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
2. Component add<el> to DOM → connected event
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
			The library DOM API and signals work best when used declaratively. It means you split your app's logic
			into three parts as introduced in ${el("a", { textContent: "Signals", ...references.signals })}.
		`),
		el("div", { className: "note" }).append(
			el("p").append(...T`
				Strictly speaking, the imperative way of using the library is not prohibited. Just be careful to avoid
				mixing the declarative approach (using signals) with imperative manipulation of elements.
			`)
		),
		el("div", { className: "tabs" }).append(
			el("div", { className: "tab", "data-tab": "declarative" }).append(
				el("h4", t`✅ Declarative Approach`),
				el("p", t`Define what your UI should look like based on state:`),
				el(code, { src: fileURL("./components/examples/scopes/declarative.js"), page_id })
			),
			el("div", { className: "tab", "data-tab": "imperative" }).append(
				el("h4", t`⚠️ Imperative Approach`),
				el("p", t`Manually update the DOM in response to events:`),
				el(code, { src: fileURL("./components/examples/scopes/imperative.js"), page_id })
			),
			el("div", { className: "tab", "data-tab": "mixed" }).append(
				el("h4", t`❌ Mixed Approach`),
				el("p", t`This approach should be avoided:`),
				el(code, { src: fileURL("./components/examples/scopes/mixed.js"), page_id })
			)
		),

		el(h3, t`Best Practices for Scopes and Components`),
		el("ol").append(
			el("li").append(...T`
				${el("strong", "Capture host early:")} Use ${el("code", "const { host } = scope")} at component start
			`),
			el("li").append(...T`
				${el("strong", "Define signals as constants:")} ${el("code", "const counter = S(0);")}
			`),
			el("li").append(...T`
				${el("strong", "Prefer declarative patterns:")} Use signals to drive UI updates rather than manual DOM manipulation
			`),
			el("li").append(...T`
				${el("strong", "Keep components focused:")} Each component should do one thing well
			`),
			el("li").append(...T`
				${el("strong", "Add explicit cleanup:")} For resources not managed by dd<el>, use ${el("code",
					"on.disconnected")}
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
