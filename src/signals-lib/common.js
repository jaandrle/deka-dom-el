import { isProtoFrom, oAssign } from "../helpers.js";
/**
 * Global signals object with default implementation
 * @type {Object}
 */
export const signals_global= {
	/**
	 * Checks if a value is a signal
	 * @param {any} attributes - Value to check
	 * @returns {boolean} Whether the value is a signal
	 */
	isSignal(attributes){ return false; },

	/**
	 * Processes an attribute that might be reactive
	 * @param {Element} obj - Element that owns the attribute
	 * @param {string} key - Attribute name
	 * @param {any} attr - Attribute value
	 * @param {Function} set - Function to set the attribute
	 * @returns {any} Processed attribute value
	 */
	processReactiveAttribute(obj, key, attr, set){ return attr; },
};

/**
 * Registers a reactivity implementation
 * @param {Object} def - Reactivity implementation
 * @param {boolean} [global=true] - Whether to set globally or create a new implementation
 * @returns {Object} The registered reactivity implementation
 */
export function registerReactivity(def, global= true){
	if(global) return oAssign(signals_global, def);
	Object.setPrototypeOf(def, signals_global);
	return def;
}

/**
 * Gets the signals implementation from a context
 * @param {unknown} _this - Context to check for signals implementation
 * @returns {typeof signals_global} Signals implementation
 */
export function signals(_this){
	return isProtoFrom(_this, signals_global) && _this!==signals_global ? _this : signals_global;
}
