import { T, t } from "./utils/index.js";
export const info= {
	title: t`Events and Addons`,
	fullTitle: t`Declarative Event Handling and Addons`,
	description: t`Using events and addons for declarative UI interactions.`,
};

import { el } from "deka-dom-el";
import { simplePage } from "./layout/simplePage.html.js";
import { example } from "./components/example.html.js";
import { h3 } from "./components/pageUtils.html.js";
import { mnemonic } from "./components/mnemonic/events-init.js";
import { code } from "./components/code.html.js";
/** @param {string} url */
const fileURL= url=> new URL(url, import.meta.url);
const references= {
	/** element.addEventListener() */
	mdn_listen: {
		title: t`MDN documentation page for element.addEventListener`,
		href: "https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener",
	},
	/** AbortSignal+element.addEventListener */
	mdn_abortListener: {
		title: t`MDN documentation page for using AbortSignal with element.addEventListener`,
		href: "https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#signal",
	},
	/** comparison listening options by WebReflection */
	web_events: {
		href: "https://gist.github.com/WebReflection/b404c36f46371e3b1173bf5492acc944",
	},
	/** Custom Element lifecycle callbacks */
	mdn_customElement: {
		href: "https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements#custom_element_lifecycle_callbacks" // editorconfig-checker-disable-line
	},
	/** MutationObserver */
	mdn_mutation: {
		href: "https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver",
	},
};
/** @param {import("./types.d.ts").PageAttrs} attrs */
export function page({ pkg, info }){
	return el(simplePage, { info, pkg }).append(
		el("p").append(T`
			Events are at the core of interactive web applications. dd<el> provides a clean, declarative approach to
			handling DOM events and extends this pattern with a powerful Addon system to incorporate additional
			functionalities into your UI templates.
		`),
		el("div", { className: "callout" }).append(
			el("h4", t`Why dd<el>’s Event System and Addons Matters`),
			el("ul").append(
				el("li", t`Integrate event handling directly in element declarations`),
				el("li", t`Leverage lifecycle events for better component design`),
				el("li", t`Clean up listeners automatically with abort signals`),
				el("li", t`Extend elements with custom behaviors using Addons`),
				el("li", t`Maintain clean, readable code with consistent patterns`)
			)
		),

		el(code, { src: fileURL("./components/examples/events/intro.js") }),

		el(h3, t`Events and Listeners: Two Approaches`),
		el("p").append(T`
			In JavaScript you can listen to native DOM events using
			${el("a", references.mdn_listen).append(el("code", "element.addEventListener(type, listener, options)"))}.
			dd<el> provides an alternative approach with arguments ordered differently to better fit its declarative
			style:
		`),
		el("div", { className: "illustration" }).append(
			el("div", { className: "tabs" }).append(
				el("div", { className: "tab" }).append(
					el("h5", t`Native DOM API`),
					el(code, { content: `element.addEventListener("click", callback, options);`, language: "js" })
				),
				el("div", { className: "tab" }).append(
					el("h5", t`dd<el> Approach`),
					el(code, { content: `on("click", callback, options)(element);`, language: "js" })
				)
			)
		),
		el("p").append(T`
			The main benefit of dd<el>’s approach is that it works as an Addon (see below), making it easy to integrate
			directly into element declarations.
		`),
		el(example, { src: fileURL("./components/examples/events/compare.js") }),

		el(h3, t`Removing Event Listeners`),
		el("div", { className: "note" }).append(
			el("p").append(T`
				Unlike the native addEventListener/removeEventListener pattern, dd<el> uses ${el("strong", "only")}
				${el("a", { textContent: "AbortSignal", ...references.mdn_abortListener })} for declarative removal:
			`)
		),
		el(example, { src: fileURL("./components/examples/events/abortSignal.js") }),
		el("p").append(T`
			This is the same for signals (see next section) and works well with scopes and library extendability (
			see scopes and extensions section — mainly ${el("code", "scope.signal")}).
		`),

		el(h3, t`Three Ways to Handle Events`),
		el("div", { className: "tabs" }).append(
			el("div", { className: "tab", dataTab: "html-attr" }).append(
				el("h4", t`HTML Attribute Style`),
				el(code, { src: fileURL("./components/examples/events/attribute-event.js") }),
				el("p").append(T`
					Forces usage as an HTML attribute. Corresponds to
					${el("code", `<button onclick="console.log(event)">click me</button>`)}. This can be particularly
					useful for SSR scenarios.
				`)
			),
			el("div", { className: "tab", dataTab: "property" }).append(
				el("h4", t`Property Assignment`),
				el(code, { src: fileURL("./components/examples/events/property-event.js") }),
				el("p", t`Assigns the event handler directly to the element’s property.`)
			),
			el("div", { className: "tab", dataTab: "addon" }).append(
				el("h4", t`Addon Approach`),
				el(code, { src: fileURL("./components/examples/events/chain-event.js") }),
				el("p", t`Uses the addon pattern (so adds the event listener to the element), see above.`)
			)
		),
		el("p").append(T`
			For a deeper comparison of these approaches, see
			${el("a", { textContent: "WebReflection’s detailed analysis", ...references.web_events })}.
		`),

		el(h3, t`Understanding Addons`),
		el("p").append(T`
			Addons are a powerful pattern in dd<el> that extends beyond just event handling.
			An Addon is any function that accepts an HTML element as its first parameter.
		`),
		el("div", { className: "callout" }).append(
			el("h4", t`What Can Addons Do?`),
			el("ul").append(
				el("li", t`Add event listeners to elements`),
				el("li", t`Set up lifecycle behaviors`),
				el("li", t`Integrate third-party libraries`),
				el("li", t`Create reusable element behaviors`),
				el("li", t`Capture element references`), // TODO: add example?
			)
		),
		el("p").append(T`
			You can use Addons as ≥3rd argument of the ${el("code", "el")} function, making it possible to
			extend your templates with additional functionality:
		`),
		el(example, { src: fileURL("./components/examples/events/templateWithListeners.js") }),
		el("p").append(T`
			As the example shows, you can provide types in JSDoc+TypeScript using the global type
			${el("code", "ddeElementAddon")}. Notice how Addons can also be used to get element references.
		`),

		el(h3, t`Lifecycle Events`),
		el("p").append(T`
			Addons are called immediately when an element is created, even before it’s connected to the live DOM.
			You can think of an Addon as an “oncreate” event handler.
		`),
		el("p").append(T`
			dd<el> provides two additional lifecycle events that correspond to ${el("a", { textContent:
				"custom element", ...references.mdn_customElements })} lifecycle callbacks and component patterns:
		`),
		el("div", { className: "function-table" }).append(
			el("dl").append(
				el("dt", t`on.connected(callback)`),
				el("dd", t`Fires when the element is added to the DOM`),

				el("dt", t`on.disconnected(callback)`),
				el("dd", t`Fires when the element is removed from the DOM`),
			)
		),
		el(example, { src: fileURL("./components/examples/events/live-cycle.js") }),

		el("div", { className: "note" }).append(
			el("p").append(T`
				For regular elements (non-custom elements), dd<el> uses ${el("a",
					references.mdn_mutation).append(el("code", "MutationObserver"), " | MDN")} internally to track
				lifecycle events.
			`)
		),

		el("div", { className: "warning" }).append(
			el("ul").append(
				el("li").append(T`
					Always use ${el("code", "on.*")} functions as library must ensure proper (MutationObserver)
					registration, not ${el("code", "on('dde:*', ...)")}, even the native event system is used with event
					names prefixed with ${el("code", "dde:")}.
				`),
				el("li").append(T`
					Use lifecycle events sparingly, as they require internal tracking
				`),
				el("li").append(T`
					Leverage parent-child relationships: when a parent is removed, all children are also removed
				`),
				el("li").append(T`
					…see section later in documentation regarding hosts elements
				`),
				el("li").append(T`
					dd<el> ensures that connected/disconnected events fire only once for better predictability
				`)
			)
		),

		el(h3, t`Utility Helpers`),
		el("p").append(T`
			You can use the ${el("code", "on.defer")} helper to defer execution to the next event loop.
			This is useful for example when you wan to set some element properties based on the current element
			body (typically the ${el("code", "<select value=\"...\">")}).
		`),
		el("div", { className: "function-table" }).append(
			el("dl").append(
				el("dt", t`on.defer(callback)`),
				el("dd", t`Helper that defers function execution to the next event loop (using setTimeout)`),
			)
		),

		el(h3, t`Dispatching Custom Events`),
		el("p").append(T`
			This makes it easy to implement component communication through events, following standard web platform
			patterns. The curried approach allows for easy reuse of event dispatchers throughout your application.
		`),
		el(example, { src: fileURL("./components/examples/events/compareDispatch.js") }),
		el(code, { src: fileURL("./components/examples/events/dispatch.js") }),

		el(h3, t`Best Practices`),
		el("ol").append(
			el("li").append(T`
				${el("strong", "Clean up listeners")}: Use AbortSignal to prevent memory leaks
			`),
			el("li").append(T`
				${el("strong", "Leverage lifecycle events")}: For component setup and teardown
			`),
			el("li").append(T`
				${el("strong", "Delegate when possible")}: Add listeners to container elements when handling many
				similar elements
			`),
			el("li").append(T`
				${el("strong", "Maintain consistency")}: Choose one event binding approach and stick with it
			`)
		),

		el("div", { className: "troubleshooting" }).append(
			el("h4", t`Common Event Pitfalls`),
			el("dl").append(
				el("dt", t`Event listeners not working`),
				el("dd", t`Ensure element is in the DOM before expecting events to fire`),

				el("dt", t`Memory leaks`),
				el("dd", t`Use AbortController to clean up listeners when elements are removed`),

				el("dt", t`Lifecycle events firing unexpectedly`),
				el("dd", t`Remember that on.connected and on.disconnected events only fire once per connection state`)
			)
		),

		el(mnemonic),
	);
}
