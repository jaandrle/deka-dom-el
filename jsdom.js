//TODO: https://www.npmjs.com/package/html-element
import { enviroment as env } from './src/dom-common.js';
env.ssr= " ssr";
const { setDeleteAttr }= env;
/** @param {HTMLElement} obj */
env.setDeleteAttr= function(obj, prop, value){
	if("value"===prop) return obj.setAttribute(prop, value);
	if("checked"!==prop) return setDeleteAttr(obj, prop, value);
	if(value) return obj.setAttribute(prop, "");
	obj.removeAttribute(prop);
};
const keys= { elH: "HTMLElement", elS: "SVGElement", elF: "DocumentFragment", Mut: "MutationObserver", doc: "document" };
let dom_last;

export function register(dom, keys_aditional= []){
	if(dom_last!==dom){
		keys.push(...keys_aditional);
		const w= dom.window;
		Object.entries(keys).forEach(([ kE, kW ])=> env[kE]= w[kW]);
		globalThis.window= w;
		w.console= globalThis.console;
	}
	dom_last= dom;

	return import("./index.js");
}
export function unregister(){
	if(!dom_last)
		return false;
	
	keys.forEach(key=> Reflect.deleteProperty(globalThis, key));
	Reflect.deleteProperty(globalThis, "window");
	dom_last= undefined;
	return true;
}
