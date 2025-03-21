import { T, t } from "./utils/index.js";
export const info= {
	title: t`Elements`,
	fullTitle: t`Declarative DOM Element Creation`,
	description: t`Building user interfaces with declarative DOM element creation.`,
};

import { el } from "deka-dom-el";
import { simplePage } from "./layout/simplePage.html.js";
import { example } from "./components/example.html.js";
import { h3 } from "./components/pageUtils.html.js";
import { mnemonic } from "./components/mnemonic/elements-init.js";
import { code } from "./components/code.html.js";
/** @param {string} url */
const fileURL= url=> new URL(url, import.meta.url);
const references= {
	/** document.createElement() */
	mdn_create: {
		title: t`MDN documentation page for document.createElement()`,
		href: "https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement",
	},
	/** Interface Description Language (`el.textContent`) */
	mdn_idl: {
		title: t`MDN page about Interface Description Language`,
		href: "https://developer.mozilla.org/en-US/docs/Glossary/IDL",
	},
	/** HTMLElement */
	mdn_el: {
		title: t`MDN documentation page for HTMLElement`,
		href: "https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement"
	},
	/** HTMLParagraphElement */
	mdn_p: {
		title: t`MDN documentation page for HTMLParagraphElement (\`p\` tag)`,
		href: "https://developer.mozilla.org/en-US/docs/Web/API/HTMLParagraphElement"
	},
	/** `[a, b] = [1, 2]` */
	mdn_destruct: {
		title: t`MDN page about destructuring assignment syntax (e.g. \`[a, b] = [1, 2]\`)`,
		href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment",
	},
	/** document.createElementNS() */
	mdn_ns: {
		title: t`MDN documentation page for document.createElementNS() (e.g. for SVG elements)`,
		href: "https://developer.mozilla.org/en-US/docs/Web/API/Document/createElementNS",
	}
};
/** @param {import("./types.d.ts").PageAttrs} attrs */
export function page({ pkg, info }){
	return el(simplePage, { info, pkg }).append(
		el("p").append(T`
			Building user interfaces in JavaScript often involves creating and manipulating DOM elements.
			dd<el> provides a simple yet powerful approach to element creation that is declarative, chainable,
			and maintains a clean syntax close to HTML structure.
		`),
		el("div", { className: "callout" }).append(
			el("h4", t`dd<el> Elements: Key Benefits`),
			el("ul").append(
				el("li", t`Declarative element creation with intuitive property assignment`),
				el("li", t`Chainable methods for natural DOM tree construction`),
				el("li", t`Simplified component patterns for code reuse`),
				el("li", t`Normalized declarative property/attribute handling across browsers`),
				el("li", t`Smart element return values for cleaner code flow`)
			)
		),

		el(code, { src: fileURL("./components/examples/elements/intro.js") }),

		el(h3, t`Creating Elements: Native vs dd<el>`),
		el("p").append(T`
			In standard JavaScript, you create DOM elements using the
			${el("a", references.mdn_create).append(el("code", "document.createElement()"))} method
			and then set properties individually or with ${el("code", "Object.assign()")}:
		`),
		el("div", { className: "illustration" }).append(
			el("div", { className: "comparison" }).append(
				el("div").append(
					el("h5", t`Native DOM API`),
					el(code, { src: fileURL("./components/examples/elements/native-dom-create.js") })
				),
				el("div").append(
					el("h5", t`dd<el> Approach`),
					el(code, { src: fileURL("./components/examples/elements/dde-dom-create.js") })
				)
			)
		),
		el("p").append(T`
			The ${el("code", "el")} function provides a simple wrapper around ${el("code", "document.createElement")}
			with enhanced property assignment.
		`),
		el(example, { src: fileURL("./components/examples/elements/dekaCreateElement.js") }),

		el(h3, t`Advanced Property Assignment`),
		el("p").append(T`
			The ${el("code", "assign")} function is the heart of dd<el>’s element property handling. It is internally
			used to assign properties using the ${el("code", "el")} function. ${el("code", "assign")} provides
			intelligent assignment of both ${el("a", { textContent: "properties (IDL)", ...references.mdn_idl })}
			and attributes:
		`),
		el("div", { className: "function-table" }).append(
			el("dl").append(
				el("dt", t`Property vs Attribute Priority`),
				el("dd", t`Prefers IDL properties, falls back to setAttribute() when no writable property exists`),

				el("dt", t`Data and ARIA Attributes`),
				el("dd").append(T`Both ${el("code", "dataset.keyName")} and ${el("code", "dataKeyName")} syntaxes are
					supported (same for ${el("code", "aria")}/${el("code", "ariaset")})`),

				el("dt", t`Style Handling`),
				el("dd").append(T`Accepts string or object notation for ${el("code", "style")} property`),

				el("dt", t`Class Management`),
				el("dd").append(T`Works with ${el("code", "className")} (${el("code", "class")}) and ${el("code",
					"classList")} object for toggling classes`),

				el("dt", t`Force Modes`),
				el("dd").append(T`Use ${el("code", "=")} prefix to force attribute mode, ${el("code", ".")} prefix to
					force property mode`),

				el("dt", t`Attribute Removal`),
				el("dd").append(T`Pass ${el("code", "undefined")} to remove a property or attribute`)
			)
		),
		el(example, { src: fileURL("./components/examples/elements/dekaAssign.js") }),

		el("div", { className: "note" }).append(
			el("p").append(T`
				You can explore standard HTML element properties in the MDN documentation for
				${el("a", { textContent: "HTMLElement", ...references.mdn_el })} (base class)
				and specific element interfaces like ${el("a", { textContent: "HTMLParagraphElement", ...references.mdn_p })}.
			`)
		),

		el(h3, t`Building DOM Trees with Chainable Methods`),
		el("p").append(T`
			One of the most powerful features of dd<el> is its approach to building element trees.
			Unlike the native DOM API which doesn’t return the parent after ${el("code", "append()")}, dd<el>’s
			${el("code", "append()")} always returns the parent element:
		`),
		el("div", { className: "illustration" }).append(
			el("div", { className: "comparison" }).append(
				el("div", { className: "bad-practice" }).append(
					el("h5", t`❌ Native DOM API`),
					el(code, { src: fileURL("./components/examples/elements/native-dom-tree.js") })
				),
				el("div", { className: "good-practice" }).append(
					el("h5", t`✅ dd<el> Approach`),
					el(code, { src: fileURL("./components/examples/elements/dde-dom-tree.js") })
				)
			)
		),
		el("p").append(T`
			This chainable pattern is much cleaner and easier to follow, especially for deeply nested elements.
			It also makes it simple to add multiple children to a parent element in a single fluent expression.
		`),
		el(example, { src: fileURL("./components/examples/elements/dekaAppend.js") }),

		el(h3, t`Using Components to Build UI Fragments`),
		el("p").append(T`
			The ${el("code", "el")} function is overloaded to support both tag names and function components.
			This lets you refactor complex UI trees into reusable pieces:
		`),
		el(example, { src: fileURL("./components/examples/elements/dekaBasicComponent.js") }),
		el("p").append(T`
			Component functions receive the properties object as their first argument, just like regular elements.
			This makes it easy to pass data down to components and create reusable UI fragments.
		`),
		el("div", { className: "tip" }).append(
			el("p").append(T`
				It’s helpful to use naming conventions similar to native DOM elements for your components.
				This allows you to keeps your code consistent with the DOM API.
			`),
			el("p").append(T`
				Use ${el("a", { textContent: "destructuring assignment", ...references.mdn_destruct })}
				to extract the properties from the ${el("code", "props")} and pass them to the component element:
				${el("code", "function component({ className }){ return el(\"p\", { className }); }")} for make
				templates cleaner.
			`),
		),

		el(h3, t`Working with SVG and Other Namespaces`),
		el("p").append(T`
			For non-HTML elements like SVG, MathML, or custom namespaces, dd<el> provides the ${el("code", "elNS")}
			function which corresponds to the native ${el("a", references.mdn_ns).append(el("code",
				"document.createElementNS"))}:
		`),
		el(example, { src: fileURL("./components/examples/elements/dekaElNS.js") }),
		el("p").append(T`
			This function returns a namespace-specific element creator, allowing you to work with any element type
			using the same consistent interface.
		`),

		el(h3, t`Best Practices for Declarative DOM Creation`),
		el("ol").append(
			el("li").append(T`
				${el("strong", "Use component functions for reusable UI fragments:")} Extract common UI patterns
				into reusable functions that return elements.
			`),
			el("li").append(T`
				${el("strong", "Leverage destructuring for cleaner component code:")} Use
				${el("a", { textContent: "destructuring", ...references.mdn_destruct })} to extract properties
				from the props object for cleaner component code.
			`),
			el("li").append(T`
				${el("strong", "Leverage chainable methods for better performance:")} Use chainable methods
				${el("code", ".append()")} to build complex DOM trees for better performance and cleaner code.
			`),
		),

		el(mnemonic),
	);
}
