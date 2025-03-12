import { keyLTE, evc, evd, eva } from "./dom-common.js";
import { scope } from "./dom.js";
import { c_ch_o } from "./events-observer.js";

/**
 * Renders content into a custom element or shadow root
 *
 * @param {Element|ShadowRoot} target - The custom element or shadow root to render into
 * @param {Function} render - The render function that returns content
 * @param {Function|Object} [props= {}] - Props to pass to the render function
 * @returns {Node} The rendered content
 */
export function customElementRender(target, render, props= {}){
	const custom_element= target.host || target;
	scope.push({
		scope: custom_element,
		host: (...c)=> c.length ? c.forEach(c=> c(custom_element)) : custom_element
	});
	if(typeof props==="function") props= props.call(custom_element, custom_element);
	const is_lte= custom_element[keyLTE];
	if(!is_lte) lifecyclesToEvents(custom_element);
	const out= render.call(custom_element, props);
	if(!is_lte) custom_element.dispatchEvent(new Event(evc));
	if(target.nodeType===11 && typeof target.mode==="string") // is ShadowRoot
		custom_element.addEventListener(evd, c_ch_o.observe(target), { once: true });
	scope.pop();
	return target.append(out);
}

/**
 * Transforms custom element lifecycle callbacks into events
 *
 * @param {Function|Object} class_declaration - Custom element class or instance
 * @returns {Function|Object} The modified class or instance
 */
export function lifecyclesToEvents(class_declaration){
	wrapMethod(class_declaration.prototype, "connectedCallback", function(target, thisArg, detail){
		target.apply(thisArg, detail);
		thisArg.dispatchEvent(new Event(evc));
	});
	wrapMethod(class_declaration.prototype, "disconnectedCallback", function(target, thisArg, detail){
		target.apply(thisArg, detail);
		(globalThis.queueMicrotask || setTimeout)(
			()=> !thisArg.isConnected && thisArg.dispatchEvent(new Event(evd))
		);
	});
	wrapMethod(class_declaration.prototype, "attributeChangedCallback", function(target, thisArg, detail){
		const [ attribute, , value ]= detail;
		thisArg.dispatchEvent(new CustomEvent(eva, {
			detail: [ attribute, value ]
		}));
		target.apply(thisArg, detail);
	});
	class_declaration.prototype[keyLTE]= true;
	return class_declaration;
}

/** Public API */
export { lifecyclesToEvents as customElementWithDDE };

/**
 * Wraps a method with a proxy to intercept calls
 *
 * @param {Object} obj - Object containing the method
 * @param {string} method - Method name to wrap
 * @param {Function} apply - Function to execute when method is called
 * @private
 */
function wrapMethod(obj, method, apply){
	obj[method]= new Proxy(obj[method] || (()=> {}), { apply });
}
