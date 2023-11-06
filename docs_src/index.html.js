import { el } from "deka-dom-el";
import { head as headCommon } from "./layout/head.html.js";
export function head(pkg, path_target){
	return headCommon({
		id: "index",
		title: pageName(pkg),
		description: "Introducing basic concepts.",
		pkg, path_target
	});
}

import { styles, common } from "./index.css.js";
import { example, css as example_css } from "./components/example.html.js";
export const css= styles()
.include(common)
.css`
.note{
	font-size: .9rem;
	font-style: italic;
}
`
.include(example_css);
export function body(pkg){
	return el().append(
		el("h1", pageName(pkg)),
		el("p").append(
			"The library tries to provide pure JavaScript tool(s) to create reactive interfaces. ",
			"The main goals are:"
		),
		el("ul").append(
			el("li", "provide a small wrappers/utilities around the native JavaScript DOM"),
			el("li", "keep library size around 10kB at maximum (if possible)"),
			el("li", "zero dependencies (if possible)"),
			el("li", "prefer a declarative/functional approach"),
			el("li", "unopinionated (allow alternative methods)"),
		),
		el("p", { className: "note" }).append(
			"It is, in fact, an reimplementation of ",
			el("a", {
				href: "https://github.com/jaandrle/dollar_dom_component",
				title: "GitHub repository of library. Motto: Functional DOM components without JSX and virtual DOM.",
				textContent: "jaandrle/dollar_dom_component"
			}),
			".",
		),
		el(example, { src: "./components/examples/helloWorld.js" }),
		
		
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
			), "."
		),
		el(example, { src: "./components/examples/nativeCreateElement.js" }),
		el("p").append(
			"To make this easier, you can use the ", el("code", "el"), " function. ",
			"Internally in basic examples, it is wrapper around ", el("code", "assign(document.createElement(…), { … })"), "."
		),
		el(example, { src: "./components/examples/dekaCreateElement.js" }),
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
			)
		),
		el("p").append(
			"For processing, the ", el("code", "assign"), " internally uses ", el("code", "assignAttribute"), " and ", el("code", "classListDeclarative"), "."
		),
		el(example, { src: "./components/examples/dekaAssign.js" }),
		
		el("h3", "Native JavaScript templating"),
		el("p", "By default, the native JS has no good way to define HTML template using DOM API:"),
		el(example, { src: "./components/examples/nativeAppend.js" }),
		el("p").append(
			"This library therefore ooverwrites the ", el("code", "append"), " method to always return parent element."
		),
		el(example, { src: "./components/examples/dekaAppend.js" }),
		
		
		el("h2", "Creating advanced (reactive) templates and components"),
		
		el("h3", "Basic components"),
		el("p").append(
			"You can use functions for encapsulation (repeating) logic. ",
			"The ", el("code", "el"), " accepts function as first argument. ",
			"In that case, the function should return dom elements and the second argument for ", el("code", "el"), " is argument for given element."
		),
		el(example, { src: "./components/examples/dekaBasicComponent.js" }),
		el("p", "It is nice to use similar naming convention as native DOM API.")
	);
}
function pageName(pkg){
	return `\`${pkg.name}\` — Introduction/Guide`;
}
