export { registerReactivity } from './signals-lib/common.js';
import { enviroment as env, keyLTE, evc, evd, eva } from './dom-common.js';
import { oAssign, onAbort } from './helpers.js';

/**
 * Creates a function to dispatch events on elements
 *
 * @param {string} name - Event name
 * @param {Object} [options] - Event options
 * @param {Element|Function} [host] - Host element or function returning host element
 * @returns {Function} Function that dispatches the event
 */
export function dispatchEvent(name, options, host){
	if(typeof options==="function"){ host= options; options= null; }
	if(!options) options= {};
	return function dispatch(element, ...d){
		if(host){
			d.unshift(element);
			element= typeof host==="function"? host() : host;
		}
		//TODO: what about re-emmitting?
		const event= d.length ? new CustomEvent(name, oAssign({ detail: d[0] }, options)) : new Event(name, options);
		return element.dispatchEvent(event);
	};
}

/**
 * Creates a function to register event listeners on elements
 *
 * @param {string} event - Event name
 * @param {Function} listener - Event handler
 * @param {Object} [options] - Event listener options
 * @returns {Function} Function that registers the listener
 */
export function on(event, listener, options){
	return function registerElement(element){
		element.addEventListener(event, listener, options);
		return element;
	};
}

import { c_ch_o } from "./events-observer.js";

/**
 * Prepares lifecycle event options with once:true default
 * @private
 */
const lifeOptions= obj=> oAssign({}, typeof obj==="object" ? obj : null, { once: true });

//TODO: cleanUp when event before abort?
//TODO: docs (e.g.) https://nolanlawson.com/2024/01/13/web-component-gotcha-constructor-vs-connectedcallback/

/**
 * Creates a function to register connected lifecycle event listeners
 *
 * @param {Function} listener - Event handler
 * @param {Object} [options] - Event listener options
 * @returns {Function} Function that registers the connected listener
 */
on.connected= function(listener, options){
	options= lifeOptions(options);
	return function registerElement(element){
		element.addEventListener(evc, listener, options);
		if(element[keyLTE]) return element;
		if(element.isConnected) return ( element.dispatchEvent(new Event(evc)), element );

		const c= onAbort(options.signal, ()=> c_ch_o.offConnected(element, listener));
		if(c) c_ch_o.onConnected(element, listener);
		return element;
	};
};

/**
 * Creates a function to register disconnected lifecycle event listeners
 *
 * @param {Function} listener - Event handler
 * @param {Object} [options] - Event listener options
 * @returns {Function} Function that registers the disconnected listener
 */
on.disconnected= function(listener, options){
	options= lifeOptions(options);
	return function registerElement(element){
		element.addEventListener(evd, listener, options);
		if(element[keyLTE]) return element;

		const c= onAbort(options.signal, ()=> c_ch_o.offDisconnected(element, listener));
		if(c) c_ch_o.onDisconnected(element, listener);
		return element;
	};
};

/** Store for disconnect abort controllers */
const store_abort= new WeakMap();

/**
 * Creates an AbortController that triggers when the element disconnects
 *
 * @param {Element|Function} host - Host element or function taking an element
 * @returns {AbortController} AbortController that aborts on disconnect
 */
on.disconnectedAsAbort= function(host){
	if(store_abort.has(host)) return store_abort.get(host);

	const a= new AbortController();
	store_abort.set(host, a);
	host(on.disconnected(()=> a.abort()));
	return a;
};

/** Store for elements with attribute observers */
const els_attribute_store= new WeakSet();

/**
 * Creates a function to register attribute change event listeners
 *
 * @param {Function} listener - Event handler
 * @param {Object} [options] - Event listener options
 * @returns {Function} Function that registers the attribute change listener
 */
on.attributeChanged= function(listener, options){
	if(typeof options !== "object")
		options= {};
	return function registerElement(element){
		element.addEventListener(eva, listener, options);
		if(element[keyLTE] || els_attribute_store.has(element))
			return element;

		if(!env.M) return element;

		const observer= new env.M(function(mutations){
			for(const { attributeName, target } of mutations)
				target.dispatchEvent(
					new CustomEvent(eva, { detail: [ attributeName, target.getAttribute(attributeName) ] }));
		});
		const c= onAbort(options.signal, ()=> observer.disconnect());
		if(c) observer.observe(element, { attributes: true });
		//TODO: clean up when element disconnected
		return element;
	};
};
