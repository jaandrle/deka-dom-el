import { prop_process } from './dom-common.js';
const { setDelete }= prop_process;
/** @param {HTMLElement} obj */
prop_process.setDelete= function(obj, prop, value){
	if("checked"!==prop) return setDelete(obj, prop, value);
	if(value) return obj.setAttribute("checked", "");
	obj.removeAttribute("checked");
};
const keys= [ "HTMLElement", "SVGElement", "DocumentFragment", "MutationObserver", "document" ];
let dom_last;
export let el;
export let assign;
export let on;
export async function register(dom, keys_aditional= []){
	if(dom_last===dom)
		return import("../index.js");

	keys.push(...keys_aditional);
	const w= dom.window;
	keys.forEach(key=> globalThis[key]= w[key]);
	globalThis.window= w;
	w.console= globalThis.console;

	const m= await import("../index.js");
	el= m.el;
	assign= m.assign;
	on= m.on;
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
