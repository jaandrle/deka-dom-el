import { t, T } from "./utils/index.js";
export const info= {
	href: "./",
	title: t`Introduction`,
	fullTitle: t`Vanilla for flavouring — a full-fledged feast for large projects`,
	description: t`A lightweight, reactive DOM library for creating dynamic UIs with a declarative syntax`,
};

import { el } from "deka-dom-el";
import { simplePage } from "./layout/simplePage.html.js";
import { h3 } from "./components/pageUtils.html.js";
import { example } from "./components/example.html.js";
import { code } from "./components/code.html.js";
/** @param {string} url */
const fileURL= url=> new URL(url, import.meta.url);
const references= {
	w_mvv:{
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
	const page_id= info.id;
	return el(simplePage, { info, pkg }).append(
		el("p").append(...T`
			Welcome to Deka DOM Elements (DDE) — a lightweight library for building dynamic UIs with a declarative
			syntax that stays close to the native DOM API. DDE gives you powerful reactive tools without the complexity
			and overhead of larger frameworks.
		`),
		el("div", { className: "callout" }).append(
			el("h4", t`What Makes DDE Special`),
			el("ul").append(
				el("li", t`No build step required — use directly in the browser`),
				el("li", t`Lightweight core (~10–15kB minified) with zero dependencies`),
				el("li", t`Natural DOM API — work with real DOM nodes, not abstractions`),
				el("li", t`Built-in reactivity with powerful signals system`),
				el("li", t`Clean code organization with the 3PS pattern`)
			)
		),
		el(example, { src: fileURL("./components/examples/introducing/helloWorld.js"), page_id }),

		el(h3, { textContent: t`The 3PS Pattern: A Better Way to Build UIs`, id: "h-3ps" }),
		el("p").append(...T`
			At the heart of DDE is the 3PS (3-Part Separation) pattern. This simple yet powerful approach helps you
			organize your UI code into three distinct areas, making your applications more maintainable and easier
			to reason about.
		`),
		el("div", { className: "illustration" }).append(
			el("div", { className: "tabs" }).append(
				el("div", { className: "tab" }).append(
					el("h5", t`Traditional DOM Manipulation`),
					el(code, { src: fileURL("./components/examples/introducing/3ps-before.js"), page_id }),
				),
				el("div", { className: "tab" }).append(
					el("h5", t`DDE's 3PS Pattern`),
					el(code, { src: fileURL("./components/examples/introducing/3ps.js"), page_id }),
				)
			)
		),
		el("p").append(...T`
			The 3PS pattern separates your code into three clear parts:
		`),
		el("ol").append(
			el("li").append(...T`
				${el("strong", "Create State")}: Define your application's reactive data using signals
			`),
			el("li").append(...T`
				${el("strong", "Bind to Elements")}: Define how UI elements react to state changes
			`),
			el("li").append(...T`
				${el("strong", "Update State")}: Modify state in response to user events or other triggers
			`)
		),

		el("p").append(...T`
			By separating these concerns, your code becomes more modular, testable, and easier to maintain. This
			approach shares principles with more formal patterns like ${el("a", { textContent: "MVVM",
				...references.w_mvv })} and ${el("a", { textContent: "MVC", ...references.w_mvc })}, but with less
			overhead and complexity.
		`),

		el("div", { className: "note" }).append(
			el("p").append(...T`
				The 3PS pattern becomes especially powerful when combined with components, allowing you to create
				reusable pieces of UI with encapsulated state and behavior. You'll learn more about this in the
				following sections.
			`)
		),

		el(h3, t`How to Use This Documentation`),
		el("p").append(...T`
			This guide will take you through DDE's features step by step:
		`),
		el("ol").append(
			el("li").append(...T`${el("strong", "Elements")} — Creating and manipulating DOM elements`),
			el("li").append(...T`${el("strong", "Events")} — Handling user interactions and lifecycle events`),
			el("li").append(...T`${el("strong", "Signals")} — Adding reactivity to your UI`),
			el("li").append(...T`${el("strong", "Scopes")} — Managing component lifecycles`),
			el("li").append(...T`${el("strong", "Custom Elements")} — Building web components`),
			el("li").append(...T`${el("strong", "Debugging")} — Tools to help you build and fix your apps`),
			el("li").append(...T`${el("strong", "Extensions")} — Integrating third-party functionalities`),
			el("li").append(...T`${el("strong", "SSR")} — Server-side rendering with DDE`)
		),
		el("p").append(...T`
			Each section builds on the previous ones, so we recommend following them in order.
			Let's get started with the basics of creating elements!
		`),
	);
}