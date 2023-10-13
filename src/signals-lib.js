export const mark= Symbol.for("Signal");

export function isSignal(candidate){
	try{ return Reflect.has(candidate, mark); }
	catch(e){ return false; }
}
/** @type {WeakMap<function,Set<ddeSignal<any, any>>>} */
const deps= new WeakMap();
export function S(value, actions){
	if(typeof value!=="function")
		return create(value, actions);
	if(isSignal(value)) return value;
	
	const out= create("");
	const context= ()=> out(value());
	deps.set(context, new Set([ out ]));
	watch(context);
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
import { on } from "./events.js";
import { scope } from "./dom.js";
S.attribute= function(name, initial= undefined){
	const { host }= scope;
	const value= host() && host().hasAttribute(name) ? host().getAttribute(name) : initial;
	const ac= new AbortController();
	const out= S(value, {
		[S.symbols.onclear](){ ac.abort(); }
	});
	scope.host(on.attributeChanged(function attributeChangeToSignal({ detail }){
		const [ name_c, value ]= detail;
		if(name_c!==name) return;
		out(value);
	}, { signal: ac.signal }));
	return out;
};
S.clear= function(...signals){
	for(const signal of signals){
		Reflect.deleteProperty(signal, "toJSON");
		const s= signal[mark];
		const { onclear }= S.symbols;
		if(s.actions && s.actions[onclear])
			s.actions[onclear].call(s);
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
S.el= function(signal, map){
	const mark_start= document.createComment("<#reactive>");
	const mark_end= document.createComment("</#reactive>");
	const out= document.createDocumentFragment();
	out.append(mark_start, mark_end);
	const reRenderReactiveElement= v=> {
		if(!mark_start.parentNode || !mark_end.parentNode)
			return removeSignalListener(signal, reRenderReactiveElement);
		let els= map(v);
		if(!Array.isArray(els))
			els= [ els ];
		let el_r= mark_start;
		while(( el_r= mark_start.nextSibling ) !== mark_end)
			el_r.remove();
		mark_start.after(...els);
	};
	addSignalListener(signal, reRenderReactiveElement);
	const { current }= scope;
	if(!current.prevent)
		current.host(on.disconnected(()=>
			/*! Clears `S.el` signal listener in current scope when not needed. */
			removeSignalListener(signal, reRenderReactiveElement)));
	reRenderReactiveElement(signal());
	return out;
};

import { typeOf } from './helpers.js';
export const signals_config= {
	isSignal,
	processReactiveAttribute(_, key, attrs, assignNth){
		if(!isSignal(attrs)) return attrs;
		const l= attr=> assignNth([ key, attr ]);
		addSignalListener(attrs, l);
		const { current }= scope;
		if(!current.prevent)
			current.host(on.disconnected(()=>
				/*! Clears signal listener for attribute in `assign` in current scope when not needed. */
				removeSignalListener(attrs, l)));
		return attrs();
	}
};

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
function toSignal(signal, value, actions){
	if(typeOf(actions)!=="[object Object]")
		actions= {};
	signal[mark]= {
		value, actions,
		listeners: new Set()
	};
	signal.toJSON= ()=> signal();
	Object.setPrototypeOf(signal[mark], protoSigal);
	return signal;
}

/** @type {function[]} */
const stack_watch= [];
function watch(context){
	const contextReWatch= function(){
		stack_watch.push(contextReWatch);
		context();
		stack_watch.pop();
	};
	//reassign deps as final context is contextReWatch
	if(deps.has(context)){ deps.set(contextReWatch, deps.get(context)); deps.delete(context); }
	contextReWatch();
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
function removeSignalListener(signal, listener){
	if(!signal[mark]) return;
	return signal[mark].listeners.delete(listener);
}
