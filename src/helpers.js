/**
 * Safe method to check if an object has a specific property
 * @param {...any} a - Arguments to pass to Object.prototype.hasOwnProperty.call
 * @returns {boolean} Result of hasOwnProperty check
 */
export const hasOwn= (...a)=> Object.prototype.hasOwnProperty.call(...a);

/**
 * Checks if a value is undefined
 * @param {any} value - The value to check
 * @returns {boolean} True if the value is undefined
 */
export function isUndef(value){ return typeof value==="undefined"; }

/**
 * Enhanced typeof that handles null and objects better
 * @param {any} v - The value to check
 * @returns {string} Type as a string
 */
export function typeOf(v){
	const t= typeof v;
	if(t!=="object") return t;
	if(v===null) return "null";
	return Object.prototype.toString.call(v);
}

export function isInstance(obj, cls){ return obj instanceof cls; }
/** @type {typeof Object.prototype.isPrototypeOf.call} */
export function isProtoFrom(obj, cls){ return Object.prototype.isPrototypeOf.call(cls, obj); }
export function oCreate(proto= null, p= {}){ return Object.create(proto, p); }
export function oAssign(...o){ return Object.assign(...o); }

/**
 * Handles AbortSignal registration and cleanup
 * @param {AbortSignal} signal - The AbortSignal to listen to
 * @param {Function} listener - The abort event listener
 * @returns {Function|undefined|boolean} Cleanup function or undefined if already aborted
 */
export function onAbort(signal, listener){
	if(!signal || !isInstance(signal, AbortSignal))
		return true;
	if(signal.aborted)
		return;
	signal.addEventListener("abort", listener);
	return function cleanUp(){
		signal.removeEventListener("abort", listener);
	};
}

/**
 * Processes observed attributes for custom elements
 * @param {object} instance - The custom element instance
 * @param {Function} observedAttribute - Function to process each attribute
 * @returns {object} Object with processed attributes
 */
export function observedAttributes(instance, observedAttribute){
	const { observedAttributes= [] }= instance.constructor;
	return observedAttributes
		.reduce(function(out, name){
			out[kebabToCamel(name)]= observedAttribute(instance, name);
			return out;
		}, {});
}

/**
 * Converts kebab-case strings to camelCase
 * @param {string} name - The kebab-case string
 * @returns {string} The camelCase string
 */
function kebabToCamel(name){ return name.replace(/-./g, x=> x[1].toUpperCase()); }

/**
 * Schedule a task during browser idle time
 * @returns {Promise<void>} Promise that resolves when browser is idle
 */
export function requestIdle(){ return new Promise(function(resolve){
		(globalThis.requestIdleCallback || requestAnimationFrame)(resolve);
	});
}
