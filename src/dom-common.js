/** @type {Map<string, boolean>} */
export const prop_cache= new Map(JSON.parse('[["#text,textContent",true],["HTMLElement,textContent",true],["HTMLElement,className",true]]'));
export const prop_process= { setDeleteAttr };
import { isUndef } from './helpers.js';
function setDeleteAttr(obj, prop, val){
	/* Issue
		For some native attrs you can unset only to set empty string.
		This can be confusing as it is seen in inspector `<… id=""`.
		Options:
		 1. Leave it, as it is native behaviour
		 2. Sets as empty string and removes the corresponding attribute when also has empty string
		*3. Sets as undefined and removes the corresponding attribute when "undefined" string discovered
		 4. Point 2. with checks for coincidence (e.g. use special string)
		*/
	Reflect.set(obj, prop, val);
	if(isUndef(val) && obj.getAttribute(prop)==="undefined")
		obj.removeAttribute(prop);
}
