import { T, t } from "./utils/index.js";
export const info= {
	title: t`Web Components`,
	description: t`Using custom elements in combinantion with DDE`,
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
		el("h2", t`Using web components in combinantion with DDE`),
		el("p").append(...T`
			The DDE library allows for use within ${el("a", references.mdn_web_components).append( el("strong",
			t`Web Components`) )} for dom-tree generation. However, in order to be able to use signals (possibly
			mapping to registered ${el("a", references.mdn_observedAttributes).append( el("code", "observedAttributes")
			)}) and additional functionality is (unfortunately) required to use helpers provided by the library.
		`),
		el(code, { src: fileURL("./components/examples/customElement/intro.js"), page_id }),

		el(h3, t`Custom Elements Introduction`),
		el("p").append(...T`
			Web Components, specifically Custom Elements, are a set of web platform APIs that allow you to create
			new HTML tags with custom functionality encapsulated within them. This allows for the creation of reusable
			components that can be used across web applications.
		`),
		el("p").append(...T`
			To start with, let’s see how to use native Custom Elements. As starting point please read
			${el("a", references.mdn_custom_elements).append( el("strong", t`Using Custom Elements`), t` on MDN` )}.
			To sum up and for mnemonic see following code overview:
		`),
		el(code, { src: fileURL("./components/examples/customElement/native-basic.js"), page_id }),
		el("p").append(...T`
			For more advanced use of Custom Elements, the summary ${el("a", references.custom_elements_tips)
			.append( el("strong", t`Handy Custom Elements Patterns`) )} may be useful. Especially pay attention to
			linking HTML attributes and defining setters/getters, this is very helpful to use in combination with
			the library (${el("code", `el(HTMLCustomElement.tagName, { customAttribute: "${t`new-value`}" });`)}).
		`),
		el("p").append(...T`
			Also see the Life Cycle Events sections, very similarly we would like to use
			${el("a", { textContent: t`DDE events`, href: "./p03-events.html", title: t`See events part of the library
			documentation` })}. To do it, the library provides function ${el("code", "customElementWithDDE")}…
		`),
		el(example, { src: fileURL("./components/examples/customElement/customElementWithDDE.js"), page_id }),

		el("h3", t`Custom Elements with DDE`),
		el("p").append(...T`
			The ${el("code", "customElementWithDDE")} function is only (small) part of the inregration of the library.
			More important for coexistence is render component function as a body of the Custom Element. For that, you
			can use ${el("code", "customElementRender")} with arguments instance reference, target for connection,
			render function and optional properties (will be passed to the render function) see later…
		`),
		el(example, { src: fileURL("./components/examples/customElement/dde.js"), page_id }),
		el("p").append(...T`
			…as you can see, you can use components created based on the documentation previously introduced. To unlock
			full potential, use with combination ${el("code", "customElementWithDDE")} (allows to use livecycle events)
			and ${el("code", "observedAttributes")} (converts attributes to render function arguments —
			${el("em", "default")}) or ${el("code", "S.observedAttributes")} (converts attributes to signals).
		`),
		el(example, { src: fileURL("./components/examples/customElement/observedAttributes.js"), page_id }),


		el(h3, t`Shadow DOM`),
		el("p").append(...T`
			Shadow DOM is a web platform feature that allows for the encapsulation of a component’s internal DOM tree
			from the rest of the document. This means that styles and scripts applied to the document will not affect
			the component’s internal DOM, and vice versa.
		`),
		el(example, { src: fileURL("./components/examples/customElement/shadowRoot.js"), page_id }),
		el("p").append(...T`
			Regarding to ${el("code", "this.attachShadow({ mode: 'open' })")} see quick overview
			${el("a", { textContent: t`Using Shadow DOM`, ...references.mdn_shadow_dom_depth })}. An another source of
			information can be ${el("a", { textContent: t`Shadow DOM in Depth`, ...references.shadow_dom_depth })}.
		`),
		el("p").append(...T`
			Besides the encapsulation, the Shadow DOM allows for using the ${el("a", references.mdn_shadow_dom_slot).append(
			el("strong", t`<slot>`), t` element(s)`)}. You can simulate this feature using ${el("code", "simulateSlots")}:
		`),
		el(example, { src: fileURL("./components/examples/customElement/simulateSlots.js"), page_id }),
		el("p").append(...T`
			To sum up:
		`),
		el("ul").append(
			el("li").append(...T`
				The use of shadow DOM to encapsulate the internal structure of the custom element, which affects how
				the custom element can be styled and modified using JavaScript and CSS.
			`),
			el("li").append(...T`
				The ability to access and modify the internal structure of the custom element using JavaScript, which
				is affected by the use of shadow DOM and the mode of the shadow DOM.
			`),
			el("li").append(...T`
				The use of slots to allow for the insertion of content from the parent document into the custom
				element, which is affected by the use of shadow DOM and the mode of the shadow DOM.
			`),
		),

		el(mnemonic)
	);
}
