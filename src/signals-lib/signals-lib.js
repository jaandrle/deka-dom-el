import { queueSignalWrite, mark } from "./helpers.js";
export { mark };
import { hasOwn, Defined, oCreate, oAssign } from "../helpers.js";

const Signal = oCreate(null, {
	get: { value(){ return read(this); } },
	set: { value(...v){ return write(this, ...v); } },
	toJSON: { value(){ return read(this); } },
	valueOf: { value(){ return this[mark] && this[mark].value; } }
});
const SignalReadOnly= oCreate(Signal, {
	set: { value(){ return; } },
});
/**
 * Checks if a value is a signal
 *
 * @param {any} candidate - Value to check
 * @returns {boolean} True if the value is a signal
 */
export function isSignal(candidate){
	return candidate && candidate[mark];
}

/**
 * Stack for tracking nested signal computations
 * @type {function[]}
 */
const stack_watch= [];

/**
 * Dependencies tracking map for signals
 *
 * ### `WeakMap<function, Set<ddeSignal<any, any>>>`
 * The `Set` is in the form of `[ source, ...depended signals (DSs) ]`.
 * When the DS is cleaned (`S.clear`) it is removed from DSs,
 * if remains only one (`source`) it is cleared too.
 * ### `WeakMap<object, function>`
 * This is used for revesed deps, the `function` is also key for `deps`.
 * @type {WeakMap<function|object,Set<ddeSignal<any, any>>|function>}
 */
const deps= new WeakMap();
/**
 * Creates a new signal or converts a function into a derived signal
 *
 * @param {any|function} value - Initial value or function that computes the value
 * @param {Object} [actions] - Custom actions for the signal
 * @returns {Object} Signal object with get() and set() methods
 */
export function signal(value, actions){
	if(typeof value!=="function")
		return create(false, value, actions);
	if(isSignal(value)) return value;

	const out= create(true);

	/**
	 * Updates the derived signal when dependencies change
	 * @private
	 */
	function contextReWatch(){
		const [ origin, ...deps_old ]= deps.get(contextReWatch);
		deps.set(contextReWatch, new Set([ origin ]));

		stack_watch.push(contextReWatch);
		write(out, value());
		stack_watch.pop();

		if(!deps_old.length) return;
		const deps_curr= deps.get(contextReWatch);
		for (const dep_signal of deps_old){
			if(deps_curr.has(dep_signal)) continue;
			removeSignalListener(dep_signal, contextReWatch);
		}
	}
	deps.set(out[mark], contextReWatch);
	deps.set(contextReWatch, new Set([ out ]));
	contextReWatch();
	return out;
}

/** Alias for signal */
export { signal as S };
/**
 * Calls a custom action on a signal
 *
 * @param {Object} s - Signal object to call action on
 * @param {string} name - Action name
 * @param {...any} a - Arguments to pass to the action
 */
signal.action= function(s, name, ...a){
	const M= s[mark];
	if(!M) return;
	const { actions }= M;
	if(!actions || !hasOwn(actions, name))
		throw new Error(`Action "${name}" not defined. See ${mark}.actions.`);
	actions[name].apply(M, a);
	if(M.skip) return (delete M.skip);
	queueSignalWrite(s);
};

/**
 * Subscribes a listener to signal changes
 *
 * @param {Object|Object[]} s - Signal object or array of signal objects to subscribe to
 * @param {function} listener - Callback function receiving signal value
 * @param {Object} [options={}] - Subscription options
 * @param {AbortSignal} [options.signal] - Signal to abort subscription
 */
signal.on= function on(s, listener, options= {}){
	const { signal: as }= options;
	if(as && as.aborted) return;
	if(Array.isArray(s)) return s.forEach(s=> on(s, listener, options));
	addSignalListener(s, listener);
	if(as) as.addEventListener("abort", ()=> removeSignalListener(s, listener));
};

/**
 * Symbol constants for signal internals
 */
signal.symbols= {
	//signal: mark,
	onclear: Symbol.for("Signal.onclear")
};

/**
 * Cleans up signals and their dependencies
 *
 * @param {...Object} signals - Signal objects to clean up
 */
signal.clear= function(...signals){
	for(const s of signals){
		const M= s[mark];
		if(!M) continue;
		delete s.toJSON;
		M.onclear.forEach(f=> f.call(M));
		clearListDeps(s, M);
		delete s[mark];
	}

	/**
	 * Cleans up signal dependencies
	 * @param {function} s - Signal being cleared
	 * @param {Object} o - Signal metadata
	 * @private
	 */
	function clearListDeps(s, o){
		o.listeners.forEach(l=> {
			o.listeners.delete(l);
			if(!deps.has(l)) return;

			const ls= deps.get(l);
			ls.delete(s);
			if(ls.size>1) return;

			s.clear(...ls);
			deps.delete(l);
		});
	}
};
/** Property key for tracking reactive elements */
const key_reactive= "__dde_reactive";
import { enviroment as env } from "../dom-common.js";
import { el } from "../dom.js";
import { scope } from "../dom.js";
import { on } from "../events.js";

