import { keyLTE } from "./dom-common.js";
import { scope } from "./dom.js";
import { c_ch_o } from "./events-observer.js";
export function customElementRender(custom_element, target, render, props= observedAttributes){
	scope.push({
		scope: custom_element,
		host: (...c)=> c.length ? c.forEach(c=> c(custom_element)) : custom_element
	});
	if(typeof props==="function") props= props.call(custom_element, custom_element);
	const is_lte= custom_element[keyLTE];
	if(!is_lte) lifecycleToEvents(custom_element);
	const out= render.call(custom_element, props);
	if(!is_lte) custom_element.dispatchEvent(new Event("dde:connected"));
	if(target.nodeType===11 && typeof target.mode==="string") // is ShadowRoot
		custom_element.addEventListener("dde:disconnected", c_ch_o.observe(target), { once: true });
	scope.pop();
	return target.append(out);
}
export function lifecycleToEvents(class_declaration){
	wrapMethod(class_declaration.prototype, "connectedCallback", function(target, thisArg, detail){
		target.apply(thisArg, detail);
		thisArg.dispatchEvent(new Event("dde:connected"));
	});
	wrapMethod(class_declaration.prototype, "disconnectedCallback", function(target, thisArg, detail){
		target.apply(thisArg, detail);
		(queueMicrotask || setTimeout)(
			()=> !thisArg.isConnected && thisArg.dispatchEvent(new Event("dde:disconnected"))
		);
	});
	wrapMethod(class_declaration.prototype, "attributeChangedCallback", function(target, thisArg, detail){
		const [ attribute, , value ]= detail;
		thisArg.dispatchEvent(new CustomEvent("dde:attributeChanged", {
			detail: [ attribute, value ]
		}));
		target.apply(thisArg, detail);
	});
	class_declaration.prototype[keyLTE]= true;
	return class_declaration;
}
export { lifecycleToEvents as customElementWithDDE };
function wrapMethod(obj, method, apply){
	obj[method]= new Proxy(obj[method] || (()=> {}), { apply });
}

import { observedAttributes as oA } from "./helpers.js";
export function observedAttributes(instance){
	return oA(instance, (i, n)=> i.getAttribute(n));
}