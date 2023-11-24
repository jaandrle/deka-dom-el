export const mark= Symbol.for("observable");

export function isObservable(candidate){
	try{ return Reflect.has(candidate, mark); }
	catch(e){ return false; }
}
/** @type {function[]} */
const stack_watch= [];
/**
 * ### `WeakMap<function, Set<ddeObservable<any, any>>>`
 * The `Set` is in the form of `[ source, ...depended observables (DSs) ]`.
 * When the DS is cleaned (`S.clear`) it is removed from DSs,
 * if remains only one (`source`) it is cleared too.
 * ### `WeakMap<object, function>`
 * This is used for revesed deps, the `function` is also key for `deps`.
 * @type {WeakMap<function|object,Set<ddeObservable<any, any>>|function>}
 * */
const deps= new WeakMap();
export function observable(value, actions){
	if(typeof value!=="function")
		return create(value, actions);
	if(isObservable(value)) return value;
	
	const out= create();
	const contextReWatch= function(){
		const [ origin, ...deps_old ]= deps.get(contextReWatch);
		deps.set(contextReWatch, new Set([ origin ]));

		stack_watch.push(contextReWatch);
		out(value());
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
observable.action= function(observable, name, ...a){
	const s= observable[mark], { actions }= s;
	if(!actions || !Reflect.has(actions, name))
		throw new Error(`'${observable}' has no action with name '${name}'!`);
	actions[name].apply(s, a);
	if(s.skip) return Reflect.deleteProperty(s, "skip");
	s.listeners.forEach(l=> l(s.value));
};
observable.on= function on(observables, listener, options= {}){
	const { observable: as }= options;
	if(as && as.aborted) return;
	if(Array.isArray(observables)) return observables.forEach(s=> on(s, listener, options));
	addObservableListener(observables, listener);
	if(as) as.addEventListener("abort", ()=> removeObservableListener(observables, listener));
	//TODO cleanup when observable removed
};
observable.symbols= {
	observable: mark,
	onclear: Symbol.for("Observable.onclear")
};
observable.clear= function(...observables){
	for(const observable of observables){
		Reflect.deleteProperty(observable, "toJSON");
		const s= observable[mark];
		s.onclear.forEach(f=> f.call(s));
		clearListDeps(observable, s);
		Reflect.deleteProperty(observable, mark);
	}
	function clearListDeps(observable, s){
		s.listeners.forEach(l=> {
			s.listeners.delete(l);
			if(!deps.has(l)) return;
			
			const ls= deps.get(l);
			ls.delete(observable);
			if(ls.size>1) return;
			
			observable.clear(...ls);
			deps.delete(l);
		});
	}
};
const key_reactive= "__dde_reactive";
import { el, elementAttribute } from "./dom.js";
import { scope } from "./dom.js";
observable.el= function(observable, map){
	const mark_start= el.mark({ type: "reactive" }, false);
	const mark_end= mark_start.end;
	const out= document.createDocumentFragment();
	out.append(mark_start, mark_end);
	const { current }= scope;
	const reRenderReactiveElement= v=> {
		if(!mark_start.parentNode || !mark_end.parentNode)
			return removeObservableListener(observable, reRenderReactiveElement);
		scope.push(current);
		let els= map(v);
		scope.pop();
		if(!Array.isArray(els))
			els= [ els ];
		let el_r= mark_start;
		while(( el_r= mark_start.nextSibling ) !== mark_end)
			el_r.remove();
		mark_start.after(...els);
	};
	addObservableListener(observable, reRenderReactiveElement);
	removeObservablesFromElements(observable, reRenderReactiveElement, mark_start, map);
	reRenderReactiveElement(observable());
	return out;
};
import { on } from "./events.js";
const key_attributes= "__dde_attributes";
observable.attribute= function(name, initial= null){
	//TODO host=element & reuse existing
	const out= O(initial);
	let element;
	scope.host(el=> {
		element= el;
		if(elementAttribute(element, "has", name)) out(elementAttribute(element, "get", name));
		else if(initial!==null) elementAttribute(element, "set", name, initial);
		
		if(el[key_attributes]){
			el[key_attributes][name]= out;
			return;
		}
		element[key_attributes]= { [name]: out };
		on.attributeChanged(function attributeChangeToObservable({ detail }){
			/*! This maps attributes to observables (`S.attribute`).
			 * Investigate `__dde_attributes` key of the element.*/
			const [ name, value ]= detail;
			const curr= element[key_attributes][name];
			if(curr) return curr(value);
		})(element);
		on.disconnected(function(){
			/*! This removes all observables mapped to attributes (`S.attribute`).
			 * Investigate `__dde_attributes` key of the element.*/
			O.clear(...Object.values(element[key_attributes]));
		})(element);
	});
	return new Proxy(out, {
		apply(target, _, args){
			if(!args.length) return target();
			const value= args[0];
			return elementAttribute(element, "set", name, value);
		}
	});
};

import { typeOf } from './helpers.js';
export const observables_config= {
	isObservable,
	processReactiveAttribute(element, key, attrs, set){
		if(!isObservable(attrs)) return attrs;
		const l= attr=> set(key, attr);
		addObservableListener(attrs, l);
		removeObservablesFromElements(attrs, l, element, key);
		return attrs();
	}
};
function removeObservablesFromElements(observable, listener, ...notes){
	const { current }= scope;
	if(current.prevent) return;
	current.host(function(element){
		if(!element[key_reactive]){
			element[key_reactive]= [];
			on.disconnected(()=>
				/*!
				 * Clears all Observables listeners added in the current scope/host (`S.el`, `assign`, …?).
				 * You can investigate the `__dde_reactive` key of the element.
				 * */
				element[key_reactive].forEach(([ [ observable, listener ] ])=>
					removeObservableListener(observable, listener, observable[mark]?.host() === element))
			)(element);
		}
		element[key_reactive].push([ [ observable, listener ], ...notes ]);
	});
}

function create(value, actions){
	const observable=  (...value)=>
		value.length ? write(observable, ...value) : read(observable);
	return toObservable(observable, value, actions);
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
function toObservable(observable, value, actions){
	const onclear= [];
	if(typeOf(actions)!=="[object Object]")
		actions= {};
	const { onclear: ocs }= O.symbols;
	if(actions[ocs]){
		onclear.push(actions[ocs]);
		Reflect.deleteProperty(actions, ocs);
	}
	const { host }= scope;
	Reflect.defineProperty(observable, mark, {
		value: {
			value, actions, onclear, host,
			listeners: new Set(),
			defined: new ObservableDefined()
		},
		enumerable: false,
		writable: false,
		configurable: true
	});
	observable.toJSON= ()=> observable();
	Object.setPrototypeOf(observable[mark], protoSigal);
	return observable;
}
function currentContext(){
	return stack_watch[stack_watch.length - 1];
}
function read(observable){
	if(!observable[mark]) return;
	const { value, listeners }= observable[mark];
	const context= currentContext();
	if(context) listeners.add(context);
	if(deps.has(context)) deps.get(context).add(observable);
	return value;
}
function write(observable, value, force){
	if(!observable[mark]) return;
	const s= observable[mark];
	if(!force && s.value===value) return;
	s.value= value;
	s.listeners.forEach(l=> l(value));
	return value;
}

function addObservableListener(observable, listener){
	if(!observable[mark]) return;
	return observable[mark].listeners.add(listener);
}
function removeObservableListener(observable, listener, clear_when_empty){
	const s= observable[mark];
	if(!s) return;
	const out= s.listeners.delete(listener);
	if(clear_when_empty && !s.listeners.size){
		observable.clear(observable);
		if(!deps.has(s)) return out;
		const c= deps.get(s);
		if(!deps.has(c)) return out;
		deps.get(c).forEach(sig=> removeObservableListener(sig, c, true));
	}
	return out;
}
