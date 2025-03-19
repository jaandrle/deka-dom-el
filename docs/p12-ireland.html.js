import { T, t } from "./utils/index.js";
export const info= {
	title: t`Ireland Components`,
	fullTitle: t`Server-Side Pre-Rendering and Client-Side Rehydration`,
	description: t`Using Ireland components for server-side pre-rendering and client-side rehydration`,
};

import { el } from "deka-dom-el";
import { simplePage } from "./layout/simplePage.html.js";
import { h3 } from "./components/pageUtils.html.js";
import { code } from "./components/code.html.js";
import { ireland } from "./components/ireland.html.js";
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

		el(h3, t`What Are Ireland Components?`),
		el("p").append(T`
			Ireland components are a special type of component that:
		`),
		el("ul").append(
			el("li", t`Pre-render components on the server during SSR build`),
			el("li", t`Provide client-side rehydration for the component`),
		),

		el(h3, t`How Ireland Components Work`),
		el("p").append(T`
			The Ireland component system consists of several parts working together:
		`),

		el("ol").append(
			el("li").append(T`
				${el("strong", "Server-side rendering:")} Components are pre-rendered during the documentation build process
			`),
			el("li").append(T`
				${el("strong", "Component registration:")} Source files are copied to the documentation output directory
			`),
			el("li").append(T`
				${el("strong", "Client-side scripting:")} JavaScript code is generated to load and render components
			`),
		),

		el(h3, t`Implementation Architecture`),
		el("p").append(T`
			The core of the Ireland system is implemented in ${el("code", "docs/components/ireland.html.js")}.
			It integrates with the SSR build process using the ${el("code", "registerClientFile")} function
			from ${el("code", "docs/ssr.js")}.
		`),

		el(code, { content: `
			// Basic usage of an ireland component
			el(ireland, {
				src: fileURL("./components/examples/path/to/component.js"),
				exportName: "NamedExport", // optional, defaults to "default",
			})
		`, language: "js" }),

		el("p").append(T`
			During the build process (${el("code", "bs/docs.js")}), the following happens:
		`),

		el("ol").append(
			el("li", t`Component source code is loaded and displayed with syntax highlighting`),
			el("li", t`Source files are registered to be copied to the output directory`),
			el("li", t`Client-side scripts are generated for each page with ireland components`),
			el("li", t`The component is rerendered on the page ready`),
		),

		el(h3, t`Core Implementation Details`),
		el("p").append(T`
			Let's look at the key parts of the ireland component implementation:
		`),

		el("h4", t`Building SSR`),
		el(code, { content: `
			// From bs/docs.js - Server-side rendering engine
			import { createHTMl } from "./docs/jsdom.js";
			import { register, queue } from "../jsdom.js";
			import { path_target, dispatchEvent } from "../docs/ssr.js";

			// For each page, render it on the server
			for(const { id, info } of pages) {
				// Create a virtual DOM environment for server-side rendering
				const serverDOM = createHTMl("");
				serverDOM.registerGlobally("HTMLScriptElement");

				// Register dd<el> with the virtual DOM
				const { el } = await register(serverDOM.dom);

				// Import and render the page component
				const { page } = await import(\`../docs/\${id}.html.js\`);
				serverDOM.document.body.append(
					el(page, { pkg, info }),
				);

				// Process the queue of asynchronous operations
				await queue();

				// Trigger render event handlers
				dispatchEvent("oneachrender", document);

				// Write the HTML to the output file
				s.echo(serverDOM.serialize()).to(path_target.root+id+".html");
			}

			// Final build step - trigger SSR end event
			dispatchEvent("onssrend");
		`, language: "js" }),
		el("h4", t`File Registration`),
		el(code, { content: `
			// From docs/ssr.js - File registration system
			export function registerClientFile(url, { head, folder = "", replacer } = {}) {
				// Ensure folder path ends with a slash
				if(folder && !folder.endsWith("/")) folder += "/";

				// Extract filename from URL
				const file_name = url.pathname.split("/").pop();

				// Create target directory if needed
				s.mkdir("-p", path_target.root+folder);

				// Get file content and apply optional replacer function
				let content = s.cat(url);
				if(replacer) content = s.echo(replacer(content.toString()));

				// Write content to the output directory
				content.to(path_target.root+folder+file_name);

				// If a head element was provided, add it to the document
				if(!head) return;
				head[head instanceof HTMLScriptElement ? "src" : "href"] = file_name;
				document.head.append(head);
			}
		`, language: "js" }),
		el("h4", t`Server-Side Rendering`),
		el(code, { content: `
			// From docs/components/ireland.html.js - Server-side component implementation
			export function ireland({ src, exportName = "default", props = {} }) {
				// Calculate relative path for imports
				const path = "./"+relative(dir, src.pathname);

				// Generate unique ID for this component instance
				const id = "ireland-" + generateComponentId(src);

				// Create placeholder element
				const element = el.mark({ type: "later", name: ireland.name });

				// Import and render the component during SSR
				queue(import(path).then(module => {
				const component = module[exportName];
				element.replaceWith(el(component, props, mark(id)));
				}));

				// Register client-side hydration on first component
				if(!componentsRegistry.size)
				addEventListener("oneachrender", registerClientPart);

				// Store component info for client-side hydration
				componentsRegistry.set(id, {
					src,
					path: dirFE+"/"+path.split("/").pop(),
					exportName,
					props,
				});

				return element;
			}

			// Register client-side resources
			function registerClientPart() {
				// Process all component registrations
				const todo = Array.from(componentsRegistry.entries())
				.map(([ id, d ]) => {
					// Copy the component source file to output directory
					registerClientFile(d.src, {
					folder: dirFE,
					// Replace bare imports for browser compatibility
					replacer(file) {
						return file.replaceAll(
							/ from "deka-dom-el(\/signals)?";/g,
							\` from "./esm-with-signals.js";\`
						);
					}
				});
					return [ id, d ];
				});

				// Serialize the component registry for client-side use
				const store = JSON.stringify(JSON.stringify(todo));

				// Copy client-side scripts to output
				registerClientFile(new URL("./ireland.js.js", import.meta.url));
				registerClientFile(new URL("../../dist/esm-with-signals.js", import.meta.url), { folder: dirFE });

				// Add import map for package resolution
				document.head.append(
					el("script", { type: "importmap" }).append(\`
						{
							"imports": {
							"deka-dom-el": "./\${dirFE}/esm-with-signals.js",
							"deka-dom-el/signals": "./\${dirFE}/esm-with-signals.js"
							}
						}
					\`.trim())
				);

				// Add bootstrap script to load components
				document.body.append(
					el("script", { type: "module" }).append(\`
						import { loadIrelands } from "./ireland.js.js";
						loadIrelands(new Map(JSON.parse(\${store})));
					\`.trim())
				);
			}
		`, language: "js" }),
		el("h4", t`Client-Side Hydration`),
		el(code, { content: `
			// From docs/components/ireland.js.js - Client-side hydration
			import { el } from "./irelands/esm-with-signals.js";

			export function loadIrelands(store) {
				// Find all marked components in the DOM
				document.body.querySelectorAll("[data-dde-mark]").forEach(ireland => {
				const { ddeMark } = ireland.dataset;

				// Skip if this component isn’t in our registry
				if(!store.has(ddeMark)) return;

				// Get component information
				const { path, exportName, props } = store.get(ddeMark);

				// Dynamically import the component module
				import("./" + path).then(module => {
					// Replace the server-rendered element with the client-side version
					ireland.replaceWith(el(module[exportName], props));
				});
				});
			}
		`, language: "js" }),

		el(h3, t`Live Example`),
			el("p").append(T`
				Here’s a live example of an Ireland component showing a standard counter.
				The component is defined in ${el("code", "docs/components/examples/ireland-test/counter.js")} and
				rendered with the Ireland component system:
			`),

			el(code, { src: fileURL("./components/examples/ireland-test/counter.js") }),
			el(ireland, {
				src: fileURL("./components/examples/ireland-test/counter.js"),
				exportName: "CounterStandard",
			}),

			el("p").append(T`
				When the page is loaded, the component is also loaded and rendered. The counter state is maintained
				using signals, allowing for reactive updates as you click the buttons to increment and decrement the
				value.
			`),

		el(h3, t`Practical Considerations and Limitations`),
			el("p").append(T`
				When implementing Ireland components in real documentation, there are several important
				considerations to keep in mind:
			`),

			el("div", { className: "warning" }).append(
				el("h4", t`Module Resolution and Bundling`),
				el("p").append(T`
					The examples shown here use bare module specifiers like ${el("code",
						`import { el } from "deka-dom-el"`)} which aren’t supported in all browsers without importmaps.
					In a production implementation, you would need to: `),
				el("ol").append(
					el("li", t`Replace bare import paths with actual paths during the build process`),
					el("li", t`Bundle component dependencies to avoid multiple requests`),
					el("li", t`Ensure all module dependencies are properly resolved and copied to the output directory`)
				),
				el("p").append(T`
					In this documentation, we replace the paths with ${el("code", "./esm-with-signals.js")} and provide
					a bundled version of the library, but more complex components might require a dedicated bundling step.
				`)
			),

			el("div", { className: "note" }).append(
				el("h4", t`Component Dependencies`),
				el("p").append(T`
					Real-world components typically depend on multiple modules and assets. The Ireland system would need
					to be extended to:
				`),
				el("ul").append(
					el("li", t`Detect and analyze all dependencies of a component`),
					el("li", t`Bundle these dependencies together or ensure they're properly copied to the output directory`),
					el("li", t`Handle non-JavaScript assets like CSS, images, or data files`)
				)
			),

			el(h3, t`Advanced Usage`),
			el("p").append(T`
				The Ireland system can be extended in several ways to address these limitations:
			`),

			el("ul").append(
				el("li", t`Integrate with a bundler like esbuild, Rollup, or Webpack`),
				el("li", t`Add props support for configuring components at runtime`),
				el("li", t`Implement module caching to reduce network requests`),
				el("li", t`Add code editing capabilities for interactive experimentation`),
				el("li", t`Support TypeScript and other languages through transpilation`),
				el("li", t`Implement state persistence between runs`)
			),

			el("p").append(T`
				This documentation site itself is built using the techniques described here,
				showcasing how dd<el> can be used to create both the documentation and
				the interactive examples within it. The implementation here is simplified for clarity,
				while a production-ready system would need to address the considerations above.
			`)
	);
}
