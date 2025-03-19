import { T, t } from "./utils/index.js";
export const info= {
	title: t`Server-Side Rendering (SSR)`,
	fullTitle: t`Server-Side Rendering with dd<el>`,
	description: t`Using dd<el> for server-side rendering with jsdom to generate static HTML.`,
};

import { el } from "deka-dom-el";
import { simplePage } from "./layout/simplePage.html.js";
import { h3 } from "./components/pageUtils.html.js";
import { code } from "./components/code.html.js";
/** @param {string} url */
const fileURL= url=> new URL(url, import.meta.url);

/** @param {import("./types.js").PageAttrs} attrs */
export function page({ pkg, info }){
	return el(simplePage, { info, pkg }).append(
		el("div", { className: "warning" }).append(
			el("p").append(T`
				This part of the documentation is primarily intended for technical enthusiasts and authors of
				3rd-party libraries. It describes an advanced feature, not a core part of the library. Most users will
				not need to implement this functionality directly in their applications. This capability will hopefully
				be covered by third-party libraries or frameworks that provide simpler SSR integration using
				dd<el>.
			`)
		),
		el("p").append(T`
			dd<el> isn’t limited to browser environments. Thanks to its flexible architecture,
			it can be used for server-side rendering (SSR) to generate static HTML files.
			This is achieved through integration with for example ${el("a", { href: "https://github.com/tmpvar/jsdom",
			textContent: "jsdom" })}, a JavaScript implementation of web standards for Node.js.
		`),
		el("p").append(T`
			Additionally, you might consider using these alternative solutions:
		`),
		el("ul").append(
			el("li").append(T`
				${el("a", { href: "https://github.com/capricorn86/happy-dom", textContent: "happy-dom" })} —
				A JavaScript implementation of a web browser without its graphical user interface that’s faster than jsdom
			`),
			el("li").append(T`
				${el("a", { href: "https://github.com/WebReflection/linkedom", textContent: "linkedom" })} —
				A lightweight DOM implementation specifically designed for SSR with significantly better performance
				than jsdom
			`),
		),
		el(code, { src: fileURL("./components/examples/ssr/intro.js") }),

		el(h3, t`Why Server-Side Rendering?`),
		el("p").append(T`
			SSR offers several benefits:
		`),
		el("ul").append(
			el("li", t`Improved SEO — Search engines can easily index fully rendered content`),
			el("li", t`Faster initial page load — Users see content immediately without waiting for JavaScript to load`),
			el("li", t`Better performance on low-powered devices — Less JavaScript processing on the client`),
			el("li", t`Content available without JavaScript — Useful for users who have disabled JavaScript`),
			el("li", t`Static site generation — Build files once, serve them many times`)
		),

		el(h3, t`How jsdom Integration Works`),
		el("p").append(T`
			The jsdom export in dd<el> provides the necessary tools to use the library in Node.js
			by integrating with jsdom. Here’s what it does:
		`),
		el("ol").append(
			el("li", t`Creates a virtual DOM environment in Node.js using jsdom`),
			el("li", t`Registers DOM globals like HTMLElement, document, etc. for dd<el> to use`),
			el("li", t`Sets an SSR flag in the environment to enable SSR-specific behaviors`),
			el("li", t`Provides a promise queue system for managing async operations during rendering`),
			el("li", t`Handles DOM property/attribute mapping differences between browsers and jsdom`)
		),
		el(code, { src: fileURL("./components/examples/ssr/start.js") }),

		el(h3, t`Basic SSR Example`),
		el("p").append(T`
			Here’s a simple example of how to use dd<el> for server-side rendering in a Node.js script:
		`),
		el(code, { src: fileURL("./components/examples/ssr/basic-example.js") }),

		el(h3, t`Building a Static Site Generator`),
		el("p").append(T`
			You can build a complete static site generator with dd<el>. In fact, this documentation site
			is built using dd<el> for server-side rendering! Here’s how the documentation build process works:
		`),
		el(code, { src: fileURL("./components/examples/ssr/static-site-generator.js") }),

		el(h3, t`Working with Async Content in SSR`),
		el("p").append(T`
			The jsdom export includes a queue system to handle asynchronous operations during rendering.
			This is crucial for components that fetch data or perform other async tasks.
		`),
		el(code, { src: fileURL("./components/examples/ssr/async-data.js") }),

		el(h3, t`Working with Dynamic Imports for SSR`),
		el("p").append(T`
			When structuring server-side rendering code, a crucial pattern to follow is using dynamic imports
			for both the deka-dom-el/jsdom module and your page components.
		`),
		el("p").append(T`
			Why is this important?
		`),
		el("ul").append(
			el("li").append(T`
				${el("strong", "Static imports are hoisted:")} JavaScript hoists import statements to the top of the file,
				executing them before any other code
			`),
			el("li").append(T`
				${el("strong", "Environment registration timing:")} The jsdom module auto-registers the DOM environment
				when imported, which must happen ${el("em", "after")} you’ve created your JSDOM instance and
				${el("em", "before")} you import your components using ${el("code", "import { el } from \"deka-dom-el\";")}.
			`),
			el("li").append(T`
				${el("strong", "Correct initialization order:")} You need to control the exact sequence of:
				create JSDOM → register environment → import components
			`)
		),
		el("p").append(T`
			Follow this pattern when creating server-side rendered pages:
		`),
		el(code, { src: fileURL("./components/examples/ssr/pages.js") }),

		el(h3, t`SSR Considerations and Limitations`),
		el("p").append(T`
			When using dd<el> for SSR, keep these considerations in mind:
		`),
		el("ul").append(
			el("li", t`Browser-specific APIs like window.localStorage are not available in jsdom by default`),
			el("li", t`Event listeners added during SSR won’t be functional in the final HTML unless hydrated on the client`),
			el("li", t`Some DOM features may behave differently in jsdom compared to real browsers`),
			el("li", t`For large sites, you may need to optimize memory usage by creating a new jsdom instance for each page`)
		),
		el("p").append(T`
			For advanced SSR applications, consider implementing hydration on the client-side to restore
			interactivity after the initial render.
		`),

		el(h3, t`Real Example: How This Documentation is Built`),
		el("p").append(T`
			This documentation site itself is built using dd<el>’s SSR capabilities.
			The build process collects all page components, renders them with jsdom, and outputs static HTML files.
		`),
		el(code, { src: fileURL("./components/examples/ssr/static-site-generator.js") }),

		el("p").append(T`
			The resulting static files can be deployed to any static hosting service,
			providing fast loading times and excellent SEO without the need for client-side JavaScript
			to render the initial content.
		`),
	);
}
