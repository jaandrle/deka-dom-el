import { T, t } from "./utils/index.js";
export const info= {
	title: t`Custom elements`,
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
	/** Custom Elements on MDN */
	custom_elements: {
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
		el("h2", t`Using custom elements in combinantion with DDE`),
		el("p").append(...T`
		`),
		el(code, { src: fileURL("./components/examples/customElement/intro.js"), page_id }),

		el(h3, t`Custom Elements Introduction`),
		el("p").append(...T`
			${el("a", { textContent: t`Using custom elements`, ...references.custom_elements })}
		`),
		el(code, { src: fileURL("./components/examples/customElement/native-basic.js"), page_id }),
		el("p").append(...T`
			${el("a", { textContent: t`Handy Custom Elements' Patterns`, ...references.custom_elements_tips })}
		`),

		el(mnemonic)
	);
}
