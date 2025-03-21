import "./components/getLibraryUrl.html.js";
import { t, T } from "./utils/index.js";
export const info= {
	href: "./",
	title: t`Introduction`,
	fullTitle: t`Vanilla for flavouring — a full-fledged feast for large projects`,
	description: t`Reactive DOM library for creating dynamic UIs with a declarative syntax`,
};

import { el } from "deka-dom-el";
import { simplePage } from "./layout/simplePage.html.js";
import { h3 } from "./components/pageUtils.html.js";
import { example } from "./components/example.html.js";
import { code } from "./components/code.html.js";
import { getLibraryUrl } from "./components/getLibraryUrl.html.js";
/** @param {string} url */
const fileURL= url=> new URL(url, import.meta.url);
const references= {
	npm: {
		title: t`NPM package page for dd<el>`,
		href: "https://www.npmjs.com/package/deka-dom-el",
	},
	w_mvv: {
		title: t`Wikipedia: Model–view–viewmodel`,
		href: "https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93viewmodel",
	},
	w_mvc: {
		title: t`Wikipedia: Model–view–controller`,
		href: "https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller",
	},
};
/** @param {import("./types.d.ts").PageAttrs} attrs */
export function page({ pkg, info }){
	return el(simplePage, { info, pkg }).append(
		el("p").append(T`
			Welcome to Deka DOM Elements (dd<el> or DDE) — a library for building dynamic UIs with
			a declarative syntax that stays close to the native DOM API. dd<el> gives you powerful reactive tools
			without the complexity and overhead of larger frameworks.
		`),
		el("div", { className: "callout" }).append(
			el("h4", t`Key Benefits of dd<el>`),
			el("ul").append(
				el("li", t`No build step required — use directly in the browser`),
				el("li", t`Minimalized footprint:`),
				el("ul").append(
					el("li", t`lightweight core (~10–15kB minified)`),
					el("li", t`…without unnecessary dependencies (0 at now 😇)`),
					el("li", t`auto-releasing resources with focus on performance and development experience`),
				),
				el("li", t`Natural DOM API — work with real DOM nodes, not abstractions`),
				el("li", t`Built-in (but optional) reactivity with simplified but powerful signals system`),
				el("li", t`Clean code organization with the 3PS pattern`)
			)
		),
		el(example, { src: fileURL("./components/examples/introducing/helloWorld.js") }),

		el(h3, { textContent: t`The 3PS Pattern: Simplified architecture pattern`, id: "h-3ps" }),
		el("p").append(T`
			At the heart of dd<el> is the 3PS (3-Part Separation) pattern. This simple yet powerful approach helps you
			organize your UI code into three distinct areas, making your applications more maintainable and easier
			to reason about.
		`),
		el("div", { className: "illustration" }).append(
			el("div", { className: "tabs" }).append(
				el("div", { className: "tab" }).append(
					el("h5", t`Traditional DOM Manipulation`),
					el(code, { src: fileURL("./components/examples/introducing/3ps-before.js") }),
				),
				el("div", { className: "tab" }).append(
					el("h5", t`dd<el>'s 3PS Pattern`),
					el(code, { src: fileURL("./components/examples/introducing/3ps.js") }),
				)
			)
		),
		el("p").append(T`
			The 3PS pattern separates your code into three clear parts:
		`),
		el("ol").append(
			el("li").append(T`
				${el("strong", "Create State")}: Define your application’s reactive data using signals
			`),
			el("li").append(T`
				${el("strong", "React to Changes")}: Define how UI elements and other parts of your app react to state
				changes
			`),
			el("li").append(T`
				${el("strong", "Update State")}: Modify state in response to user events or other triggers
			`)
		),

		el("p").append(T`
			By separating these concerns, your code becomes more modular, testable, and easier to maintain. This
			approach ${el("strong", "is not something new and/or special to dd<el>")}. It’s based on ${el("a", {
				textContent: "MVC", ...references.w_mvc })} (${el("a", { textContent: "MVVM", ...references.w_mvv })}),
			but is there presented in simpler form.
		`),

		el("div", { className: "note" }).append(
			el("p").append(T`
				The 3PS pattern becomes especially powerful when combined with components, allowing you to create
				reusable pieces of UI with encapsulated state and behavior. You’ll learn more about this in the
				following sections.
			`),
			el("p").append(T`
				The 3PS pattern isn’t required to use with dd<el> but it is good practice to follow it or some similar
				software architecture.
			`)
		),

		el(h3, t`Getting Started`),
		el("p").append(T`
			There are multiple ways to include dd<el> in your project. You can use npm for a full development setup,
			or directly include it from a CDN for quick prototyping.
		`),
		el("h4", "npm installation"),
		el(code, { content: "npm install deka-dom-el --save", language: "shell" }),
		el("p").append(T`
			…see ${el("a", { textContent: "package page", ...references.npm, target: "_blank" })}.
		`),

		el("h4", "CDN / Direct Script Usage"),
		el("p").append(T`
			Use the interactive selector below to choose your preferred format:
		`),
		el(getLibraryUrl),
		el("div", { className: "note" }).append(
			el("p").append(T`
				Based on your selection, you can use dd<el> in your project like this:
			`),
			el(code, { content: `
				// ESM format (modern JavaScript with import/export)
				import { el, on } from "https://cdn.jsdelivr.net/gh/jaandrle/deka-dom-el/dist/esm-with-signals.min.js";

				// Or with IIFE format (creates a global DDE object)
				// <script src="https://cdn.jsdelivr.net/gh/jaandrle/deka-dom-el/dist/iife-with-signals.min.js"></script>
				const { el, on } = DDE;
			`, language: "js" }),
		),

		el(h3, t`How to Use This Documentation`),
		el("p").append(T`
			This guide will take you through dd<el>’s features step by step:
		`),
		el("ol", { start: 2 }).append(
			el("li").append(T`${el("a", { href: "p02-elements.html" }).append(el("strong", "Elements"))} — Creating
				and manipulating DOM elements`),
			el("li").append(T`${el("a", { href: "p03-events.html" }).append(el("strong", "Events and Addons"))} —
				Handling user interactions and lifecycle events`),
			el("li").append(T`${el("a", { href: "p04-signals.html" }).append(el("strong", "Signals"))} — Adding
				reactivity to your UI`),
			el("li").append(T`${el("a", { href: "p05-scopes.html" }).append(el("strong", "Scopes"))} — Managing
				component lifecycles`),
			el("li").append(T`${el("a", { href: "p06-customElement.html" }).append(el("strong", "Web Components"))} —
				Building native custom elements`),
			el("li").append(T`${el("a", { href: "p07-debugging.html" }).append(el("strong", "Debugging"))} — Tools to
				help you build and fix your apps`),
			el("li").append(T`${el("a", { href: "p08-extensions.html" }).append(el("strong", "Extensions"))} —
				Integrating third-party functionalities`),
			el("li").append(T`${el("a", { href: "p09-optimization.html" })
					.append(el("strong", "Performance Optimization"))} — Techniques for optimizing your applications`),
			el("li").append(T`${el("a", { href: "p10-todomvc.html" }).append(el("strong", "TodoMVC"))} — A real-world
				application implementation`),
			el("li").append(T`${el("a", { href: "p11-ssr.html" }).append(el("strong", "SSR"))} — Server-side
				rendering with dd<el>`),
			el("li").append(T`${el("a", { href: "p12-ireland.html" }).append(el("strong", "Ireland Components"))} —
				Interactive demos with server-side pre-rendering`),
			el("li").append(T`${el("a", { href: "p13-appendix.html" }).append(el("strong", "Appendix & Summary"))} —
				Comprehensive reference and best practices`),
			el("li").append(T`${el("a", { href: "p14-converter.html" }).append(el("strong", "HTML Converter"))} —
				Convert HTML to dd<el> JavaScript code`),
			el("li").append(T`${el("a", { href: "p15-examples.html" }).append(el("strong", "Examples Gallery"))} —
				Real-world application examples and case studies`),
		),
		el("p").append(T`
			Each section builds on the previous ones, so we recommend following them in order.
			Let’s get started with the basics of creating elements!
		`),
	);
}
