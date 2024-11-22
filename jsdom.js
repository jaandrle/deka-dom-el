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
const keys= { H: "HTMLElement", S: "SVGElement", F: "DocumentFragment", M: "MutationObserver", D: "document" };
let env_bk= {};
let dom_last;

export function register(dom){
	if(dom_last!==dom){
		const w= dom.window;
		Object.entries(keys).forEach(([ kE, kW ])=> {
			env_bk[kE]= env[kE];
			env[kE]= w[kW];
		});
		w.console= globalThis.console;
	}
	dom_last= dom;

	return import("./index.js");
}
export function unregister(){
	if(!dom_last)
		return false;

	Object.assign(env, env_bk);
	env_bk= {};
	dom_last= undefined;
	return true;
}