export function cache(store= oCreate()){
	return (key, fun)=> hasOwn(store, key) ? store[key] : (store[key]= fun());
}
/**
 * Creates a reactive DOM element that re-renders when signal changes
 *
 * @TODO Third argument for handle `cache_tmp` in re-render
 * @param {Object} s - Signal object to watch
 * @param {Function} map - Function mapping signal value to DOM elements
 * @returns {DocumentFragment} Fragment containing reactive elements
 */
signal.el= function(s, map){
	const mark_start= el.mark({ type: "reactive", source: new Defined().compact }, true);
	const mark_end= mark_start.end;
	const out= env.D.createDocumentFragment();
	out.append(mark_start, mark_end);
	const { current }= scope;
	let cache_shared= oCreate();
	const reRenderReactiveElement= v=> {
		if(!mark_start.parentNode || !mark_end.parentNode) // === `isConnected` or wasn’t yet rendered
			return removeSignalListener(s, reRenderReactiveElement);
		const memo= cache(cache_shared);
		cache_shared= oCreate();
		scope.push(current);
		let els= map(v, function useCache(key, fun){
			return (cache_shared[key]= memo(key, fun));
		});
		scope.pop();
		if(!Array.isArray(els))
			els= [ els ];
		const el_start_rm= document.createComment("");
		els.push(el_start_rm);
		mark_start.after(...els);
		let el_r;
		while(( el_r= el_start_rm.nextSibling ) && el_r !== mark_end)
			el_r.remove();
		el_start_rm.remove();
		if(mark_start.isConnected)
			requestCleanUpReactives(current.host());
	};
	addSignalListener(s, reRenderReactiveElement);
	removeSignalsFromElements(s, reRenderReactiveElement, mark_start, map);
	reRenderReactiveElement(s.get());
	current.host(on.disconnected(()=>
		/*! Clears cached elements for reactive element `S.el` */
		cache_shared= {}
	));
	return out;
};
/**
 * Cleans up reactive elements that are no longer connected
 *
 * @param {Element} host - Host element containing reactive elements
 * @private
 */
function requestCleanUpReactives(host){
	if(!host || !host[key_reactive]) return;
	(requestIdleCallback || setTimeout)(function(){
		host[key_reactive]= host[key_reactive]
			.filter(([ s, el ])=> el.isConnected ? true : (removeSignalListener(...s), false));
	});
}
import { observedAttributes } from "../helpers.js";

/**
 * Actions for observed attribute signals
 * @private
 */
const observedAttributeActions= {
	_set(value){ this.value= value; },
};

/**
 * Creates a function that returns signals for element attributes
 *
 * @param {Object} store - Storage object for attribute signals
 * @returns {Function} Function creating attribute signals
 * @private
 */
function observedAttribute(store){
	return function(instance, name){
		const varS= oCreate(Signal, {
			set: { value(...v){ return instance.setAttribute(name, ...v); } }
		});
		const out= toSignal(varS, instance.getAttribute(name), observedAttributeActions);
		store[name]= out;
		return out;
	};
}
/** Property key for storing attribute signals */
const key_attributes= "__dde_attributes";

/**
 * Creates signals for observed attributes in custom elements
 *
 * @param {Element} element - Custom element instance
 * @returns {Object} Object with attribute signals
 */
signal.observedAttributes= function(element){
	const store= element[key_attributes]= {};
	const attrs= observedAttributes(element, observedAttribute(store));
	on.attributeChanged(function attributeChangeToSignal({ detail }){
		/*! This maps attributes to signals (`S.observedAttributes`).
			Investigate `__dde_attributes` key of the element. */
		const [ name, value ]= detail;
		const curr= this[key_attributes][name];
		if(curr) return signal.action(curr, "_set", value);
	})(element);
	on.disconnected(function(){
		/*! This removes all signals mapped to attributes (`S.observedAttributes`).
			Investigate `__dde_attributes` key of the element. */
		signal.clear(...Object.values(this[key_attributes]));
	})(element);
	return attrs;
};

import { typeOf } from '../helpers.js';

/**
 * Signal configuration for the library
 * Implements processReactiveAttribute to handle signal-based attributes
 */
export const signals_config= {
	isSignal,

	/**
	 * Processes attributes that might be signals
	 *
	 * @param {Element} element - Element with the attribute
	 * @param {string} key - Attribute name
	 * @param {any} attrs - Attribute value (possibly a signal)
	 * @param {Function} set - Function to set attribute value
	 * @returns {any} Processed attribute value
	 */
	processReactiveAttribute(element, key, attrs, set){
		if(!isSignal(attrs)) return attrs;
		const l= attr=> {
			if(!element.isConnected)
				return removeSignalListener(attrs, l);
			set(key, attr);
		};
		addSignalListener(attrs, l);
		removeSignalsFromElements(attrs, l, element, key);
		return attrs.get();
	}
};
/**
 * Registers signal listener for cleanup when element is removed
 *
 * @param {Object} s - Signal object to track
 * @param {Function} listener - Signal listener
 * @param {...any} notes - Additional context information
 * @private
 */
