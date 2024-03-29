export const mark= "__dde_observable";
import { hasOwn } from "./helpers.js";

export function isObservable(candidate){
	try{ return hasOwn(candidate, mark); }
	catch(e){ return false; }
}
/** @type {function[]} */
const stack_watch= [];
/**
 * ### `WeakMap<function, Set<ddeObservable<any, any>>>`
 * The `Set` is in the form of `[ source, ...depended observables (DSs) ]`.
 * When the DS is cleaned (`O.clear`) it is removed from DSs,
 * if remains only one (`source`) it is cleared too.
 * ### `WeakMap<object, function>`
 * This is used for revesed deps, the `function` is also key for `deps`.
 * @type {WeakMap<function|object,Set<ddeObservable<any, any>>|function>}
 * */
const deps= new WeakMap();
export function observable(value, actions){
	if(typeof value!=="function")
		return create(false, value, actions);
	if(isObservable(value)) return value;
	
	const out= create(true);
	const contextReWatch= function(){
		const [ origin, ...deps_old ]= deps.get(contextReWatch);
		deps.set(contextReWatch, new Set([ origin ]));

		stack_watch.push(contextReWatch);
		write(out, value());
		stack_watch.pop();

		if(!deps_old.length) return;
		const deps_curr= deps.get(contextReWatch);
		for (const dep_observable of deps_old){
			if(deps_curr.has(dep_observable)) continue;
			removeObservableListener(dep_observable, contextReWatch);
		}
	};
	deps.set(out[mark], contextReWatch);
	deps.set(contextReWatch, new Set([ out ]));
	contextReWatch();
	return out;
}
export { observable as O };
observable.action= function(o, name, ...a){
	const s= o[mark], { actions }= s;
	if(!actions || !(name in actions))
		throw new Error(`'${o}' has no action with name '${name}'!`);
	actions[name].apply(s, a);
	if(s.skip) return (delete s.skip);
	s.listeners.forEach(l=> l(s.value));
};
observable.on= function on(o, listener, options= {}){
	const { signal: as }= options;
	if(as && as.aborted) return;
	if(Array.isArray(o)) return o.forEach(s=> on(s, listener, options));
	addObservableListener(o, listener);
	if(as) as.addEventListener("abort", ()=> removeObservableListener(o, listener));
	//TODO cleanup when observable removed
};
observable.symbols= {
	//observable: mark,
	onclear: Symbol.for("Observable.onclear")
};
observable.clear= function(...observables){
	for(const o of observables){
		const s= o[mark];
		if(!s) continue;
		delete o.toJSON;
		s.onclear.forEach(f=> f.call(s));
		clearListDeps(o, s);
		delete o[mark];
	}
	function clearListDeps(o, s){
		s.listeners.forEach(l=> {
			s.listeners.delete(l);
			if(!deps.has(l)) return;
			
			const ls= deps.get(l);
			ls.delete(o);
			if(ls.size>1) return;
			
			o.clear(...ls);
			deps.delete(l);
		});
	}
};
const key_reactive= "__dde_reactive";
import { enviroment as env } from "./dom-common.js";
import { el } from "./dom.js";
import { scope } from "./dom.js";
// TODO: third argument for handle `cache_tmp` in re-render
observable.el= function(o, map){
	const mark_start= el.mark({ type: "reactive" }, true);
	const mark_end= mark_start.end;
	const out= env.D.createDocumentFragment();
	out.append(mark_start, mark_end);
	const { current }= scope;
	let cache= {};
	const reRenderReactiveElement= v=> {
		if(!mark_start.parentNode || !mark_end.parentNode) // === `isConnected` or wasn’t yet rendered
			return removeObservableListener(o, reRenderReactiveElement);
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
	addObservableListener(o, reRenderReactiveElement);
	removeObservablesFromElements(o, reRenderReactiveElement, mark_start, map);
	reRenderReactiveElement(o());
	return out;
};
function requestCleanUpReactives(host){
	if(!host || !host[key_reactive]) return;
	(requestIdleCallback || setTimeout)(function(){
		host[key_reactive]= host[key_reactive]
			.filter(([ o, el ])=> el.isConnected ? true : (removeObservableListener(...o), false));
	});
}
import { on } from "./events.js";
import { observedAttributes } from "./helpers.js";
const observedAttributeActions= {
	_set(value){ this.value= value; },
};
function observedAttribute(store){
	return function(instance, name){
		const varO= (...args)=> !args.length
			? read(varO)
			: instance.setAttribute(name, ...args);
		const out= toObservable(varO, instance.getAttribute(name), observedAttributeActions);
		store[name]= out;
		return out;
	};
}
const key_attributes= "__dde_attributes";
observable.observedAttributes= function(element){
	const store= element[key_attributes]= {};
	const attrs= observedAttributes(element, observedAttribute(store));
	on.attributeChanged(function attributeChangeToObservable({ detail }){
		/*! This maps attributes to observables (`O.observedAttributes`).
			* Investigate `__dde_attributes` key of the element.*/
		const [ name, value ]= detail;
		const curr= this[key_attributes][name];
		if(curr) return observable.action(curr, "_set", value);
	})(element);
	on.disconnected(function(){
		/*! This removes all observables mapped to attributes (`O.observedAttributes`).
			* Investigate `__dde_attributes` key of the element.*/
		observable.clear(...Object.values(this[key_attributes]));
	})(element);
	return attrs;
};

import { typeOf } from './helpers.js';
export const observables_config= {
	isObservable,
	processReactiveAttribute(element, key, attrs, set){
		if(!isObservable(attrs)) return attrs;
		const l= attr=> {
			if(!element.isConnected)
				return removeObservableListener(attrs, l);
			set(key, attr);
		};
		addObservableListener(attrs, l);
		removeObservablesFromElements(attrs, l, element, key);
		return attrs();
	}
};
function removeObservablesFromElements(o, listener, ...notes){
	const { current }= scope;
	if(current.prevent) return;
	current.host(function(element){
		if(!element[key_reactive]){
			element[key_reactive]= [];
			on.disconnected(()=>
				/*!
				 * Clears all Observables listeners added in the current scope/host (`O.el`, `assign`, …?).
				 * You can investigate the `__dde_reactive` key of the element.
				 * */
				element[key_reactive].forEach(([ [ o, listener ] ])=>
					removeObservableListener(o, listener, o[mark] && o[mark].host && o[mark].host() === element))
			)(element);
		}
		element[key_reactive].push([ [ o, listener ], ...notes ]);
	});
}

function create(is_readonly, value, actions){
	const varO= is_readonly
		? ()=> read(varO)
		: (...value)=> value.length ? write(varO, ...value) : read(varO);
	return toObservable(varO, value, actions, is_readonly);
}
const protoSigal= Object.assign(Object.create(null), {
	stopPropagation(){
		this.skip= true;
	}
});
class ObservableDefined extends Error{
	constructor(){
		super();
		const [ curr, ...rest ]= this.stack.split("\n");
		const curr_file= curr.slice(curr.indexOf("@"), curr.indexOf(".js:")+4);
		this.stack= rest.find(l=> !l.includes(curr_file));
	}
}
function toObservable(o, value, actions, readonly= false){
	const onclear= [];
	if(typeOf(actions)!=="[object Object]")
		actions= {};
	const { onclear: ocs }= observable.symbols;
	if(actions[ocs]){
		onclear.push(actions[ocs]);
		delete actions[ocs];
	}
	const { host }= scope;
	Reflect.defineProperty(o, mark, {
		value: {
			value, actions, onclear, host,
			listeners: new Set(),
			defined: (new ObservableDefined()).stack,
			readonly
		},
		enumerable: false,
		writable: false,
		configurable: true
	});
	o.toJSON= ()=> o();
	o.valueOf= ()=> o[mark] && o[mark].value;
	Object.setPrototypeOf(o[mark], protoSigal);
	return o;
}
function currentContext(){
	return stack_watch[stack_watch.length - 1];
}
function read(o){
	if(!o[mark]) return;
	const { value, listeners }= o[mark];
	const context= currentContext();
	if(context) listeners.add(context);
	if(deps.has(context)) deps.get(context).add(o);
	return value;
}
function write(o, value, force){
	if(!o[mark]) return;
	const s= o[mark];
	if(!force && s.value===value) return;
	s.value= value;
	s.listeners.forEach(l=> l(value));
	return value;
}

function addObservableListener(o, listener){
	if(!o[mark]) return;
	return o[mark].listeners.add(listener);
}
function removeObservableListener(o, listener, clear_when_empty){
	const s= o[mark];
	if(!s) return;
	const out= s.listeners.delete(listener);
	if(clear_when_empty && !s.listeners.size){
		observable.clear(o);
		if(!deps.has(s)) return out;
		const c= deps.get(s);
		if(!deps.has(c)) return out;
		deps.get(c).forEach(sig=> removeObservableListener(sig, c, true));
	}
	return out;
}
