import { keyDM, keyLTE } from "./dom-common.js";
import { scope } from "./dom.js";
export function customElementRender(custom_element, render, props= observedAttributes){
	scope.push({
		scope: custom_element,
		host: (...c)=> c.length ? c.forEach(c=> c(custom_element)) : custom_element,
		custom_element
	});
	if(typeof props==="function") props= props.call(custom_element, custom_element);
	const out= render.call(custom_element, props);
	scope.pop();
	return out;
}
export function lifecycleToEvents(class_declaration){
	wrapMethod(class_declaration.prototype, "connectedCallback", function(target, thisArg, detail){
		target.apply(thisArg, detail);
		thisArg.dispatchEvent(new Event("dde:connected"));
	});
	if(!class_declaration.prototype[keyDM])
		class_declaration.prototype[keyDM]= "dde";
	wrapMethod(class_declaration.prototype, "disconnectedCallback", function(target, thisArg, detail){
		target.apply(thisArg, detail);
		const dispatch= ()=> thisArg.dispatchEvent(new Event("dde:disconnected"));
		if(thisArg[keyDM]!=="dde")
			return dispatch();
		(queueMicrotask || setTimeout)(()=> !thisArg.isConnected && dispatch());
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
