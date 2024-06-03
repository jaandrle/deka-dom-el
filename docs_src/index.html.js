import { t, T } from "./utils/index.js";
export const info= {
	href: "./",
	title: t`Introduction`,
	description: t`Introducing a library.`,
};

import { el } from "deka-dom-el";
import { simplePage } from "./layout/simplePage.html.js";
import { h3 } from "./components/pageUtils.html.js";
import { example } from "./components/example.html.js";
import { code } from "./components/code.html.js";
/** @param {string} url */
const fileURL= url=> new URL(url, import.meta.url);
const references= {
};
/** @param {import("./types.d.ts").PageAttrs} attrs */
export function page({ pkg, info }){
	const page_id= info.id;
	return el(simplePage, { info, pkg }).append(
		el("p", t`The library tries to provide pure JavaScript tool(s) to create reactive interfaces using …`),
		el(h3, t`Event-driven programming (3 parts separation ≡ 3PS)`),
		el("p").append(t`
			Let's introduce the basic principle on which the library is built. We'll use the JavaScript listener as
			a starting point.
		`),
		el(code, { src: fileURL("./components/examples/introducing/3ps.js"), page_id }),
		el("p").append(t`
			As we can see, in the code at location “A” we define how to react when the function is called with
			any event as an argument. At that moment, we don't care who/why/how the function was called. Similarly,
			at point “B”, we reference to a function to be called on the event without caring what the function will
			do at that time. Finally, at point “C”, we tell the application that a change has occurred, in the input,
			and we don't care if/how someone is listening for the event.
		`),
		
		el("p").append(...T`
			We start with creating and modifying a static elements and end up with UI templates.
			${el("em").append(...T`From ${el("code", "document.createElement")} to ${el("code", "el")}.`)}.
			Then we go through the native events system and the way to include it declaratively in UI templates.
			${el("em").append(...T`From ${el("code", "element.addEventListener")} to ${el("code", "on")}.`)}
		`),
		el("p").append(...T`
			Next step is providing interactivity not only for our UI templates.
			We introduce signals (${el("code", "S")}) and how them incorporate to UI templates.
		`),
		el("p").append(...T`
			Now we will clarify how the signals are incorporated into our templates with regard to application
			performance. This is not the only reason the library uses ${el("code", "scope")}s. We will look at
			how they work in components represented in JavaScript by functions.
		`),
		el(example, { src: fileURL("./components/examples/introducing/helloWorld.js"), page_id }),
	);
}
