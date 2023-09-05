import { namespace, el, on, registerReactivity } from "../index.js";
import { S } from "../src/signals.js";
// import { empty, namespace, on, dispatch } from "../index.js";
// import "../dist/dde-with-signals.js";
// Object.assign(globalThis, dde);
// import { el, on, off, S } from "../dist/esm-with-signals.js";
const style= createStyle();
Object.assign(globalThis, { S, el, namespace, on, registerReactivity, style });
export { S, el, on, registerReactivity, style };

function createStyle(){
	const element= el("style");
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
