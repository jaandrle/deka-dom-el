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
	const page_id= info.id;
	return el(simplePage, { info, pkg }).append(
		el("p").append(...T`
			Building user interfaces in JavaScript often involves creating and manipulating DOM elements.
			DDE provides a simple yet powerful approach to element creation that is declarative, chainable,
			and maintains a clean syntax close to HTML structure.
		`),
		el("div", { class: "callout" }).append(
			el("h4", t`DDE Elements: Key Benefits`),
			el("ul").append(
				el("li", t`Declarative element creation with intuitive property assignment`),
				el("li", t`Chainable methods for natural DOM tree construction`),
				el("li", t`Simplified component patterns for code reuse`),
				el("li", t`Normalized property/attribute handling across browsers`),
				el("li", t`Smart element return values for cleaner code flow`)
			)
		),

		el(code, { src: fileURL("./components/examples/elements/intro.js"), page_id }),

		el(h3, t`Creating Elements: Native vs DDE`),
		el("p").append(...T`
			In standard JavaScript, you create DOM elements using the
			${el("a", references.mdn_create).append(el("code", "document.createElement()"))} method
			and then set properties individually or with Object.assign():
		`),
		el("div", { class: "illustration" }).append(
			el("div", { class: "comparison" }).append(
				el("div").append(
					el("h5", t`Native DOM API`),
					el(code, { content: `// Create element with properties
const button = document.createElement('button');
button.textContent = "Click me";
button.className = "primary";
button.disabled = true;

// Or using Object.assign()
const button = Object.assign(
  document.createElement('button'),
  {
    textContent: "Click me",
    className: "primary",
    disabled: true
  }
);`, page_id })
				),
				el("div").append(
					el("h5", t`DDE Approach`),
					el(code, { content: `// Create element with properties
const button = el("button", {
  textContent: "Click me",
  className: "primary",
  disabled: true
});

// Shorter and more expressive
// than the native approach`, page_id })
				)
			)
		),
		el(example, { src: fileURL("./components/examples/elements/dekaCreateElement.js"), page_id }),
		el("p").append(...T`
			The ${el("code", "el")} function provides a simple wrapper around ${el("code", "document.createElement")}
			with enhanced property assignment.
		`),

		el(h3, t`Advanced Property Assignment`),
		el("p").append(...T`
			The ${el("code", "assign")} function is the heart of DDE's element property handling. It provides
			intelligent assignment of both properties (IDL) and attributes:
		`),
		el("div", { class: "function-table" }).append(
			el("dl").append(
				el("dt", t`Property vs Attribute Priority`),
				el("dd", t`Prefers IDL properties, falls back to setAttribute() when no writable property exists`),

				el("dt", t`Data and ARIA Attributes`),
				el("dd", t`Both dataset.* and data-* syntaxes supported (same for ARIA)`),

				el("dt", t`Style Handling`),
				el("dd", t`Accepts string or object notation for style property`),

				el("dt", t`Class Management`),
				el("dd", t`Works with className, class, or classList object for toggling classes`),

				el("dt", t`Force Modes`),
				el("dd", t`Use = prefix to force attribute mode, . prefix to force property mode`),

				el("dt", t`Attribute Removal`),
				el("dd", t`Pass undefined to remove a property or attribute`)
			)
		),
		el(example, { src: fileURL("./components/examples/elements/dekaAssign.js"), page_id }),

		el("div", { class: "note" }).append(
			el("p").append(...T`
				You can explore standard HTML element properties in the MDN documentation for
				${el("a", { textContent: "HTMLElement", ...references.mdn_el })} (base class)
				and specific element interfaces like ${el("a", { textContent: "HTMLParagraphElement", ...references.mdn_p })}.
			`)
		),

		el(h3, t`Building DOM Trees with Chainable Methods`),
		el("p").append(...T`
			One of the most powerful features of DDE is its approach to building element trees.
			Unlike the native DOM API which doesn't return the parent after appendChild(), DDE's
			append() always returns the parent element:
		`),
		el("div", { class: "illustration" }).append(
			el("div", { class: "comparison" }).append(
				el("div", { class: "bad-practice" }).append(
					el("h5", t`❌ Native DOM API`),
					el(code, { content: `// Verbose, needs temp variables
const div = document.createElement('div');
const h1 = document.createElement('h1');
h1.textContent = 'Title';
div.appendChild(h1);

const p = document.createElement('p');
p.textContent = 'Paragraph';
div.appendChild(p);

// appendChild doesn't return parent
// so chaining is not possible`, page_id })
				),
				el("div", { class: "good-practice" }).append(
					el("h5", t`✅ DDE Approach`),
					el(code, { content: `// Chainable, natural nesting
const div = el("div").append(
  el("h1", "Title"),
  el("p", "Paragraph")
);

// append() returns parent element
// making chains easy and intuitive`, page_id })
				)
			)
		),
		el(example, { src: fileURL("./components/examples/elements/dekaAppend.js"), page_id }),
		el("p").append(...T`
			This chainable approach results in code that more closely mirrors the structure of your HTML,
			making it easier to understand and maintain.
		`),

		el(h3, t`Building Reusable Components`),
		el("p").append(...T`
			DDE makes it simple to create reusable element components through regular JavaScript functions.
			The ${el("code", "el()")} function accepts a component function as its first argument:
		`),
		el(example, { src: fileURL("./components/examples/elements/dekaBasicComponent.js"), page_id }),
		el("p").append(...T`
			Component functions receive props as their argument and return element(s). This pattern
			encourages code reuse and better organization of your UI code.
		`),
		el("div", { class: "tip" }).append(
			el("p").append(...T`
				It's helpful to use naming conventions similar to native DOM elements for your components.
				This allows you to use ${el("a", { textContent: "destructuring assignment", ...references.mdn_destruct })}
				and keeps your code consistent with the DOM API.
			`)
		),

		el(h3, t`Working with SVG and Other Namespaces`),
		el("p").append(...T`
			For non-HTML elements like SVG, MathML, or custom namespaces, DDE provides the ${el("code", "elNS")} function
			which corresponds to the native ${el("a", references.mdn_ns).append(el("code", "document.createElementNS"))}:
		`),
		el(example, { src: fileURL("./components/examples/elements/dekaElNS.js"), page_id }),
		el("p").append(...T`
			This function returns a namespace-specific element creator, allowing you to work with any element type
			using the same consistent interface.
		`),

		el(h3, t`Best Practices`),
		el("ol").append(
			el("li").append(...T`
				${el("strong", "Prefer composition over complexity")}: Create small component functions that can be
				combined rather than large, complex templates
			`),
			el("li").append(...T`
				${el("strong", "Use meaningful component names")}: Name your component functions after the elements or
				patterns they create
			`),
			el("li").append(...T`
				${el("strong", "Destructure for better readability")}: Use ${el("code", "const { div, p, button } = el")}
				to create element-specific functions
			`),
			el("li").append(...T`
				${el("strong", "Be consistent with property usage")}: Prefer using the same pattern (property vs attribute)
				throughout your code
			`)
		),

		el("div", { class: "troubleshooting" }).append(
			el("h4", t`Common Element Creation Pitfalls`),
			el("dl").append(
				el("dt", t`Elements not showing up in DOM`),
				el("dd", t`Remember to append elements to the document or a parent that's already in the document`),

				el("dt", t`Properties not being applied correctly`),
				el("dd", t`Check if you're mixing up property (IDL) names with attribute names (e.g., className vs class)`),

				el("dt", t`Event listeners not working`),
				el("dd", t`Ensure you're using the correct event binding approach (see Events section)`),

				el("dt", t`SVG elements not rendering correctly`),
				el("dd", t`Make sure you're using elNS with the correct SVG namespace for SVG elements`)
			)
		),

		el(mnemonic)
	);
}
