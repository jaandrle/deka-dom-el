export const enviroment= {
	setDeleteAttr,
	ssr: "",
	D: globalThis.document,
	F: globalThis.DocumentFragment,
	H: globalThis.HTMLElement,
	S: globalThis.SVGElement,
	M: globalThis.MutationObserver,
	q: p=> p || Promise.resolve(),
};
import { isUndef } from './helpers.js';
function setDeleteAttr(obj, prop, val){
	/* Issue
		For some native attrs you can unset only to set empty string.
		This can be confusing as it is seen in inspector `<… id=""`.
		Options:
			1. Leave it, as it is native behaviour
			2. Sets as empty string and removes the corresponding attribute when also has empty string
			3. (*) Sets as undefined and removes the corresponding attribute when "undefined" string discovered
			4. Point 2. with checks for coincidence (e.g. use special string)
	*/
	Reflect.set(obj, prop, val);
	if(!isUndef(val)) return;
	Reflect.deleteProperty(obj, prop);
	if(obj instanceof enviroment.H && obj.getAttribute(prop)==="undefined")
		return obj.removeAttribute(prop);
	if(Reflect.get(obj, prop)==="undefined")
		return Reflect.set(obj, prop, "");
}
export const keyLTE= "__dde_lifecyclesToEvents"; //boolean
export const evc= "dde:connected";
export const evd= "dde:disconnected";
export const eva= "dde:attributeChanged";
