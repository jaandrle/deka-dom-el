export { registerReactivity } from './observables-common.js';

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

const c_ch_o= connectionsChangesObserverConstructor();
const els_attribute_store= new WeakSet();
import { scope } from "./dom.js";
import { onAbort } from './helpers.js';
//TODO: cleanUp when event before abort?
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
		if(element.__dde_lifecycleToEvents) return element;
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
		if(element.__dde_lifecycleToEvents) return element;

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
		if(element.__dde_lifecycleToEvents || els_attribute_store.has(element))
			return element;
		
		const observer= new MutationObserver(function(mutations){
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

function connectionsChangesObserverConstructor(){
	const store= new Map();
	let is_observing= false;
	const observer= new MutationObserver(function(mutations){
		for(const mutation of mutations){
			if(mutation.type!=="childList") continue;
			if(observerAdded(mutation.addedNodes, true)){
				stop();
				continue;
			}
			if(observerRemoved(mutation.removedNodes, true))
				stop();
		}
	});
	return {
		onConnected(element, listener){
			start();
			const listeners= getElementStore(element);
			if(listeners.connected.has(listener)) return;
			listeners.connected.add(listener);
			listeners.length_c+= 1;
		},
		offConnected(element, listener){
			if(!store.has(element)) return;
			const ls= store.get(element);
			if(!ls.connected.has(listener)) return;
			ls.connected.delete(listener);
			ls.length_c-= 1;
			cleanWhenOff(element, ls);
		},
		onDisconnected(element, listener){
			start();
			const listeners= getElementStore(element);
			if(listeners.disconnected.has(listener)) return;
			listeners.disconnected.add(listener);
			listeners.length_d+= 1;
		},
		offDisconnected(element, listener){
			if(!store.has(element)) return;
			const ls= store.get(element);
			if(!ls.disconnected.has(listener)) return;
			ls.disconnected.delete(listener);
			ls.length_d-= 1;
			cleanWhenOff(element, ls);
		}
	};
	function cleanWhenOff(element, ls){
		if(ls.length_c || ls.length_d)
			return;
		store.delete(element);
		stop();
	}
	function getElementStore(element){
		if(store.has(element)) return store.get(element);
		const out= {
			connected: new WeakSet(),
			length_c: 0,
			disconnected: new WeakSet(),
			length_d: 0
		};
		store.set(element, out);
		return out;
	}
	function start(){
		if(is_observing) return;
		is_observing= true;
		observer.observe(document.body, { childList: true, subtree: true });
	}
	function stop(){
		if(!is_observing || store.size) return;
		is_observing= false;
		observer.disconnect();
	}
	//TODO remount support?
	function requestIdle(){ return new Promise(function(resolve){
		(requestIdleCallback || requestAnimationFrame)(resolve);
	}); }
	async function collectChildren(element){
		if(store.size > 30)//TODO limit?
			await requestIdle();
		const out= [];
		if(!(element instanceof Node)) return out;
		for(const el of store.keys()){
			if(el===element || !(el instanceof Node)) continue;
			if(element.contains(el))
				out.push(el);
		}
		return out;
	}
	function observerAdded(addedNodes, is_root){
		let out= false;
		for(const element of addedNodes){
			if(is_root) collectChildren(element).then(observerAdded);
			if(!store.has(element)) continue;
			
			const ls= store.get(element);
			if(!ls.length_c) continue;
			
			element.dispatchEvent(new Event("dde:connected"));
			ls.connected= new WeakSet();
			ls.length_c= 0;
			if(!ls.length_d) store.delete(element);
			out= true;
		}
		return out;
	}
	function observerRemoved(removedNodes, is_root){
		let out= false;
		for(const element of removedNodes){
			if(is_root) collectChildren(element).then(observerRemoved);
			if(!store.has(element)) continue;
			
			const ls= store.get(element);
			if(!ls.length_d||element.isConnected) continue;
			
			console.log(element);
			element.dispatchEvent(new Event("dde:disconnected"));
			
			store.delete(element);
			out= true;
		}
		return out;
	}
}
