import "./global.css.js";
import { el } from "deka-dom-el";

import { header } from "./layout/head.html.js";
import { example } from "./components/example.html.js";
import { prevNext } from "./components/prevNext.html.js";

/** @param {string} url */
const fileURL= url=> new URL(url, import.meta.url);

/** @param {import("./types.d.ts").PageAttrs} attrs */
export function page({ pkg, info }){
	const page_id= info.id;
	return el().append(
		el(header, { info, pkg }),
		el("main").append(
			el("h2", "Native JavaScript DOM elements creations"),
			el("p", "Let’s go through all patterns we would like to use and what needs to be improved for better experience."),
			
			el("h3", "Creating element(s) (with custom attributes)"),
			el("p").append(
				"You can create a native DOM element by using the ",
				el("a", { href: "https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement", title: "MDN documentation for document.createElement()" }).append(
					el("code", "document.createElement()")
				), ". ",
				"It is also possible to provide a some attribute(s) declaratively using ", el("code", "Object.assign()"), ". ",
				"More precisely, this way you can sets some ",
				el("a", {
					href: "https://developer.mozilla.org/en-US/docs/Glossary/IDL",
					title: "MDN page about Interface Description Language"
				}).append(
					el("abbr", { textContent: "IDL", title: "Interface Description Language" })
				), " also known as a JavaScript property."
			),
			el(example, { src: fileURL("./components/examples/elements/nativeCreateElement.js"), page_id }),
			el("p").append(
				"To make this easier, you can use the ", el("code", "el"), " function. ",
				"Internally in basic examples, it is wrapper around ", el("code", "assign(document.createElement(…), { … })"), "."
			),
			el(example, { src: fileURL("./components/examples/elements/dekaCreateElement.js"), page_id }),
			el("p").append(
				"The ", el("code", "assign"), " function provides improved behaviour of ", el("code", "Object.assign()"), ". ",
				"You can declaratively sets any IDL and attribute of the given element. ",
				"Function prefers IDL and fallback to the ", el("code", "element.setAttribute"), " if there is no writable property in the element prototype."
			),
			el("p").append(
				"You can study all JavaScript elements interfaces to the corresponding HTML elements. ",
				"All HTML elements inherits from ", el("a", { textContent: "HTMLElement", href: "https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement" }), ". ",
				"To see all available IDLs for example for paragraphs, see ", el("a", { textContent: "HTMLParagraphElement", href: "https://developer.mozilla.org/en-US/docs/Web/API/HTMLParagraphElement" }), ". ",
				"Moreover, the ", el("code", "assign"), " provides a way to sets declaratively some convenient properties:"
			),
			el("ul").append(
				el("li").append(
					"It is possible to sets ", el("code", "data-*"), "/", el("code", "aria-*"), " attributes using object notation."
				),
				el("li").append(
					"In opposite, it is also possible to sets ", el("code", "data-*"), "/", el("code", "aria-*"), " attribute using camelCase notation."
				),
				el("li").append(
					"You can use string or object as a value for ", el("code", "style"), " property."
				),
				el("li").append(
					el("code", "className"), " (IDL – preffered)/", el("code", "class"), " are ways to add CSS class to the element. ",
					"You can use string (similarly to ", el("code", "class=\"…\"") ," syntax in  HTML) or array of strings. ",
					"This is handy to concat conditional classes."
				),
				el("li").append(
					"Use ", el("code", "classList"), " to toggle specific classes. This will be handy later when the reactivity via signals is beeing introduced.",
				),
				el("li").append(
					"The ", el("code", "assign"), " also accepts the ", el("code", "undefined"), " as a value for any property to remove it from the element declaratively. ",
					"Also for some IDL the corresponding attribute is removed as it can be confusing. ",
					el("em").append(
						"For example, natievly the element’s ", el("code", "id"), " is removed by setting the IDL to an empty string."
					)
				),
				el("li").append(
					"You can use ", el("code", "="), " or ", el("code", "."), " to force processing given key as attribute/property of the element."
				)
			),
			el("p").append(
				"For processing, the ", el("code", "assign"), " internally uses ", el("code", "assignAttribute"), " and ", el("code", "classListDeclarative"), "."
			),
			el(example, { src: fileURL("./components/examples/elements/dekaAssign.js"), page_id }),
			
			el("h3", "Native JavaScript templating"),
			el("p", "By default, the native JS has no good way to define HTML template using DOM API:"),
			el(example, { src: fileURL("./components/examples/elements/nativeAppend.js"), page_id }),
			el("p").append(
				"This library therefore overwrites the ", el("code", "append"), " method of created elements to always return parent element."
			),
			el(example, { src: fileURL("./components/examples/elements/dekaAppend.js"), page_id }),
			
			
			el("h3", "Basic (state-less) components"),
			el("p").append(
				"You can use functions for encapsulation (repeating) logic. ",
				"The ", el("code", "el"), " accepts function as first argument. ",
				"In that case, the function should return dom elements and the second argument for ", el("code", "el"), " is argument for given element."
			),
			el(example, { src: fileURL("./components/examples/elements/dekaBasicComponent.js"), page_id }),
			el("p").append(
				"As you can see, in case of state-less/basic components there is no difference",
				" between calling component function directly or using ", el("code", "el"), " function.",
			),
			el("p", { className: "notice" }).append(
				"It is nice to use similar naming convention as native DOM API. ",
				"This allows us to use ", el("a", { textContent: "the destructuring assignment syntax", href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment", title: "Destructuring assignment | MDN" }),
				" and keep track of the native API (things are best remembered through regular use).",
			),

			el("h3", "Creating non-HTML elements"),
			el("p").append(
				"Similarly to the native DOM API (", el("a", { href: "https://developer.mozilla.org/en-US/docs/Web/API/Document/createElementNS", title: "MDN" }).append(el("code", "document.createElementNS")), ") for non-HTML elements",
				" we need to tell JavaScript which kind of the element to create.",
				" We can use the ", el("code", "elNS"), " function:"
			),
			el(example, { src: fileURL("./components/examples/elements/dekaElNS.js"), page_id }),

			el(prevNext, info)
		)
	);
}
