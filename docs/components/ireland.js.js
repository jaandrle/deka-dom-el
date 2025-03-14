// not all browsers support importmaps
// import { el } from "deka-dom-el";
import { el } from "./irelands/esm-with-signals.js";
export function loadIrelands(store) {
	document.body.querySelectorAll("[data-dde-mark]").forEach(ireland => {
		const { ddeMark }= ireland.dataset;
		if(!store.has(ddeMark)) return;
		ireland.querySelectorAll("input").forEach(input => input.disabled = true);
		const { path, exportName, props }= store.get(ddeMark);
		import("./"+path).then(module => {
			ireland.replaceWith(el(module[exportName], props));
		})
	});
}
