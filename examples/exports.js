import * as dde_dom from "../index.js";
export * from "../index.js";
import * as dde_s from "../signals.js";
export * from "../signals.js";
// import { empty, namespace, on, dispatch } from "../index.js";
// import "../dist/dde-with-signals.js";
// Object.assign(globalThis, dde);
// import { el, on, off, S } from "../dist/esm-with-signals.js";
export const style= createStyle();
Object.assign(globalThis, dde_dom, dde_s);

function createStyle(){
	const element= dde_dom.el("style");
	const store= new WeakSet();
	let host;
	return {
		element,
		host(k, h= k.name){
			if(store.has(k)) return { css: ()=> {} };
			store.add(k);
			host= h;
			return this;
		},
		css(...args){
			const textContent= String.raw(...args).replaceAll(":host", "."+host);
			const className= host;
			element.appendChild(el("#text", { textContent }));
			return className;
		}
	};
}
