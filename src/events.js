import { isSignal, addSignalListener } from './signals.js';
export function on(event, listener, options){
	if(isSignal(event)) return addSignalListener(event, listener);
	return element=> element.addEventListener(event, listener, options);
}
export function dispatch(event, detail){
	if(typeof event === "string")
		event= typeof detail==="undefined" ? new Event(event) : new CustomEvent(event, { detail });
	return element=> element.dispatchEvent(event);
}

const connections_changes= connectionsChangesObserverConstructor();
on.connected= function(listener){
	return function registerElement(element){
		connections_changes.onConnected(element, listener);
	};
};
on.disconnected= function(listener){
	return function registerElement(element){
		connections_changes.onDisconnected(element, listener);
	};
};

function connectionsChangesObserverConstructor(){
	const store= new Map();
	let is_observing= false;
	const observer= new MutationObserver(function(mutations){
		for(const mutation of mutations){
			if(mutation.type!=="childList") continue;
			if(observerAdded(mutation.addedNodes)){
				stop();
				continue;
			}
			if(observerRemoved(mutation.removedNodes))
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
		if(ls.connected.length || ls.disconnect.length)
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
	function observerAdded(addedNodes){
		for(const element of addedNodes){
			collectChildren(element).then(observerAdded);
			if(!store.has(element)) return false;
			
			const ls= store.get(element);
			ls.connected.forEach(listener=> listener(element));
			ls.connected.length= 0;
			if(!ls.disconnected.length) store.delete(element);
			return true;
		}
	}
	function observerRemoved(removedNodes){
		for(const element of removedNodes){
			collectChildren(element).then(observerRemoved);
			if(!store.has(element)) return false;
			
			const ls= store.get(element);
			ls.disconnected.forEach(listener=> listener(element));
			
			ls.connected.length= 0;
			ls.disconnected.length= 0;
			store.delete(element);
			return true;
		}
	}
}
