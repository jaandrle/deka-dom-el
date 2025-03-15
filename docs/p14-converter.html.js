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
import { converter } from "./components/converter.html.js";

/** @param {import("./types.d.ts").PageAttrs} attrs */
export function page({ pkg, info }){
	const page_id= info.id;
	return el(simplePage, { info, pkg }).append(
		el("p").append(T`
			Transitioning from HTML to dd<el> is simple with our interactive converter. This tool helps you quickly
			transform existing HTML markup into dd<el> JavaScript code, making it easier to adopt dd<el> in your projects.
		`),

		el("div", { className: "warning" }).append(
			el("p").append(T`
				While the converter handles most basic HTML patterns, complex attributes or specialized elements might
				need manual adjustments. Always review the generated code before using it in production.
			`)
		),

		// The actual converter component
		el(converter, { page_id }),

		el(h3, t`Next Steps`),
		el("p").append(T`
			After converting your HTML to dd<el>, you might want to:
		`),
		el("ul").append(
			el("li").append(T`
				Add signal bindings for dynamic content (see ${el("a", { href: "p04-signals.html",
					textContent: "Signals section" })})
			`),
			el("li").append(T`
				Add event handlers for interactivity (see ${el("a", { href: "p03-events.html",
					textContent: "Events section" })})
			`),
			el("li").append(T`
				Organize your components with components (see ${el("a", { href:
					"p02-elements.html#h-using-components-to-build-ui-fragments", textContent: "Components section" })}
					and ${el("a", { href: "p05-scopes.html", textContent: "Scopes section" })})
			`),
		)
	);
}
