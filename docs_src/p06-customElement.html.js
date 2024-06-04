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
		href: "https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements#responding_to_attribute_changes",
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
	}
};
/** @param {import("./types.d.ts").PageAttrs} attrs */
export function page({ pkg, info }){
	const page_id= info.id;
	return el(simplePage, { info, pkg }).append(
		el("h2", t`Using web components in combinantion with DDE`),
		el("p").append(...T`
			The DDE library allows for use within ${el("a", references.mdn_web_components).append( el("strong", "Web Components") )}
			for dom-tree generation. However, in order to be able to use signals (possibly mapping to registered
			${el("a", references.mdn_observedAttributes).append( el("code", "observedAttributes") )}) and additional
			functionality is (unfortunately) required to use helpers provided by the library.
		`),
		el(code, { src: fileURL("./components/examples/customElement/intro.js"), page_id }),

		el(h3, t`Custom Elements Introduction`),
		el("p").append(...T`
			To start with, let’s see how to use native Custom Elements. As starting point please read
			${el("a", references.mdn_custom_elements).append( el("strong", "Using Custom Elements"), " on MDN" )}.
			To sum up and for mnemonic see following code overview:
		`),
		el(code, { src: fileURL("./components/examples/customElement/native-basic.js"), page_id }),
		el("p").append(...T`
			For more advanced use of Custom Elements, the summary ${el("a", references.custom_elements_tips)
			.append( el("strong", t`Handy Custom Elements' Patterns`) )} may be useful. Especially pay attention to
			linking HTML attributes and defining setters/getters, this is very helpful to use in combination with
			the library (${el("code", "el(CustomHTMLElement.tagName, { customAttribute: \"new-value\" });")}).
		`),

		el(mnemonic)
	);
}
