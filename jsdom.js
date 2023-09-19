//TODO: https://www.npmjs.com/package/html-element
import { prop_process } from './src/dom-common.js';
const { setDeleteAttr }= prop_process;
/** @param {HTMLElement} obj */
prop_process.setDeleteAttr= function(obj, prop, value){
	if("value"===prop) return obj.setAttribute(prop, value);
	if("checked"!==prop) return setDeleteAttr(obj, prop, value);
	if(value) return obj.setAttribute(prop, "");
	obj.removeAttribute(prop);
};
const keys= [ "HTMLElement", "SVGElement", "DocumentFragment", "MutationObserver", "document" ];
let dom_last;

export let namespace;
export let createElement;
export let el;
export let assign;
export let classListDeclarative;
export let empty;
export let on;
export let dispatchEvent;

export async function register(dom, keys_aditional= []){
	if(dom_last===dom)
		return import("./index.js");

	keys.push(...keys_aditional);
	const w= dom.window;
	keys.forEach(key=> globalThis[key]= w[key]);
	globalThis.window= w;
	w.console= globalThis.console;

	const m= await import("./index.js");
	namespace= m.namespace;
	createElement= m.createElement;
	el= m.el;
	assign= m.assign;
	classListDeclarative= m.classListDeclarative;
	empty= m.empty;
	on= m.on;
	dispatchEvent= m.dispatchEvent;
	return m;
}
export function unregister(){
	if(!dom_last)
		return false;
	
	keys.forEach(key=> Reflect.deleteProperty(globalThis, key));
	Reflect.deleteProperty(globalThis, "window");
	dom_last= undefined;
	return true;
}
