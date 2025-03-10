/**
 * Environment configuration and globals for the library
 * @typedef {Object} Environment
 * @property {typeof setDeleteAttr} setDeleteAttr - Function to safely set or delete attributes
 * @property {string} ssr - Server-side rendering flag
 * @property {Document} D - Document global
 * @property {typeof DocumentFragment} F - DocumentFragment constructor
 * @property {typeof HTMLElement} H - HTMLElement constructor
 * @property {typeof SVGElement} S - SVGElement constructor
 * @property {typeof MutationObserver} M - MutationObserver constructor
 * @property {Function} q - Promise wrapper for Promse queue feature
 */
export const enviroment= {
	setDeleteAttr,
	ssr: "",
	D: globalThis.document,
	N: globalThis.Node,
	F: globalThis.DocumentFragment,
	H: globalThis.HTMLElement,
	S: globalThis.SVGElement,
	M: globalThis.MutationObserver,
	q: p=> p || Promise.resolve(),
};
import { isInstance, isUndef } from './helpers.js';

/**
 * Handles attribute setting with special undefined handling
 *
 * @param {Object} obj - The object to set the property on
 * @param {string} prop - The property name
 * @param {any} val - The value to set
 * @returns {void}
 *
 * Issue:
 *   For some native attrs you can unset only to set empty string.
 *   This can be confusing as it is seen in inspector `<… id=""`.
 *   Options:
 *     1. Leave it, as it is native behaviour
 *     2. Sets as empty string and removes the corresponding attribute when also has empty string
 *     3. (*) Sets as undefined and removes the corresponding attribute when "undefined" string discovered
 *     4. Point 2. with checks for coincidence (e.g. use special string)
 */
function setDeleteAttr(obj, prop, val){
	Reflect.set(obj, prop, val);
	if(!isUndef(val)) return;
	Reflect.deleteProperty(obj, prop);
	if(isInstance(obj, enviroment.H) && obj.getAttribute(prop)==="undefined")
		return obj.removeAttribute(prop);
	if(Reflect.get(obj, prop)==="undefined")
		return Reflect.set(obj, prop, "");
}

/** Property key for tracking lifecycle events */
export const keyLTE= "__dde_lifecyclesToEvents"; //boolean

/** Event name for connected lifecycle event */
export const evc= "dde:connected";

/** Event name for disconnected lifecycle event */
export const evd= "dde:disconnected";

/** Event name for attribute changed lifecycle event */
export const eva= "dde:attributeChanged";
