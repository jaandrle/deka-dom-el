import { enviroment as env } from './common.js';
import { isInstance, isUndef } from "../helpers.js";
/**
 * Sets or removes an attribute based on value
 *
 * @param {Element} obj - Element to modify
 * @param {string} prop - Property suffix ("Attribute")
 * @param {string} key - Attribute name
 * @param {any} val - Attribute value
 * @returns {void}
 * @private
 */
export function setRemove(obj, prop, key, val){
	return obj[ (isUndef(val) ? "remove" : "set") + prop ](key, val);
}

/**
 * Sets or removes a namespaced attribute based on value
 *
 * @param {Element} obj - Element to modify
 * @param {string} prop - Property suffix ("Attribute")
 * @param {string} key - Attribute name
 * @param {any} val - Attribute value
 * @param {string|null} [ns=null] - Namespace URI
 * @returns {void}
 * @private
 */
export function setRemoveNS(obj, prop, key, val, ns= null){
	return obj[ (isUndef(val) ? "remove" : "set") + prop + "NS" ](ns, key, val);
}

/**
 * Sets or deletes a property based on value
 *
 * @param {Object} obj - Object to modify
 * @param {string} key - Property name
 * @param {any} val - Property value
 * @returns {void}
 * @private
 */
export function setDelete(obj, key, val){
	Reflect.set(obj, key, val); if(!isUndef(val)) return; return Reflect.deleteProperty(obj, key);
}
/**
 * Generic element attribute manipulation
 *
 * @param {Element} element - Element to manipulate
 * @param {string} op - Operation ("set" or "remove")
 * @param {string} key - Attribute name
 * @param {any} [value] - Attribute value
 * @returns {void}
 */
export function elementAttribute(element, op, key, value){
	if(isInstance(element, env.H))
		return element[op+"Attribute"](key, value);
	return element[op+"AttributeNS"](null, key, value);
}
