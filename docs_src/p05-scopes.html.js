import { T, t } from "./utils/index.js";
export const info= {
	title: t`Scopes and components`,
	description: t`Organizing UI into components`,
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
	garbage_collection: { /** Garbage collection on MDN */
		title: t`MDN documentation page for Garbage collection`,
		href: "https://developer.mozilla.org/en-US/docs/Glossary/Garbage_collection",
	},
	signals: { /** Signals */
		title: t`Signals section on this library`,
		href: "./p04-signals#h-introducing-signals",
	}
};
/** @param {import("./types.d.ts").PageAttrs} attrs */
export function page({ pkg, info }){
	const page_id= info.id;
	return el(simplePage, { info, pkg }).append(
		el("h2", t`Using functions as UI components`),
		el("p").append(...T`
			For state-less components we can use functions as UI components (see “Elements” page). But in real life,
			we may need to handle the component live-cycle and provide JavaScript the way to properly use
			the ${el("a", { textContent: t`Garbage collection`, ...references.garbage_collection })}.
		`),
		el(code, { src: fileURL("./components/examples/scopes/intro.js"), page_id }),
		el("p").append(...T`The library therefore use ${el("em", t`scopes`)} to provide these functionalities.`),
		
		el(h3, t`Scopes and hosts`),
		el("p").append(...T`
			The ${el("strong", "host")} is the name for the element representing the component. This is typically
			element returned by function. To get reference, you can use ${el("code", "scope.host()")} to applly addons
			just use ${el("code", "scope.host(...<addons>)")}.
		`),
		el(example, { src: fileURL("./components/examples/scopes/scopes-and-hosts.js"), page_id }),
		el("p").append(...T`
			To better understanding we implement function ${el("code", "elClass")} helping to create component as
			class instances.
		`),
		el(example, { src: fileURL("./components/examples/scopes/class-component.js"), page_id }),
		el("p").append(...T`
			As you can see, the ${el("code", "scope.host()")} is stored temporarily and synchronously. Therefore, at
			least in the beginning of using library, it is the good practise to store ${el("code", "host")} in the root
			of your component. As it may be changed, typically when there is asynchronous code in the component.
		`),
		el(code, { src: fileURL("./components/examples/scopes/good-practise.js"), page_id }),

		el(h3, t`Scopes, signals and cleaning magic`),
		el("p").append(...T`
			The ${el("code", "host")} is internally used to register the cleaning procedure, when the component
			(${el("code", "host")} element) is removed from the DOM.
		`),
		el(example, { src: fileURL("./components/examples/scopes/cleaning.js"), page_id }),
		el("p").append(...T`
			The text content of the paragraph is changing when the value of the signal ${el("code", "textContent")}
			is changed. Internally, there is association between ${el("code", "textContent")} and the paragraph,
			similar to using ${el("code", `S.on(textContent, /* ${t`update the paragraph`} */)`)}.
		`),
		el("p").append(...T`
			This listener must be removed when the component is removed from the DOM. To do it, the library assign
			internally ${el("code", `on.disconnected(/* ${t`remove the listener`} */)(host())`)} to the host element.
		`),
		el("p", { className: "notice" }).append(...T`
			The library DOM API and signals works ideally when used declaratively. It means, you split your app logic
			into three parts as it was itroduced in ${el("a", { textContent: "Signals", ...references.signals })}.
		`),
		el(code, { src: fileURL("./components/examples/scopes/declarative.js"), page_id }),
		el("p").append(...T`
			Strictly speaking, the imperative way of using the library is not prohibited. Just be careful (rather avoid)
			mixing declarative approach (using signals) and imperative manipulation of elements.
		`),
		el(code, { src: fileURL("./components/examples/scopes/imperative.js"), page_id }),

		el(mnemonic)
	);
}