function removeSignalsFromElements(s, listener, ...notes){
	const { current }= scope;
	current.host(function(element){
		if(element[key_reactive])
			return element[key_reactive].push([ [ s, listener ], ...notes ]);
		element[key_reactive]= [];
		if(current.prevent) return; // typically document.body, doenst need auto-remove as it should happen on page leave
		on.disconnected(()=>
			/*! Clears all Signals listeners added in the current scope/host (`S.el`, `assign`, …?).
				You can investigate the `__dde_reactive` key of the element. */
			element[key_reactive].forEach(([ [ s, listener ] ])=>
				removeSignalListener(s, listener, s[mark] && s[mark].host && s[mark].host() === element))
		)(element);
	});
}

/**
 * Registry for cleaning up signals when they are garbage collected
 * @type {FinalizationRegistry}
 */
const cleanUpRegistry = new FinalizationRegistry(function(s){
	signal.clear({ [mark]: s });
});
/**
 * Creates a new signal object
 *
 * @param {boolean} is_readonly - Whether the signal is readonly
 * @param {any} value - Initial signal value
 * @param {Object} actions - Custom actions for the signal
 * @returns {Object} Signal object with get() and set() methods
 * @private
 */
function create(is_readonly, value, actions){
	const varS = oCreate(is_readonly ? SignalReadOnly : Signal);
	const SI= toSignal(varS, value, actions, is_readonly);
	cleanUpRegistry.register(SI, SI[mark]);
	return SI;
}

/**
 * Prototype for signal internal objects
 * @private
 */
const protoSigal= oAssign(oCreate(), {
	/**
	 * Prevents signal propagation
	 */
	stopPropagation(){
		this.skip= true;
	}
});
/**
 * Transforms an object into a signal
 *
 * @param {Object} s - Object to transform
 * @param {any} value - Initial value
 * @param {Object} actions - Custom actions
 * @param {boolean} [readonly=false] - Whether the signal is readonly
 * @returns {Object} Signal object with get() and set() methods
 * @private
 */
function toSignal(s, value, actions, readonly= false){
	const onclear= [];
	if(typeOf(actions)!=="[object Object]")
		actions= {};
	const { onclear: ocs }= signal.symbols;
	if(actions[ocs]){
		onclear.push(actions[ocs]);
		delete actions[ocs];
	}
	const { host }= scope;
	Reflect.defineProperty(s, mark, {
		value: oAssign(oCreate(protoSigal), {
			value, actions, onclear, host,
			listeners: new Set(),
			defined: new Defined().stack,
			readonly
		}),
		enumerable: false,
		writable: false,
		configurable: true
	});
	return s;
}
/**
 * Gets the current computation context
 * @returns {function|undefined} Current context function
 * @private
 */
function currentContext(){
	return stack_watch[stack_watch.length - 1];
}

/**
 * Reads a signal's value and tracks dependencies
 *
 * @param {Object} s - Signal object to read
 * @returns {any} Signal value
 * @private
 */
function read(s){
	if(!s[mark]) return;
	const { value, listeners }= s[mark];
	const context= currentContext();
	if(context) listeners.add(context);
	if(deps.has(context)) deps.get(context).add(s);
	return value;
}

/**
 * Writes a new value to a signal
 *
 * @param {Object} s - Signal object to update
 * @param {any} value - New value
 * @param {boolean} [force=false] - Force update even if value is unchanged
 * @returns {any} The new value
 * @private
 */
function write(s, value, force){
	const M= s[mark];
	if(!M || (!force && M.value===value)) return;

	M.value= value;
	queueSignalWrite(s);
	return value;
}

/**
 * Adds a listener to a signal
 *
 * @param {Object} s - Signal object to listen to
 * @param {Function} listener - Callback function
 * @returns {Set} Listener set
 * @private
 */
function addSignalListener(s, listener){
	if(!s[mark]) return;
	return s[mark].listeners.add(listener);
}

/**
 * Removes a listener from a signal
 *
 * @param {Object} s - Signal object to modify
 * @param {Function} listener - Listener to remove
 * @param {boolean} [clear_when_empty] - Whether to clear the signal when no listeners remain
 * @returns {boolean} Whether the listener was found and removed
 * @private
 */
function removeSignalListener(s, listener, clear_when_empty){
	const M= s[mark];
	if(!M) return;

	const { listeners: L }= M;
	const out= L.delete(listener);
	if(!out || !clear_when_empty || L.size) return out;

	signal.clear(s);
	const depList= deps.get(M);
	if(!depList) return out;

	const depSource= deps.get(depList);
	if(!depSource) return out;

	for(const sig of depSource) removeSignalListener(sig, depList, true);
	return out;
}
