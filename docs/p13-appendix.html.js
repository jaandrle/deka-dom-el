import { T, t } from "./utils/index.js";
export const info= {
	title: t`Appendix & Summary`,
	fullTitle: t`dd<el> Comprehensive Reference`,
	description: t`A final overview, case studies, key concepts, and best practices for working with deka-dom-el.`,
};

import { el } from "deka-dom-el";
import { simplePage } from "./layout/simplePage.html.js";
import { h3 } from "./components/pageUtils.html.js";
import { code } from "./components/code.html.js";
/** @param {string} url */
const references= {
	/** GitHub repository */
	github: {
		title: t`dd<el> GitHub Repository`,
		href: "https://github.com/jaandrle/deka-dom-el",
	},
	/** TodoMVC */
	todomvc: {
		title: t`TodoMVC Implementation`,
		href: "p10-todomvc.html",
	},
	/** Performance best practices */
	performance: {
		title: t`Performance Optimization Guide`,
		href: "p09-optimization.html",
	},
	/** Examples gallery */
	examples: {
		title: t`Examples Gallery`,
		href: "p15-examples.html",
	},
	/** Converter */
	converter: {
		title: t`HTML to dd<el> Converter`,
		href: "p14-converter.html",
	}
};

/** @param {import("./types.d.ts").PageAttrs} attrs */
export function page({ pkg, info }){
	return el(simplePage, { info, pkg }).append(
		el("p").append(T`
			This reference guide provides a comprehensive summary of dd<el>’s key concepts, best practices,
			case studies, and advanced techniques. Use it as a quick reference when working with the library
			or to deepen your understanding of its design principles and patterns.
		`),

		el(h3, t`Core Principles of dd<el>`),
		el("p").append(T`
			At its foundation, dd<el> is built on several core principles that shape its design and usage:
		`),
		el("div", { className: "callout" }).append(
			el("h4", t`Guiding Principles`),
			el("ul").append(
				el("li").append(T`
					${el("strong", "DOM-First Approach:")} Working directly with the real DOM instead of virtual DOM
					abstractions
				`),
				el("li").append(T`
					${el("strong", "Declarative Syntax:")} Creating UIs by describing what they should look like, not
					how to create them
				`),
				el("li").append(T`
					${el("strong", "Minimal Overhead:")} Staying close to standard Web APIs without unnecessary
					abstractions
				`),
				el("li").append(T`
					${el("strong", "Progressive Enhancement:")} Starting simple and adding complexity only when needed
				`),
				el("li").append(T`
					${el("strong", "Flexibility:")} Using what you need, whether that’s plain DOM elements, event
					handling, or signals for reactivity
				`),
				el("li").append(T`
					${el("strong", "Functional Composition:")} Building UIs through function composition
				`),
				el("li").append(T`
					${el("strong", "Clear Patterns:")} Promoting maintainable code organization with the 3PS pattern
				`),
				el("li").append(T`
					${el("strong", "Targeted Reactivity:")} Using signals for efficient, fine-grained updates only when
					needed
				`),
				el("li").append(T`
					${el("strong", "Unix Philosophy:")} Doing one thing well and allowing composability with other tools
				`)
			)
		),

		el(h3, t`Case Studies & Real-World Applications`),
		el("p").append(T`
			Explore our ${el("a", references.examples).append("Examples Gallery")} to see how dd<el> can be used to build
			various real-world applications, from simple components to complex interactive UIs.
		`),

		el("h4", t`TodoMVC Implementation`),
		el("p").append(T`
			The ${el("a", references.todomvc).append("TodoMVC implementation")} showcases how dd<el> handles a complete,
			real-world application with all standard features of a modern web app:
		`),
		el("ul").append(
			el("li", t`Persistent storage with localStorage`),
			el("li", t`Reactive UI with automatic updates`),
			el("li", t`Client-side routing with hash-based URLs`),
			el("li", t`Component-based architecture`),
			el("li", t`Performance optimization with memoization`),
			el("li", t`Custom event system for component communication`),
			el("li", t`Proper focus management and accessibility`)
		),
		el("p").append(T`
			Key takeaways from the TodoMVC example:
		`),
		el("ul").append(
			el("li").append(T`
				Signal factories like ${el("code", "routerSignal")} and ${el("code", "todosSignal")}
				encapsulate related functionality
			`),
			el("li").append(T`
				Custom events provide clean communication between components
			`),
			el("li").append(T`
				Targeted memoization improves rendering performance dramatically
			`),
			el("li").append(T`
				Derived signals simplify complex UI logic like filtering
			`)
		),

		el("h4", t`Migrating from Traditional Approaches`),
		el("p").append(T`
			When migrating from traditional DOM manipulation or other frameworks to dd<el>:
		`),
		el("ol").append(
			el("li").append(T`
				${el("strong", "Start with state")}: Convert global variables or ad-hoc state to signals
			`),
			el("li").append(T`
				${el("strong", "Replace query selectors")}: Replace getElementById/querySelector with direct references
				to elements
			`),
			el("li").append(T`
				${el("strong", "Convert imperative updates")}: Replace manual DOM updates with declarative signal
				bindings
			`),
			el("li").append(T`
				${el("strong", "Refactor into components")}: Organize related UI elements into component functions
			`)
		),
		el(code, { content: `
			// Before: Imperative DOM updates
			function updateUI() {
				document.getElementById('counter').textContent = count;
				document.getElementById('status').className = count > 10 ? 'warning' : '';
			}

			// After: Declarative with dd<el>
			const countS = S(0);

			el("div").append(
				el("span", { id: "counter", textContent: countS }),
				el("div", {
					id: "status",
					className: S(() => countS.get() > 10 ? 'warning' : '')
				})
			);
		`, language: "js" }),

		el(h3, t`Key Concepts Reference`),

		el("div", { className: "function-table" }).append(
			el("h4", t`Elements & DOM Creation`),
			el("dl").append(
				el("dt", t`el(tag|component, props, ...addons)`),
				el("dd", t`Core function for creating DOM elements with declarative properties`),

				el("dt", t`el().append(...children)`),
				el("dd", t`Add child elements to a parent element`),

				el("dt", t`memo(key, () => element)`),
				el("dd", t`Cache and reuse DOM elements for performance optimization`),

				el("dt", t`on(eventType, handler)`),
				el("dd", t`Attach event handlers to elements as addons`)
			)
		),

		el("div", { className: "function-table" }).append(
			el("h4", t`Signals & Reactivity`),
			el("dl").append(
				el("dt", t`S(initialValue)`),
				el("dd", t`Create a signal with an initial value`),

				el("dt", t`S(() => computation)`),
				el("dd", t`Create a derived signal that updates when dependencies change`),

				el("dt", t`S.el(signal, data => element)`),
				el("dd", t`Create reactive elements that update when a signal changes`),

				el("dt", t`S.action(signal, "method", ...args)`),
				el("dd", t`Call custom methods defined on a signal`),

				el("dt", t`signal.get()`),
				el("dd", t`Get the current value of a signal`),

				el("dt", t`signal.set(newValue)`),
				el("dd", t`Update a signal’s value and trigger reactive updates`)
			)
		),

		el("div", { className: "function-table" }).append(
			el("h4", t`Component Patterns`),
			el("dl").append(
				el("dt", t`Function Components`),
				el("dd", t`Javascript functions that return DOM elements`),

				el("dt", t`scope Object`),
				el("dd", t`Provides access to component context, signal, host element`),

				el("dt", t`dispatchEvent(type, element)`),
				el("dd", t`Creates a function for dispatching custom events`),

				el("dt", t`Signal Factories`),
				el("dd", t`Functions that create and configure signals with domain-specific behavior`)
			)
		),

		el(h3, t`Best Practices Summary`),
		el("div").append(
			el("h4", t`Code Organization`),
			el("ul").append(
				el("li").append(T`
					${el("strong", "Follow the 3PS pattern")}: Separate state creation, binding to elements, and state updates
				`),
				el("li").append(T`
					${el("strong", "Use component functions")}: Create reusable UI components as functions
				`),
				el("li").append(T`
					${el("strong", "Create signal factories")}: Extract reusable signal patterns into factory functions
				`),
				el("li").append(T`
					${el("strong", "Leverage scopes")}: Use scope for component context and clean resource management
				`),
				el("li").append(T`
					${el("strong", "Event delegation")}: Prefer component-level event handlers over many individual handlers
				`)
			)
		),

		el("div").append(
			el("h4", t`When to Use Signals vs. Plain DOM`),
			el("ul").append(
				el("li").append(T`
					${el("strong", "Use signals for")}: Data that changes frequently, multiple elements that need to
					stay in sync, computed values dependent on other state
				`),
				el("li").append(T`
					${el("strong", "Use plain DOM for")}: Static content, one-time DOM operations, simple toggling of
					elements, single-element updates
				`),
				el("li").append(T`
					${el("strong", "Mixed approach")}: Start with plain DOM and events, then add signals only where
					needed for reactivity
				`),
				el("li").append(T`
					${el("strong", "Consider derived signals")}: For complex transformations of data rather than manual
					updates
				`),
				el("li").append(T`
					${el("strong", "Use event delegation")}: For handling multiple similar interactions without
					individual signal bindings
				`)
			)
		),

		el("div").append(
			el("h4", t`Performance Optimization`),
			el("ul").append(
				el("li").append(T`
					${el("strong", "Memoize list items")}: Use ${el("code", "memo")} for items in frequently-updated lists
				`),
				el("li").append(T`
					${el("strong", "Avoid unnecessary signal updates")}: Only update signals when values actually change
				`),
				el("li").append(T`
					${el("strong", "Use AbortSignals")}: Clean up resources when components are removed
				`),
				el("li").append(T`
					${el("strong", "Prefer derived signals")}: Use computed values instead of manual updates
				`),
				el("li").append(T`
					${el("strong", "Avoid memoizing fragments")}: Never memoize DocumentFragments, only individual elements
				`)
			),
			el("p").append(T`
				See the ${el("a", references.performance).append("Performance Optimization Guide")} for detailed strategies.
			`)
		),

		el("div").append(
			el("h4", t`Common Pitfalls to Avoid`),
			el("dl").append(
				el("dt", t`Excessive DOM Manipulation`),
				el("dd", t`Let signals handle updates instead of manually manipulating the DOM after creation`),

				el("dt", t`Forgetting to Clean Up Resources`),
				el("dd", t`Use scope.signal or AbortSignals to handle resource cleanup when elements are removed`),

				el("dt", t`Circular Signal Dependencies`),
				el("dd", t`Avoid signals that depend on each other in a circular way, which can cause infinite update loops`),

				el("dt", t`Memoizing with Unstable Keys`),
				el("dd", t`Always use stable, unique identifiers as memo keys, not array indices or objects`),

				el("dt", t`Deep Nesting Without Structure`),
				el("dd", t`Break deeply nested element structures into smaller, logical component functions`)
			)
		),

		el(h3, t`Feature Comparison with Other Libraries`),
		el("table").append(
			el("thead").append(
				el("tr").append(
					el("th", "Feature"),
					el("th", "dd<el>"),
					el("th", "VanJS"),
					el("th", "Solid"),
					el("th", "Alpine")
				)
			),
			el("tbody").append(
				el("tr").append(
					el("td", "No Build Step Required"),
					el("td", "✅"),
					el("td", "✅"),
					el("td", "⚠️ JSX needs transpilation"),
					el("td", "✅")
				),
				el("tr").append(
					el("td", "Bundle Size (minified)"),
					el("td", "~14kb"),
					el("td", "~3kb"),
					el("td", "~20kb"),
					el("td", "~43kb")
				),
				el("tr").append(
					el("td", "Reactivity Model"),
					el("td", "Signal-based"),
					el("td", "Signal-based (basics only)"),
					el("td", "Signal-based"),
					el("td", "MVVM + Proxy")
				),
				el("tr").append(
					el("td", "DOM Interface"),
					el("td", "Direct DOM API"),
					el("td", "Direct DOM API"),
					el("td", "Compiled DOM updates"),
					el("td", "Directive-based")
				),
				el("tr").append(
					el("td", "Server-Side Rendering"),
					el("td", "✅ Basic Support"),
					el("td", "✅ Basic Support"),
					el("td", "✅ Advanced"),
					el("td", "❌")
				)
			)
		),

		el(h3, t`Looking Ahead: Future Directions`),
		el("p").append(T`
			The dd<el> library continues to evolve, with several areas of focus for future development:
		`),
		el("ul").append(
			el("li").append(T`
				${el("strong", "Future Compatibility:")} Alignment with the TC39 Signals proposal for native browser support
			`),
			el("li").append(T`
				${el("strong", "SSR Improvements:")} Enhanced server-side rendering capabilities
			`),
			el("li").append(T`
				${el("strong", "Ecosystem Growth:")} More utilities, patterns, and integrations with other libraries
			`),
			el("li").append(T`
				${el("strong", "Documentation Expansion:")} Additional examples, tutorials, and best practices
			`),
			el("li").append(T`
				${el("strong", "TypeScript Enhancements:")} Improved type definitions and inference
			`)
		),

		el(h3, t`Contribution and Community`),
		el("p").append(T`
			dd<el> is an open-source project that welcomes contributions from the community:
		`),
		el("ul").append(
			el("li").append(T`
				${el("a", references.github).append("GitHub Repository")}: Star, fork, and contribute to the project
			`),
			el("li").append(T`
				Bug reports and feature requests: Open issues on GitHub
			`),
			el("li").append(T`
				Documentation improvements: Help expand and clarify these guides
			`),
			el("li").append(T`
				Examples and case studies: Share your implementations and solutions
			`)
		),

		el("div", { className: "callout" }).append(
			el("h4", t`Final Thoughts`),
			el("p").append(T`
				dd<el> provides a lightweight yet powerful approach to building modern web interfaces
				with minimal overhead and maximal flexibility. By embracing standard web technologies
				rather than abstracting them away, it offers a development experience that scales
				from simple interactive elements to complex applications while remaining close
				to what makes the web platform powerful.
			`),
			el("p").append(T`
				Whether you’re building a small interactive component or a full-featured application,
				dd<el>’s combination of declarative syntax, targeted reactivity, and pragmatic design
				provides the tools you need without the complexity you don’t.
			`)
		),

		el(h3, t`Tools and Resources`),
		el("p").append(T`
			To help you get started with dd<el>, we provide several tools and resources:
		`),
		el("ul").append(
			el("li").append(T`
				${el("a", references.converter).append("HTML to dd<el> Converter")}: Easily convert existing HTML markup
				to dd<el> JavaScript code
			`),
			el("li").append(T`
				${el("a", references.examples).append("Examples Gallery")}: Browse real-world examples and code snippets
			`),
			el("li").append(T`
				${el("a", references.github).append("Documentation")}: Comprehensive guides and API reference
			`)
		),
	);
}
