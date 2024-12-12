export const mark= "__dde_signal";
import { hasOwn } from "./helpers.js";

export function isSignal(candidate){
	try{ return hasOwn(candidate, mark); }
	catch(e){ return false; }
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
	const contextReWatch= function(){
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
	const M= s[mark], { actions }= M;
	if(!actions || !(name in actions))
		throw new Error(`'${s}' has no action with name '${name}'!`);
	actions[name].apply(M, a);
	if(M.skip) return (delete M.skip);
	M.listeners.forEach(l=> l(M.value));
};
signal.on= function on(s, listener, options= {}){
	const { signal: as }= options;
	if(as && as.aborted) return;
	if(Array.isArray(s)) return s.forEach(s=> on(s, listener, options));
	addSignalListener(s, listener);
	if(as) as.addEventListener("abort", ()=> removeSignalListener(s, listener));
	//TODO: cleanup when signal removed
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
import { enviroment as env } from "./dom-common.js";
import { el } from "./dom.js";
import { scope } from "./dom.js";
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
		const cache_tmp= cache; // will be reused in the useCache or removed in the while loop on the end
		cache= {};
		scope.push(current);
		let els= map(v, function useCache(key, fun){
			let value;
			if(hasOwn(cache_tmp, key)){
				value= cache_tmp[key];
				delete cache_tmp[key];
			} else
				value= fun();
			cache[key]= value;
			return value;
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
	reRenderReactiveElement(s());
	return out;
};
function requestCleanUpReactives(host){
	if(!host || !host[key_reactive]) return;
	(requestIdleCallback || setTimeout)(function(){
		host[key_reactive]= host[key_reactive]
			.filter(([ s, el ])=> el.isConnected ? true : (removeSignalListener(...s), false));
	});
}
import { on } from "./events.js";
import { observedAttributes } from "./helpers.js";
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
			* Investigate `__dde_attributes` key of the element.*/
		const [ name, value ]= detail;
		const curr= this[key_attributes][name];
		if(curr) return signal.action(curr, "_set", value);
	})(element);
	on.disconnected(function(){
		/*! This removes all signals mapped to attributes (`S.observedAttributes`).
			* Investigate `__dde_attributes` key of the element.*/
		signal.clear(...Object.values(this[key_attributes]));
	})(element);
	return attrs;
};

import { typeOf } from './helpers.js';
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
	if(current.prevent) return;
	current.host(function(element){
		if(!element[key_reactive]){
			element[key_reactive]= [];
			on.disconnected(()=>
				/*!
				 * Clears all Signals listeners added in the current scope/host (`S.el`, `assign`, …?).
				 * You can investigate the `__dde_reactive` key of the element.
				 * */
				element[key_reactive].forEach(([ [ s, listener ] ])=>
					removeSignalListener(s, listener, s[mark] && s[mark].host && s[mark].host() === element))
			)(element);
		}
		element[key_reactive].push([ [ s, listener ], ...notes ]);
	});
}

function create(is_readonly, value, actions){
	const varS= is_readonly
		? ()=> read(varS)
		: (...value)=> value.length ? write(varS, ...value) : read(varS);
	return toSignal(varS, value, actions, is_readonly);
}
const protoSigal= Object.assign(Object.create(null), {
	stopPropagation(){
		this.skip= true;
	}
});
class SignalDefined extends Error{
	constructor(){
		super();
		const [ curr, ...rest ]= this.stack.split("\n");
		const curr_file= curr.slice(curr.indexOf("@"), curr.indexOf(".js:")+4);
		this.stack= rest.find(l=> !l.includes(curr_file));
	}
}
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
	if(!s[mark]) return;
	const M= s[mark];
	if(!force && M.value===value) return;
	M.value= value;
	M.listeners.forEach(l=> l(value));
	return value;
}

function addSignalListener(s, listener){
	if(!s[mark]) return;
	return s[mark].listeners.add(listener);
}
function removeSignalListener(s, listener, clear_when_empty){
	const M= s[mark];
	if(!M) return;
	const out= M.listeners.delete(listener);
	if(clear_when_empty && !M.listeners.size){
		signal.clear(s);
		if(!deps.has(M)) return out;
		const c= deps.get(M);
		if(!deps.has(c)) return out;
		deps.get(c).forEach(sig=> removeSignalListener(sig, c, true));
	}
	return out;
}
