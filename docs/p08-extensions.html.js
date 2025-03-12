import { T, t } from "./utils/index.js";
export const info= {
	title: t`Extensions and 3rd Party`,
	fullTitle: t`Extending dd<el> with Third-Party Functionalities`,
	description: t`How to extend dd<el> with third-party libraries and custom functionalities.`,
};

import { el } from "deka-dom-el";
import { simplePage } from "./layout/simplePage.html.js";
import { h3 } from "./components/pageUtils.html.js";
import { code } from "./components/code.html.js";
/** @param {string} url */
const fileURL= url=> new URL(url, import.meta.url);

/** @param {import("./types.js").PageAttrs} attrs */
export function page({ pkg, info }){
	const page_id= info.id;
	return el(simplePage, { info, pkg }).append(
		el("p").append(...T`
			dd<el> is designed with extensibility in mind. This page covers how to separate
			third-party functionalities and integrate them seamlessly with the library, focusing on
			proper resource cleanup and interoperability.
		`),

		el(h3, t`DOM Element Extensions with Addons`),
		el("p").append(...T`
			The primary method for extending DOM elements in dd<el> is through the Addon pattern.
			Addons are functions that take an element and applying some functionality to it. This pattern enables
			a clean, functional approach to element enhancement.
		`),
		el("div", { className: "callout" }).append(
			el("h4", t`What are Addons?`),
			el("p").append(...T`
				Addons are simply functions with the signature: (element) => void. They:
			`),
			el("ul").append(
				el("li", t`Accept a DOM element as input`),
				el("li", t`Apply some behavior, property, or attribute to the element`),
			)
		),
		el(code, { content: `
			// Basic structure of an addon
			function myAddon(config) {
				return function(element) {
					// Apply functionality to element
					element.dataset.myAddon = config.option;
				};
			}

			// Using an addon
			el("div", { id: "example" }, myAddon({ option: "value" }));
		`, page_id }),

		el(h3, t`Resource Cleanup with Abort Signals`),
		el("p").append(...T`
			When extending elements with functionality that uses resources like event listeners, timers,
			or external subscriptions, it’s critical to clean up these resources when the element is removed
			from the DOM. dd<el> provides utilities for this through AbortSignal integration.
		`),
		el("div", { className: "tip" }).append(
			el("p").append(...T`
				The ${el("code", "scope.signal")} property creates an AbortSignal that automatically
				triggers when an element is disconnected from the DOM, making cleanup much easier to manage.
			`)
		),
		el(code, { content: `
			// Third-party library addon with proper cleanup
			function externalLibraryAddon(config, signal) {
				return function(element) {
					// Initialize the third-party library
					const instance = new ExternalLibrary(element, config);

					// Set up cleanup when the element is removed
					signal.addEventListener('abort', () => {
						instance.destroy();
					});

					return element;
				};
			}
			// dde component
			function Component(){
				const { signal }= scope;
				return el("div", null, externalLibraryAddon({ option: "value" }, signal));
			}
		`, page_id }),

		el(h3, t`Building Library-Independent Extensions`),
		el("p").append(...T`
			When creating extensions, it’s a good practice to make them as library-independent as possible.
			This approach enables better interoperability and future-proofing.
		`),
		el("div", { className: "illustration" }).append(
			el("h4", t`Library-Independent vs. Library-Dependent Extension`),
			el("div", { className: "tabs" }).append(
				el("div", { className: "tab" }).append(
					el("h5", t`✅ Library-Independent`),
					el(code, { content: `
						function enhancementElement({ signal, ...config }) {
							// do something
							return function(element) {
								// do something
								signal.addEventListener('abort', () => {
									// do cleanup
								});
							};
						}
					`, page_id })
				),
				el("div", { className: "tab" }).append(
					el("h5", t`⚠️ Library-Dependent`),
					el(code, { content: `
						// Tightly coupled to dd<el>
						function enhancementElement(config) {
							return function(element) {
								// do something
								on.disconnected(()=> {
									// do cleanup
								})(element);
							};
						}
					`, page_id })
				)
			)
		),

		el(h3, t`Signal Extensions and Factory Patterns`),
		el("p").append(...T`
			Unlike DOM elements, signal functionality in dd<el> currently lacks a standardized
			way to create library-independent extensions. This is because signals are implemented
			differently across libraries.
		`),
		el("div", { className: "note" }).append(
			el("p").append(...T`
				In the future, JavaScript may include built-in signals through the
				${el("a", { href: "https://github.com/tc39/proposal-signals", textContent: "TC39 Signals Proposal" })}.
				dd<el> is designed with future compatibility in mind and will hopefully support these
				native signals without breaking changes when they become available.
			`)
		),
		
		el("h4", t`The Signal Factory Pattern`),
		el("p").append(...T`
			A powerful approach for extending signal functionality is the "Signal Factory" pattern.
			This approach encapsulates specific behavior in a function that creates and configures a signal.
		`),
		el(code, { content: `
			/**
			 * Creates a signal for managing route state
			 *
			 * @param {typeof S} signal - The signal constructor
			 */
			function routerSignal(signal){
				const initial = location.hash.replace("#", "") || "all";
				return signal(initial, {
					/**
					 * Set the current route
					 * @param {"all"|"active"|"completed"} hash - The route to set
					 */
					set(hash){
						location.hash = hash;
						this.value = hash;
					}
				});
			}
			
			// Usage
			const pageS = routerSignal(S);
			
			// Update URL hash and signal value in one operation
			S.action(pageS, "set", "active");
			
			// React to signal changes in the UI
			el("nav").append(
				el("a", {
					href: "#",
					className: S(()=> pageS.get() === "all" ? "selected" : ""),
					textContent: "All"
				})
			);
		`, page_id }),
		
		el("div", { className: "callout" }).append(
			el("h4", t`Benefits of Signal Factories`),
			el("ul").append(
				el("li", t`Encapsulate related behavior in a single, reusable function`),
				el("li", t`Create domain-specific signals with custom actions`),
				el("li", t`Improve maintainability by centralizing similar logic`),
				el("li", t`Enable better testability by accepting the signal constructor as a parameter`),
				el("li", t`Create a clear semantic boundary around related state operations`)
			)
		),
		
		el("p").append(...T`
			Note how the factory accepts the signal constructor as a parameter, making it easier to test
			and potentially migrate to different signal implementations in the future.
		`),
		
		el("h4", t`Other Signal Extension Approaches`),
		el("p").append(...T`
			For simpler cases, you can also extend signals with clear interfaces and isolation to make
			future migration easier.
		`),
		el(code, { content: `
			// Signal extension with clear interface
			function createEnhancedSignal(initialValue) {
				const signal = S(initialValue);

				// Extension functionality
				const increment = () => signal.set(signal.get() + 1);
				const decrement = () => signal.set(signal.get() - 1);

				// Return the original signal with added methods
				return { signal, increment, decrement };
			}

			// Usage
			const counter = createEnhancedSignal(0);
			el("button", { textContent: "Increment", onclick: () => counter.increment() });
			el("div", S.text\`Count: \${counter}\`);
		`, page_id }),
		
		el("div", { className: "tip" }).append(
			el("p").append(...T`
				When designing signal extensions, consider creating specialized signals for common patterns like:
				forms, API requests, persistence, animations, or routing. These can significantly reduce
				boilerplate code in your applications.
			`)
		),

		el(h3, t`Using Signals Independently`),
		el("p").append(...T`
			While signals are tightly integrated with DDE’s DOM elements, you can also use them independently.
			This can be useful when you need reactivity in non-UI code or want to integrate with other libraries.
		`),
		el("p").append(...T`
			There are two ways to import signals:
		`),
		el("ol").append(
			el("li").append(...T`
				${el("strong", "Standard import")}: ${el("code", `import { S } from "deka-dom-el/signals";`)}
				— This automatically registers signals with DDE’s DOM reactivity system
			`),
			el("li").append(...T`
				${el("strong", "Independent import")}: ${el("code", `import { S } from "deka-dom-el/src/signals-lib";`)}
				— This gives you just the signal system without DOM integration
			`)
		),
		el(code, { content: `
			// Independent signals without DOM integration
			import { signal, isSignal } from "deka-dom-el/src/signals-lib";

			// Create and use signals as usual
			const count = signal(0);
			const doubled = signal(() => count.get() * 2);

			// Subscribe to changes
			signal.on(count, value => console.log(value));

			// Update signal value
			count.set(5); // Logs: 5
			console.log(doubled.get()); // 10
		`, page_id }),
		el("p").append(...T`
			The independent signals API includes all core functionality (${el("code", "S()")}, ${el("code", "S.on()")},
			${el("code", "S.action()")}).
		`),
		el("div", { className: "callout" }).append(
			el("h4", t`When to Use Independent Signals`),
			el("ul").append(
				el("li", t`For non-UI state management in your application`),
				el("li", t`When integrating with other libraries or frameworks`),
				el("li", t`To minimize bundle size when you don't need DOM integration`)
			)
		),

		el(h3, t`Best Practices for Extensions`),
		el("ol").append(
			el("li").append(...T`
				${el("strong", "Use AbortSignals for cleanup:")} Always implement proper resource cleanup with
				${el("code", "scope.signal")} or similar mechanisms
			`),
			el("li").append(...T`
				${el("strong", "Separate core logic from library adaptation:")} Make your core functionality work
				with standard DOM APIs when possible
			`),
			el("li").append(...T`
				${el("strong", "Use signal factories for common patterns:")} Create reusable signal factories that encapsulate
				domain-specific behavior and state logic
			`),
			el("li").append(...T`
				${el("strong", "Document clearly:")} Provide clear documentation on how your extension works
				and what resources it uses
			`),
			el("li").append(...T`
				${el("strong", "Follow the Addon pattern:")} Keep to the (element) => element signature for
				DOM element extensions
			`),
			el("li").append(...T`
				${el("strong", "Avoid modifying global state:")} Extensions should be self-contained and not
				affect other parts of the application
			`)
		),

		el("div", { className: "troubleshooting" }).append(
			el("h4", t`Common Extension Pitfalls`),
			el("dl").append(
				el("dt", t`Leaking event listeners or resources`),
				el("dd", t`Always use AbortSignal-based cleanup to automatically remove listeners when elements
					are disconnected`),

				el("dt", t`Tight coupling with library internals`),
				el("dd", t`Focus on standard DOM APIs and clean interfaces rather than depending on dd<el>
					implementation details`),

				el("dt", t`Mutating element prototypes`),
				el("dd", t`Prefer compositional approaches with addons over modifying element prototypes`),

				el("dt", t`Duplicating similar signal logic across components`),
				el("dd", t`Use signal factories to encapsulate and reuse related signal behavior`),

				el("dt", t`Complex initialization in addons`),
				el("dd", t`Split complex logic into a separate initialization function that the addon can call`)
			)
		)
	);
}