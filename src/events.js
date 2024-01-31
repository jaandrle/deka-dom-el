export { registerReactivity } from './observables-common.js';
import { enviroment as env, keyLTE } from './dom-common.js';

export function dispatchEvent(name, options, host){
	if(!options) options= {};
	return function dispatch(element, ...d){
		if(host){
			d.unshift(element);
			element= typeof host==="function"? host() : host;
		}
		const event= d.length ? new CustomEvent(name, Object.assign({ detail: d[0] }, options)) : new Event(name, options);
		return element.dispatchEvent(event);
	};
}
export function on(event, listener, options){
	return function registerElement(element){
		element.addEventListener(event, listener, options);
		return element;
	};
}

import { c_ch_o } from "./events-observer.js";
const els_attribute_store= new WeakSet();
import { scope } from "./dom.js";
import { onAbort } from './helpers.js';
//TODO: cleanUp when event before abort?
//TODO: docs (e.g.) https://nolanlawson.com/2024/01/13/web-component-gotcha-constructor-vs-connectedcallback/
on.connected= function(listener, options){
	const { custom_element }= scope.current;
	const name= "connected";
	if(typeof options !== "object")
		options= {};
	options.once= true;
	return function registerElement(element){
		if(custom_element) element= custom_element;
		const event= "dde:"+name;
		element.addEventListener(event, listener, options);
		if(element[keyLTE]) return element;
		if(element.isConnected) return ( element.dispatchEvent(new Event(event)), element );

		const c= onAbort(options.signal, ()=> c_ch_o.offConnected(element, listener));
		if(c) c_ch_o.onConnected(element, listener);
		return element;
	};
};
on.disconnected= function(listener, options){
	const { custom_element }= scope.current;
	const name= "disconnected";
	if(typeof options !== "object")
		options= {};
	options.once= true;
	return function registerElement(element){
		if(custom_element) element= custom_element;
		const event= "dde:"+name;
		element.addEventListener(event, listener, options);
		if(element[keyLTE]) return element;

		const c= onAbort(options.signal, ()=> c_ch_o.offDisconnected(element, listener));
		if(c) c_ch_o.onDisconnected(element, listener);
		return element;
	};
};
const store_abort= new WeakMap();
on.disconnectedAsAbort= function(host){
	if(store_abort.has(host)) return store_abort.get(host);

	const a= new AbortController();
	store_abort.set(host, a);
	host(on.disconnected(()=> a.abort()));
	return a;
};
on.attributeChanged= function(listener, options){
	const name= "attributeChanged";
	if(typeof options !== "object")
		options= {};
	return function registerElement(element){
		const event= "dde:"+name;
		element.addEventListener(event, listener, options);
		if(element[keyLTE] || els_attribute_store.has(element))
			return element;
		
		if(!env.M) return element;
		
		const observer= new env.M(function(mutations){
			for(const { attributeName, target } of mutations)
				target.dispatchEvent(
					new CustomEvent(event, { detail: [ attributeName, target.getAttribute(attributeName) ] }));
		});
		const c= onAbort(options.signal, ()=> observer.disconnect());
		if(c) observer.observe(element, { attributes: true });
		//TODO: clean up when element disconnected
		return element;
	};
};	