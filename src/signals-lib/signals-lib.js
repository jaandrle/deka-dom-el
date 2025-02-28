import { SignalDefined, queueSignalWrite, mark } from "./helpers.js";
export { mark };
import { hasOwn } from "../helpers.js";

export function isSignal(candidate){
	return typeof candidate === "function" && hasOwn(candidate, mark);
}
/** @type {function[]} */
const stack_watch= [];
/**
 * ### `WeakMap<function, Set<ddeSignal<any, any>>>`
 * The `Set` is in the form of `[ source, ...depended signals (DSs) ]`.
 * When the DS is cleaned (`S.clear`) it is removed from DSs,
 * if remains only one (`source`) it is cleared too.
 * ### `WeakMap<object, function>`
 * This is used for revesed deps, the `function` is also key for `deps`.
 * @type {WeakMap<function|object,Set<ddeSignal<any, any>>|function>}
 * */
const deps= new WeakMap();
export function signal(value, actions){
	if(typeof value!=="function")
		return create(false, value, actions);
	if(isSignal(value)) return value;

	const out= create(true);
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
	};
	deps.set(out[mark], contextReWatch);
	deps.set(contextReWatch, new Set([ out ]));
	contextReWatch();
	return out;
}
export { signal as S };
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
signal.on= function on(s, listener, options= {}){
	const { signal: as }= options;
	if(as && as.aborted) return;
	if(Array.isArray(s)) return s.forEach(s=> on(s, listener, options));
	addSignalListener(s, listener);
	if(as) as.addEventListener("abort", ()=> removeSignalListener(s, listener));
};
signal.symbols= {
	//signal: mark,
	onclear: Symbol.for("Signal.onclear")
};
signal.clear= function(...signals){
	for(const s of signals){
		const M= s[mark];
		if(!M) continue;
		delete s.toJSON;
		M.onclear.forEach(f=> f.call(M));
		clearListDeps(s, M);
		delete s[mark];
	}
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
const key_reactive= "__dde_reactive";
import { enviroment as env } from "../dom-common.js";
import { el } from "../dom.js";
import { scope } from "../dom.js";
import { on } from "../events.js";

const storeMemo= new WeakMap();
export function memo(key, fun, cache){
	if(typeof key!=="string") key= JSON.stringify(key);
	if(!cache) {
		const keyStore= scope.host();
		if(storeMemo.has(keyStore))
			cache= storeMemo.get(keyStore);
		else {
			cache= {};
			storeMemo.set(keyStore, cache);
		}
	}
	return hasOwn(cache, key) ? cache[key] : (cache[key]= fun());
}
// TODO: third argument for handle `cache_tmp` in re-render
signal.el= function(s, map){
	const mark_start= el.mark({ type: "reactive" }, true);
	const mark_end= mark_start.end;
	const out= env.D.createDocumentFragment();
	out.append(mark_start, mark_end);
	const { current }= scope;
	let cache= {};
	const reRenderReactiveElement= v=> {
		if(!mark_start.parentNode || !mark_end.parentNode) // === `isConnected` or wasn’t yet rendered
			return removeSignalListener(s, reRenderReactiveElement);
		let cache_tmp= cache; // will be reused in the useCache or removed in the while loop on the end
		cache= {};
		scope.push(current);
		let els= map(v, function useCache(key, fun){
			return cache[key]= memo(key, fun, cache_tmp);
		});
		cache_tmp= {};
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
	reRenderReactiveElement(s());
	current.host(on.disconnected(()=>
		/*! This clears memoized elements in S.el when the host is disconnected */
		cache= {}));
	return out;
};
function requestCleanUpReactives(host){
	if(!host || !host[key_reactive]) return;
	(requestIdleCallback || setTimeout)(function(){
		host[key_reactive]= host[key_reactive]
			.filter(([ s, el ])=> el.isConnected ? true : (removeSignalListener(...s), false));
	});
}
import { observedAttributes } from "../helpers.js";
const observedAttributeActions= {
	_set(value){ this.value= value; },
};
function observedAttribute(store){
	return function(instance, name){
		const varS= (...args)=> !args.length
			? read(varS)
			: instance.setAttribute(name, ...args);
		const out= toSignal(varS, instance.getAttribute(name), observedAttributeActions);
		store[name]= out;
		return out;
	};
}
const key_attributes= "__dde_attributes";
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
export const signals_config= {
	isSignal,
	processReactiveAttribute(element, key, attrs, set){
		if(!isSignal(attrs)) return attrs;
		const l= attr=> {
			if(!element.isConnected)
				return removeSignalListener(attrs, l);
			set(key, attr);
		};
		addSignalListener(attrs, l);
		removeSignalsFromElements(attrs, l, element, key);
		return attrs();
	}
};
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

const cleanUpRegistry = new FinalizationRegistry(function(s){
	signal.clear({ [mark]: s });
});
function create(is_readonly, value, actions){
	const varS= is_readonly
		? ()=> read(varS)
		: (...value)=> value.length ? write(varS, ...value) : read(varS);
	const SI= toSignal(varS, value, actions, is_readonly);
	cleanUpRegistry.register(SI, SI[mark]);
	return SI;
}
const protoSigal= Object.assign(Object.create(null), {
	stopPropagation(){
		this.skip= true;
	}
});
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
		value: {
			value, actions, onclear, host,
			listeners: new Set(),
			defined: (new SignalDefined()).stack,
			readonly
		},
		enumerable: false,
		writable: false,
		configurable: true
	});
	s.toJSON= ()=> s();
	s.valueOf= ()=> s[mark] && s[mark].value;
	Object.setPrototypeOf(s[mark], protoSigal);
	return s;
}
function currentContext(){
	return stack_watch[stack_watch.length - 1];
}
function read(s){
	if(!s[mark]) return;
	const { value, listeners }= s[mark];
	const context= currentContext();
	if(context) listeners.add(context);
	if(deps.has(context)) deps.get(context).add(s);
	return value;
}
function write(s, value, force){
	const M= s[mark];
	if(!M || (!force && M.value===value)) return;

	M.value= value;
	queueSignalWrite(s);
	return value;
}

function addSignalListener(s, listener){
	if(!s[mark]) return;
	return s[mark].listeners.add(listener);
}
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
