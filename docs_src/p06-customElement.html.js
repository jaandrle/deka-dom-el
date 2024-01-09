import { simplePage } from "./layout/simplePage.html.js";

import { el } from "deka-dom-el";
import { example } from "./components/example.html.js";
import { h3 } from "./components/pageUtils.html.js";
import { mnemonic } from "./components/mnemonic/customElement-init.js";
import { code } from "./components/code.html.js";
/** @param {string} url */
const fileURL= url=> new URL(url, import.meta.url);

/** @param {import("./types.d.ts").PageAttrs} attrs */
export function page({ pkg, info }){
	const page_id= info.id;
	return el(simplePage, { info, pkg }).append(
		el("h2", "Using custom elements in combinantion with DDE"),
		el("p").append(

		),
		el(code, { src: fileURL("./components/examples/customElement/intro.js"), page_id }),

		el(h3, "Custom Elements Introduction"),
		el("p").append(
			el("a", { textContent: "Using custom elements", href: "https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements", title: "Article about custom elements on MDN" })
		),
		el(code, { src: fileURL("./components/examples/customElement/native-basic.js"), page_id }),
		el("p").append(
			el("a", { textContent: "Handy Custom Elements' Patterns", href: "https://gist.github.com/WebReflection/ec9f6687842aa385477c4afca625bbf4", title: "Ideas and tips from WebReflection" })
		),

		el(mnemonic)
	);
}
