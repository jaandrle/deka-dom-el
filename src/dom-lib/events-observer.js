import { enviroment as env, evc, evd } from './common.js';
import { isInstance } from "../helpers.js";

/**
 * Connection changes observer for tracking element connection/disconnection
 * Falls back to a dummy implementation if MutationObserver is not available
 */
export const c_ch_o= env.M ? connectionsChangesObserverConstructor() : new Proxy({}, {
	get(){ return ()=> {}; }
});

/**
 * Creates an observer that tracks elements being connected to and disconnected from the DOM
 * @returns {Object} Observer with methods to register element listeners
 */
function connectionsChangesObserverConstructor(){
	const store= new Map();
	let is_observing= false;

	/**
	 * Creates a mutation observer callback
	 * @param {Function} stop - Function to stop observation when no longer needed
	 * @returns {Function} MutationObserver callback
	 */
	const observerListener= stop=> function(mutations){
		for(const mutation of mutations){
			if(mutation.type!=="childList") continue;
			if(observerAdded(mutation.addedNodes, true)){
				stop();
				continue;
			}
			if(observerRemoved(mutation.removedNodes, true))
				stop();
		}
	};

	const observer= new env.M(observerListener(stop));

	return {
		/**
		 * Creates an observer for a specific element
		 * @param {Element} element - Element to observe
		 * @returns {Function} Cleanup function
		 */
		observe(element){
			const o= new env.M(observerListener(()=> {}));
			o.observe(element, { childList: true, subtree: true });
			return ()=> o.disconnect();
		},

		/**
		 * Register a connection listener for an element
		 * @param {Element} element - Element to watch
		 * @param {Function} listener - Callback for connection event
		 */
		onConnected(element, listener){
			start();
			const listeners= getElementStore(element);
			if(listeners.connected.has(listener)) return;
			listeners.connected.add(listener);
			listeners.length_c+= 1;
		},

		/**
		 * Unregister a connection listener
		 * @param {Element} element - Element being watched
		 * @param {Function} listener - Callback to remove
		 */
		offConnected(element, listener){
			if(!store.has(element)) return;
			const ls= store.get(element);
			if(!ls.connected.has(listener)) return;
			ls.connected.delete(listener);
			ls.length_c-= 1;
			cleanWhenOff(element, ls);
		},

		/**
		 * Register a disconnection listener for an element
		 * @param {Element} element - Element to watch
		 * @param {Function} listener - Callback for disconnection event
		 */
		onDisconnected(element, listener){
			start();
			const listeners= getElementStore(element);
			if(listeners.disconnected.has(listener)) return;
			listeners.disconnected.add(listener);
			listeners.length_d+= 1;
		},

		/**
		 * Unregister a disconnection listener
		 * @param {Element} element - Element being watched
		 * @param {Function} listener - Callback to remove
		 */
		offDisconnected(element, listener){
			if(!store.has(element)) return;
			const ls= store.get(element);
			ls.disconnected.delete(listener);
			ls.length_d-= 1;
			cleanWhenOff(element, ls);
		}
	};

	/**
	 * Cleanup element tracking when all listeners are removed
	 * @param {Element} element - Element to potentially remove from tracking
	 * @param {Object} ls - Element's listener store
	 */
	function cleanWhenOff(element, ls){
		if(ls.length_c || ls.length_d)
			return;
		store.delete(element);
		stop();
	}

	/**
	 * Gets or creates a store for element listeners
	 * @param {Element} element - Element to get store for
	 * @returns {Object} Listener store for the element
	 */
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

	/**
	 * Start observing DOM changes
	 */
	function start(){
		if(is_observing) return;
		is_observing= true;
		observer.observe(env.D.body, { childList: true, subtree: true });
	}

	/**
	 * Stop observing DOM changes when no longer needed
	 */
	function stop(){
		if(!is_observing || store.size) return;
		is_observing= false;
		observer.disconnect();
	}

	//TODO: remount support?
	/**
	 * Schedule a task during browser idle time
	 * @returns {Promise<void>} Promise that resolves when browser is idle
	 */
	function requestIdle(){ return new Promise(function(resolve){
		(requestIdleCallback || requestAnimationFrame)(resolve);
	}); }

	/**
	 * Collects child elements from the store that are contained by the given element
	 * @param {Element} element - Parent element
	 * @returns {Promise<Element[]>} Promise resolving to array of child elements
	 */
	async function collectChildren(element){
		if(store.size > 30)//TODO?: limit
			await requestIdle();
		const out= [];
		if(!isInstance(element, env.N)) return out;
		for(const el of store.keys()){
			if(el===element || !isInstance(el, env.N)) continue;
			if(element.contains(el))
				out.push(el);
		}
		return out;
	}

	/**
	 * Process nodes added to the DOM
	 * @param {NodeList} addedNodes - Nodes that were added
	 * @param {boolean} is_root - Whether these are root-level additions
	 * @returns {boolean} Whether any relevant elements were processed
	 */
	function observerAdded(addedNodes, is_root){
		let out= false;
		for(const element of addedNodes){
			if(is_root) collectChildren(element).then(observerAdded);
			if(!store.has(element)) continue;

			const ls= store.get(element);
			if(!ls.length_c) continue;

			element.dispatchEvent(new Event(evc));
			ls.connected= new WeakSet();
			ls.length_c= 0;
			if(!ls.length_d) store.delete(element);
			out= true;
		}
		return out;
	}

	/**
	 * Process nodes removed from the DOM
	 * @param {NodeList} removedNodes - Nodes that were removed
	 * @param {boolean} is_root - Whether these are root-level removals
	 * @returns {boolean} Whether any relevant elements were processed
	 */
	function observerRemoved(removedNodes, is_root){
		let out= false;
		for(const element of removedNodes){
			if(is_root) collectChildren(element).then(observerRemoved);
			if(!store.has(element)) continue;

			const ls= store.get(element);
			if(!ls.length_d) continue;
			// support for S.el, see https://vuejs.org/guide/extras/web-components.html#lifecycle
			(globalThis.queueMicrotask || setTimeout)(dispatchRemove(element));
			out= true;
		}
		return out;
	}

	/**
	 * Creates a function to dispatch the disconnect event
	 * @param {Element} element - Element that was removed
	 * @returns {Function} Function to dispatch event after confirming disconnection
	 */
	function dispatchRemove(element){
		return ()=> {
			if(element.isConnected) return;
			element.dispatchEvent(new Event(evd));
			store.delete(element);
		};
	}
}
