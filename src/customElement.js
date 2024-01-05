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
	for (const name of [ "connected", "disconnected" ])
		wrapMethod(class_declaration.prototype, name+"Callback", function(target, thisArg, detail){
			target.apply(thisArg, detail);
			thisArg.dispatchEvent(new Event("dde:"+name));
		});
	const name= "attributeChanged";
	wrapMethod(class_declaration.prototype, name+"Callback", function(target, thisArg, detail){
		const [ attribute, , value ]= detail;
		thisArg.dispatchEvent(new CustomEvent("dde:"+name, {
			detail: [ attribute, value ]
		}));
		target.apply(thisArg, detail);
	});
	class_declaration.prototype.__dde_lifecycleToEvents= true;
	return class_declaration;
}
// https://gist.github.com/WebReflection/ec9f6687842aa385477c4afca625bbf4
export { lifecycleToEvents as customElementWithDDE };
function wrapMethod(obj, method, apply){
	obj[method]= new Proxy(obj[method] || (()=> {}), { apply });
}

import { observedAttributes as oA } from "./helpers.js";
export function observedAttributes(instance){
	return oA(instance, (i, n)=> i.getAttribute(n));
}
