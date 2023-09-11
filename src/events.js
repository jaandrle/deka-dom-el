export { registerReactivity } from './signals-common.js';

export function dispatchEvent(element, name, ...d){
	const event= d.length ? new CustomEvent(name, { detail: d[0] }) : new Event(name);
	return element.dispatchEvent(event);
}
export function on(event, listener, options){
	return function registerElement(element){
		element.addEventListener(event, listener, options);
		return element;
	};
}

const c_ch_o= connectionsChangesObserverConstructor();
import { onAbort } from './helpers.js';
//TODO: cleanUp when event before abort?
on.connected= function(listener, options){
	return function registerElement(element){
		if(typeof element.connectedCallback === "function"){
			element.addEventListener("dde:connected", listener, options);
			return element;
		}
		const c= onAbort(options && options.signal, ()=> c_ch_o.offConnected(element, listener));
		if(!c) return element;
		if(element.isConnected) listener(new Event("dde:connected"));
		else c_ch_o.onConnected(element, listener);
		return element;
	};
};
on.disconnected= function(listener, options){
	return function registerElement(element){
		if(typeof element.disconnectedCallback === "function"){
			element.addEventListener("dde:disconnected", listener, options);
			return element;
		}
		const c= onAbort(options && options.signal, ()=> c_ch_o.offDisconnected(element, listener));
		if(c) c_ch_o.onDisconnected(element, listener);
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
			listeners.connected.push(listener);
		},
		offConnected(element, listener){
			if(!store.has(element)) return;
			const ls= store.get(element);
			const l= ls.connected;
			l.splice(l.indexOf(listener), 1);
			cleanWhenOff(element, ls);
		},
		onDisconnected(element, listener){
			start();
			const listeners= getElementStore(element);
			listeners.disconnected.push(listener);
		},
		offDisconnected(element, listener){
			if(!store.has(element)) return;
			const ls= store.get(element);
			const l= ls.disconnected;
			l.splice(l.indexOf(listener), 1);
			cleanWhenOff(element, ls);
		}
	};
	function cleanWhenOff(element, ls){
		if(ls.connected.length || ls.disconnected.length)
			return;
		store.delete(element);
		stop();
	}
	function getElementStore(element){
		if(store.has(element)) return store.get(element);
		const out= { connected: [], disconnected: [] };
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
		for(const element of addedNodes){
			if(is_root) collectChildren(element).then(observerAdded);
			if(!store.has(element)) continue;
			
			const ls= store.get(element);
			ls.connected.forEach(listener=> listener(element));
			ls.connected.length= 0;
			if(!ls.disconnected.length) store.delete(element);
			return true;
		}
		return false;
	}
	function observerRemoved(removedNodes, is_root){
		for(const element of removedNodes){
			if(is_root) collectChildren(element).then(observerRemoved);
			if(!store.has(element)) continue;
			
			const ls= store.get(element);
			ls.disconnected.forEach(listener=> listener(element));
			
			ls.connected.length= 0;
			ls.disconnected.length= 0;
			store.delete(element);
			return true;
		}
		return false;
	}
}
