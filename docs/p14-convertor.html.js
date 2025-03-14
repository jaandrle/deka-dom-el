import "./components/converter.html.js";
import { T, t } from "./utils/index.js";
export const info= {
	title: t`Convert to dd<el>`,
	fullTitle: t`HTML to dd<el> Converter`,
	description: t`Convert your HTML markup to dd<el> JavaScript code with our interactive tool`,
};

import { el } from "deka-dom-el";
import { simplePage } from "./layout/simplePage.html.js";
import { h3 } from "./components/pageUtils.html.js";
import { code } from "./components/code.html.js";
import { converter } from "./components/converter.html.js";

/** @param {import("./types.d.ts").PageAttrs} attrs */
export function page({ pkg, info }){
	const page_id= info.id;
	return el(simplePage, { info, pkg }).append(
		el("p").append(T`
			Transitioning from HTML to dd<el> is simple with our interactive converter. This tool helps you quickly
			transform existing HTML markup into dd<el> JavaScript code, making it easier to adopt dd<el> in your projects.
		`),

		el("div", { className: "callout" }).append(
			el("h4", t`Features`),
			el("ul").append(
				el("li", t`Convert any HTML snippet to dd<el> code instantly`),
				el("li", t`Choose between different output formats (append vs arrays, style handling)`),
				el("li", t`Try pre-built examples or paste your own HTML`),
				el("li", t`Copy results to clipboard with one click`)
			)
		),

		el("h3", t`How to Use the Converter`),
		el("ol").append(
			el("li").append(T`
				${el("strong", "Paste your HTML")} into the input box or select one of the example templates
			`),
			el("li").append(T`
				${el("strong", "Configure options")} to match your preferred coding style:
				${el("ul").append(
					el("li", t`Convert inline styles to JavaScript objects`),
					el("li", t`Transform data-attributes/aria-attributes`),
				)}
			`),
			el("li").append(T`
				${el("strong", "Click convert")} to generate dd<el> code
			`),
			el("li").append(T`
				${el("strong", "Copy the result")} to your project
			`)
		),

		// The actual converter component
		el(converter, { page_id }),

		el("h3", t`How the Converter Works`),
		el("p").append(T`
			The converter uses a three-step process:
		`),
		el("ol").append(
			el("li").append(T`
				${el("strong", "Parsing:")} The HTML is parsed into a structured AST (Abstract Syntax Tree)
			`),
			el("li").append(T`
				${el("strong", "Transformation:")} Each HTML node is converted to its dd<el> equivalent
			`),
			el("li").append(T`
				${el("strong", "Code Generation:")} The final JavaScript code is properly formatted and indented
			`)
		),

		el("div", { className: "warning" }).append(
			el("p").append(T`
				While the converter handles most basic HTML patterns, complex attributes or specialized elements might
				need manual adjustments. Always review the generated code before using it in production.
			`)
		),

		el("h3", t`Next Steps`),
		el("p").append(T`
			After converting your HTML to dd<el>, you might want to:
		`),
		el("ul").append(
			el("li").append(T`
				Add signal bindings for dynamic content (see ${el("a", { href: "p04-signals.html",
					textContent: "Signals section" })})
			`),
			el("li").append(T`
				Organize your components with scopes (see ${el("a", { href: "p05-scopes.html",
					textContent: "Scopes section" })})
			`),
			el("li").append(T`
				Add event handlers for interactivity (see ${el("a", { href: "p03-events.html",
					textContent: "Events section" })})
			`)
		)
	);
}
