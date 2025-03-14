import { styles } from "../ssr.js";
styles.css`
[data-dde-mark] {
	opacity: .5;
	filter: grayscale();

	@media (prefers-reduced-motion: no-preference) {
		animation: fadein 2s infinite ease forwards;;
	}

	position: relative;
	&::after {
		content: "Loading Ireland…";
		background-color: rgba(0, 0, 0, .5);
		color: white;
		font-weight: bold;
		border-radius: 5px;
		padding: 5px 10px;
		position: absolute;
		top: 3%;
		left: 50%;
		transform: translateX(-50%);
	}
}
@keyframes fadein {
	from { opacity: .5; }
	to { opacity: .85; }
}
`;

import { el, queue } from "deka-dom-el";
import { addEventListener, registerClientFile } from "../ssr.js";
import { relative } from "node:path";

const dir= new URL("./", import.meta.url).pathname;
const dirFE= "irelands";
// Track all component instances for client-side rehydration
const componentsRegistry = new Map();
/**
 * Creates a component that shows code and its runtime output
 * with server-side pre-rendering and client-side rehydration
 *
 * @param {object} attrs
 * @param {URL} attrs.src - Path to the file containing the component
 * @param {string} [attrs.exportName="default"] - Name of the export to use
 * @param {string} attrs.page_id - ID of the current page
 * @param {object} [attrs.props={}] - Props to pass to the component
 */
export function ireland({ src, exportName = "default", props = {} }) {
	// relative src against the current directory
	const path= "./"+relative(dir, src.pathname);
	const id = "ireland-" + generateComponentId(src);
	const element = el.mark({ type: "later", name: ireland.name });
	queue(
		import(path)
		.then(module => {
			const component = module[exportName];
			const content= el(component, props, mark(id));
			element.replaceWith(content);
			content.querySelectorAll("input, textarea, button")
				.forEach(el=> el.disabled= true);
		})
		.catch(console.error)
	);

	if(!componentsRegistry.size)
		addEventListener("oneachrender", registerClientPart);
	componentsRegistry.set(id, {
		src,
		path: dirFE+"/"+path.split("/").pop(),
		exportName,
		props,
	});

	return element;
}

function registerClientPart(){
	const todo= Array.from(componentsRegistry.entries())
		.map(([ id, d ]) => {
			registerClientFile(d.src, {
				folder: dirFE,
				// not all browsers support importmap
				replacer(file){
					return file
						.replaceAll(/ from "deka-dom-el(\/signals)?";/g, ` from "./esm-with-signals.js";`);
				}
			});
			return [ id, d ];
		});
	const store = JSON.stringify(JSON.stringify(todo));
	registerClientFile(new URL("./ireland.js.js", import.meta.url));
	registerClientFile(new URL("../../dist/esm-with-signals.js", import.meta.url), { folder: dirFE });
	document.head.append(
		// not all browsers support importmap
		el("script", { type: "importmap" }).append(`
{
	"imports": {
		"deka-dom-el": "./${dirFE}/esm-with-signals.js",
		"deka-dom-el/signals": "./${dirFE}/esm-with-signals.js"
	}
}
		`.trim())
	);
	document.body.append(
		el("script", { type: "module" }).append(`
import { loadIrelands } from "./ireland.js.js";
loadIrelands(new Map(JSON.parse(${store})));
		`.trim())
	)
}
function mark(id) { return el=> el.dataset.ddeMark= id; }
const store_prev= new Map();
/** @param {URL} src */
function generateComponentId(src){
	const candidate= parseInt(relative((new URL("..", import.meta.url)).pathname, src.pathname)
		.split("")
		.map(ch=> ch.charCodeAt(0))
		.join(""), 10)
		.toString(36)
		.replace(/000+/g, "");
	const count= 1 + ( store_prev.get(candidate) || 0 );
	store_prev.set(candidate, count);
	return count.toString()+"-"+candidate;
}
