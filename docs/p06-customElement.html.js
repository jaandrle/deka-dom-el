import { T, t } from "./utils/index.js";
export const info= {
	title: t`Web Components`,
	fullTitle: t`Using Web Components with DDE: Better Together`,
	description: t`Using custom elements in combination with DDE`,
};

import { el } from "deka-dom-el";
import { simplePage } from "./layout/simplePage.html.js";
import { example } from "./components/example.html.js";
import { h3 } from "./components/pageUtils.html.js";
import { mnemonic } from "./components/mnemonic/customElement-init.js";
import { code } from "./components/code.html.js";
/** @param {string} url */
const fileURL= url=> new URL(url, import.meta.url);
const references= {
	/** Web Components on MDN */
	mdn_web_components: {
		title: t`MDN documentation page for Web Components`,
		href: "https://developer.mozilla.org/en-US/docs/Web/API/Web_components",
	},
	/** observedAttributes on MDN */
	mdn_observedAttributes: {
		title: t`MDN documentation page for observedAttributes`,
		href: "https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements#responding_to_attribute_changes", // editorconfig-checker-disable-line
	},
	/** Custom Elements on MDN */
	mdn_custom_elements: {
		title: t`MDN documentation page for Custom Elements`,
		href: "https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements",
	},
	/** Custom Elements tips from WebReflection */
	custom_elements_tips: {
		title: t`Ideas and tips from WebReflection`,
		href: "https://gist.github.com/WebReflection/ec9f6687842aa385477c4afca625bbf4",
	},
	/** Shallow DOM on mdn */
	mdn_shadow_dom_depth: {
		title: t`MDN documentation page for Shadow DOM`,
		href: "https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM",
	},
	/** Shallow DOM on mdn */
	mdn_shadow_dom_slot: {
		title: t`MDN documentation page for <slot>`,
		href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/slot",
	},
	/** Shallow DOM */
	shadow_dom_depth: {
		title: t`Everything you need to know about Shadow DOM (github repo praveenpuglia/shadow-dom-in-depth)`,
		href: "https://github.com/praveenpuglia/shadow-dom-in-depth",
	},
};
/** @param {import("./types.d.ts").PageAttrs} attrs */
export function page({ pkg, info }){
	const page_id= info.id;
	return el(simplePage, { info, pkg }).append(
		el("p").append(...T`
			DDE pairs powerfully with ${el("a", references.mdn_web_components).append(el("strong", t`Web Components`))}
			to create reusable, encapsulated custom elements with all the benefits of DDE's declarative DOM
			construction and reactivity system.
		`),
		el("div", { className: "callout" }).append(
			el("h4", t`Why Combine DDE with Web Components?`),
			el("ul").append(
				el("li", t`Declarative DOM creation within your components`),
				el("li", t`Reactive attribute updates through signals`),
				el("li", t`Simplified event handling with the same events API`),
				el("li", t`Clean component lifecycle management`),
				el("li", t`Improved code organization with scopes`)
			)
		),
		el(code, { src: fileURL("./components/examples/customElement/intro.js"), page_id }),

		el(h3, t`Getting Started: Web Components Basics`),
		el("p").append(...T`
			Web Components are a set of standard browser APIs that let you create custom HTML elements with
			encapsulated functionality. They consist of three main technologies:
		`),
		el("ul").append(
			el("li").append(...T`
				${el("strong", "Custom Elements:")} Create your own HTML tags with JS-defined behavior
			`),
			el("li").append(...T`
				${el("strong", "Shadow DOM:")} Encapsulate styles and markup within a component
			`),
			el("li").append(...T`
				${el("strong", "HTML Templates:")} Define reusable markup structures
			`)
		),
		el("p").append(...T`
			Let's start with a basic Custom Element example without DDE to establish the foundation:
		`),
		el(code, { src: fileURL("./components/examples/customElement/native-basic.js"), page_id }),

		el("div", { className: "note" }).append(
			el("p").append(...T`
				For complete information on Web Components, see the
				${el("a", references.mdn_custom_elements).append(el("strong", t`MDN documentation`))}.
				Also, ${el("a", references.custom_elements_tips).append(el("strong", t`Handy Custom Elements Patterns`))}
				provides useful techniques for connecting attributes with properties.
			`)
		),

		el(h3, t`DDE Integration: Step 1 - Event Handling`),
		el("p").append(...T`
			The first step in integrating DDE with Web Components is enabling DDE's event system to work with your
			Custom Elements. This is done with ${el("code", "customElementWithDDE")}, which makes your Custom Element
			compatible with DDE's event handling.
		`),
		el("div", { className: "function-table" }).append(
			el("h4", t`customElementWithDDE`),
			el("dl").append(
				el("dt", t`Purpose`),
				el("dd", t`Enables DDE's event system to work with your Custom Element`),
				el("dt", t`Usage`),
				el("dd", t`customElementWithDDE(YourElementClass)`),
				el("dt", t`Benefits`),
				el("dd", t`Allows using on.connected(), on.disconnected(), etc. with your element`)
			)
		),
		el(example, { src: fileURL("./components/examples/customElement/customElementWithDDE.js"), page_id }),

		el("div", { className: "tip" }).append(
			el("p").append(...T`
				${el("strong", "Key Point:")} The ${el("code", "customElementWithDDE")} function adds event dispatching
				to your Custom Element lifecycle methods, making them work seamlessly with DDE's event system.
			`)
		),

		el(h3, t`DDE Integration: Step 2 - Rendering Components`),
		el("p").append(...T`
			The next step is to use DDE's component rendering within your Custom Element. This is done with
			${el("code", "customElementRender")}, which connects your DDE component function to the Custom Element.
		`),
		el("div", { className: "function-table" }).append(
			el("h4", t`customElementRender`),
			el("dl").append(
				el("dt", t`Purpose`),
				el("dd", t`Connects a DDE component function to a Custom Element`),
				el("dt", t`Parameters`),
				el("dd").append(
					el("ol").append(
						el("li", t`Target (usually this or this.shadowRoot)`),
						el("li", t`Component function that returns a DOM tree`),
						el("li", t`Optional: Attributes transformer function (default or S.observedAttributes)`)
					)
				),
				el("dt", t`Returns`),
				el("dd", t`The rendered DOM tree`)
			)
		),
		el(example, { src: fileURL("./components/examples/customElement/dde.js"), page_id }),

		el("div", { className: "note" }).append(
			el("p").append(...T`
				In this example, we're using Shadow DOM (${el("code", "this.attachShadow()")}) for encapsulation,
				but you can also render directly to the element with ${el("code", "customElementRender(this, ...)")}.
			`)
		),

		el(h3, t`Reactive Web Components with Signals`),
		el("p").append(...T`
			One of the most powerful features of integrating DDE with Web Components is connecting HTML attributes
			to DDE's reactive signals system. This creates truly reactive custom elements.
		`),
		el("div", { className: "tip" }).append(
			el("p").append(...T`
				${el("strong", "Two Ways to Handle Attributes:")}
			`),
			el("ol").append(
				el("li").append(...T`
					${el("code", "observedAttributes")} - Passes attributes as regular values (static)
				`),
				el("li").append(...T`
					${el("code", "S.observedAttributes")} - Transforms attributes into signals (reactive)
				`)
			)
		),
		el("p").append(...T`
			Using ${el("code", "S.observedAttributes")} creates a reactive connection between your element's attributes
			and its internal rendering. When attributes change, your component automatically updates!
		`),
		el(example, { src: fileURL("./components/examples/customElement/observedAttributes.js"), page_id }),

		el("div", { className: "callout" }).append(
			el("h4", t`How S.observedAttributes Works`),
			el("ol").append(
				el("li", t`Takes each attribute listed in static observedAttributes`),
				el("li", t`Creates a DDE signal for each one`),
				el("li", t`Automatically updates these signals when attributes change`),
				el("li", t`Passes the signals to your component function`),
				el("li", t`Your component reacts to changes through signal subscriptions`)
			)
		),

		el(h3, t`Working with Shadow DOM`),
		el("p").append(...T`
			Shadow DOM provides encapsulation for your component's styles and markup. When using DDE with Shadow DOM,
			you get the best of both worlds: encapsulation plus declarative DOM creation.
		`),
		el("div", { className: "illustration" }).append(
			el("h4", t`Shadow DOM Encapsulation`),
			el("pre").append(el("code", `
<my-custom-element>

  ┌─────────────────────────┐
    #shadow-root

     Created with DDE:
     ┌──────────────────┐
       <div>
         <h2>Title</h2>
         <p>Content</p>
			`))
		),
		el(example, { src: fileURL("./components/examples/customElement/shadowRoot.js"), page_id }),

		el("p").append(...T`
			For more information on Shadow DOM, see
			${el("a", { textContent: t`Using Shadow DOM`, ...references.mdn_shadow_dom_depth })}, or the comprehensive
			${el("a", { textContent: t`Shadow DOM in Depth`, ...references.shadow_dom_depth })}.
		`),

		el(h3, t`Working with Slots`),
		el("p").append(...T`
			Besides the encapsulation, the Shadow DOM allows for using the ${el("a", references.mdn_shadow_dom_slot).append(
			el("strong", t`<slot>`), t` element(s)`)}. You can simulate this feature using ${el("code", "simulateSlots")}:
		`),
		el(example, { src: fileURL("./components/examples/customElement/simulateSlots.js"), page_id }),
		el("div", { className: "function-table" }).append(
			el("h4", t`simulateSlots`),
			el("dl").append(
				el("dt", t`Purpose`),
				el("dd", t`Provides slot functionality when you cannot/do not want to use shadow DOM`),
				el("dt", t`Parameters`),
				el("dd", t`A mapping object of slot names to DOM elements`)
			)
		),

		el(h3, t`Best Practices for Web Components with DDE`),
		el("p").append(...T`
			When combining DDE with Web Components, follow these recommendations:
		`),
		el("ol").append(
			el("li").append(...T`
				${el("strong", "Always use customElementWithDDE")} to enable event integration
			`),
			el("li").append(...T`
				${el("strong", "Prefer S.observedAttributes")} for reactive attribute connections
			`),
			el("li").append(...T`
				${el("strong", "Create reusable component functions")} that your custom elements render
			`),
			el("li").append(...T`
				${el("strong", "Use scope.host()")} to clean up event listeners and subscriptions
			`),
			el("li").append(...T`
				${el("strong", "Add setters and getters")} for better property access to your element
			`)
		),

		el("div", { className: "troubleshooting" }).append(
			el("h4", t`Common Issues`),
			el("dl").append(
				el("dt", t`Events not firing properly`),
				el("dd", t`Make sure you called customElementWithDDE before defining the element`),
				el("dt", t`Attributes not updating`),
				el("dd", t`Check that you've properly listed them in static observedAttributes`),
				el("dt", t`Component not rendering`),
				el("dd", t`Verify customElementRender is called in connectedCallback, not constructor`)
			)
		),

		el(mnemonic)
	);
}
