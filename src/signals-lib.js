export const mark= Symbol.for("Signal");

export function isSignal(candidate){
	try{ return Reflect.has(candidate, mark); }
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
export function S(value, actions){
	if(typeof value!=="function")
		return create(value, actions);
	if(isSignal(value)) return value;
	
	const out= create();
	const contextReWatch= function(){
		const [ origin, ...deps_old ]= deps.get(contextReWatch);
		deps.set(contextReWatch, new Set([ origin ]));

		stack_watch.push(contextReWatch);
		out(value());
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
S.action= function(signal, name, ...a){
	const s= signal[mark], { actions }= s;
	if(!actions || !Reflect.has(actions, name))
		throw new Error(`'${signal}' has no action with name '${name}'!`);
	actions[name].apply(s, a);
	if(s.skip) return Reflect.deleteProperty(s, "skip");
	s.listeners.forEach(l=> l(s.value));
};
S.on= function on(signals, listener, options= {}){
	const { signal: as }= options;
	if(as && as.aborted) return;
	if(Array.isArray(signals)) return signals.forEach(s=> on(s, listener, options));
	addSignalListener(signals, listener);
	if(as) as.addEventListener("abort", ()=> removeSignalListener(signals, listener));
	//TODO cleanup when signal removed
};
S.symbols= {
	signal: mark,
	onclear: Symbol.for("Signal.onclear")
};
S.clear= function(...signals){
	for(const signal of signals){
		Reflect.deleteProperty(signal, "toJSON");
		const s= signal[mark];
		s.onclear.forEach(f=> f.call(s));
		clearListDeps(signal, s);
		Reflect.deleteProperty(signal, mark);
	}
	function clearListDeps(signal, s){
		s.listeners.forEach(l=> {
			s.listeners.delete(l);
			if(!deps.has(l)) return;
			
			const ls= deps.get(l);
			ls.delete(signal);
			if(ls.size>1) return;
			
			S.clear(...ls);
			deps.delete(l);
		});
	}
};
const key_reactive= "__dde_reactive";
import { el } from "./dom.js";
import { scope } from "./dom.js";
S.el= function(signal, map){
	const mark_start= el.mark({ type: "reactive" }, false);
	const mark_end= mark_start.end;
	const out= document.createDocumentFragment();
	out.append(mark_start, mark_end);
	const { current }= scope;
	const reRenderReactiveElement= v=> {
		if(!mark_start.parentNode || !mark_end.parentNode)
			return removeSignalListener(signal, reRenderReactiveElement);
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
	addSignalListener(signal, reRenderReactiveElement);
	removeSignalsFromElements(signal, reRenderReactiveElement, mark_start, map);
	reRenderReactiveElement(signal());
	return out;
};
import { on } from "./events.js";
const key_attributes= "__dde_attributes";
S.fromAttribute= function(element, name, value){
	if(!element[key_attributes]){ // needs registration
		element[key_attributes]= {};
		on.attributeChanged(function attributeChangeToSignal({ detail }){
			/*! This maps attributes to signals (`S.attribute`).
			 * Investigate `__dde_attributes` key of the element.*/
			const [ name, value ]= detail;
			const curr= element[key_attributes][name];
			if(curr) return curr(value);
		})(element);
		on.disconnected(function(){
			/*! This removes all signals mapped to attributes (`S.attribute`).
			 * Investigate `__dde_attributes` key of the element.*/
			S.clear(...Object.values(element[key_attributes]));
		})(element);
	}
	const store= element[key_attributes];
	const out= Reflect.has(store, name) ? Reflect.get(store, name) : (store[name]= S(value));
	return new Proxy(out, {
		apply(target, _, args){
			if(!args.length) return target();
			const value= args[0];
			return element.setAttribute(name, value);
		}
	});
};

import { typeOf } from './helpers.js';
export const signals_config= {
	isSignal,
	processReactiveAttribute(element, key, attrs, set){
		if(!isSignal(attrs)) return attrs;
		const l= attr=> set(key, attr);
		addSignalListener(attrs, l);
		removeSignalsFromElements(attrs, l, element, key);
		return attrs();
	}
};
function removeSignalsFromElements(signal, listener, ...notes){
	const { current }= scope;
	if(current.prevent) return;
	current.host(function(element){
		if(!element[key_reactive]){
			element[key_reactive]= [];
			on.disconnected(()=>
				/*!
				 * Clears all signals listeners added in the current scope/host (`S.el`, `assign`, …?).
				 * You can investigate the `__dde_reactive` key of the element.
				 * */
				element[key_reactive].forEach(([ [ signal, listener ] ])=>
					removeSignalListener(signal, listener, signal[mark]?.host() === element))
			)(element);
		}
		element[key_reactive].push([ [ signal, listener ], ...notes ]);
	});
}

function create(value, actions){
	const signal=  (...value)=>
		value.length ? write(signal, ...value) : read(signal);
	return toSignal(signal, value, actions);
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
function toSignal(signal, value, actions){
	const onclear= [];
	if(typeOf(actions)!=="[object Object]")
		actions= {};
	const { onclear: ocs }= S.symbols;
	if(actions[ocs]){
		onclear.push(actions[ocs]);
		Reflect.deleteProperty(actions, ocs);
	}
	const { host }= scope;
	Reflect.defineProperty(signal, mark, {
		value: {
			value, actions, onclear, host,
			listeners: new Set(),
			defined: new SignalDefined()
		},
		enumerable: false,
		writable: false,
		configurable: true
	});
	signal.toJSON= ()=> signal();
	Object.setPrototypeOf(signal[mark], protoSigal);
	return signal;
}
function currentContext(){
	return stack_watch[stack_watch.length - 1];
}
function read(signal){
	if(!signal[mark]) return;
	const { value, listeners }= signal[mark];
	const context= currentContext();
	if(context) listeners.add(context);
	if(deps.has(context)) deps.get(context).add(signal);
	return value;
}
function write(signal, value, force){
	if(!signal[mark]) return;
	const s= signal[mark];
	if(!force && s.value===value) return;
	s.value= value;
	s.listeners.forEach(l=> l(value));
	return value;
}

function addSignalListener(signal, listener){
	if(!signal[mark]) return;
	return signal[mark].listeners.add(listener);
}
function removeSignalListener(signal, listener, clear_when_empty){
	const s= signal[mark];
	if(!s) return;
	const out= s.listeners.delete(listener);
	if(clear_when_empty && !s.listeners.size){
		S.clear(signal);
		if(!deps.has(s)) return out;
		const c= deps.get(s);
		if(!deps.has(c)) return out;
		deps.get(c).forEach(sig=> removeSignalListener(sig, c, true));
	}
	return out;
}
