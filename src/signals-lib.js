export const mark= Symbol.for("Signal");

export function isSignal(candidate){
	try{ return Reflect.has(candidate, mark); }
	catch(e){ return false; }
}
/** @type {function[]} */
const stack_watch= [];
/** @type {WeakMap<function|ddeSignal<any, any>,Set<ddeSignal<any, any>>|function>} */
const deps= new WeakMap();
export function S(value, actions){
	if(typeof value!=="function")
		return create(value, actions);
	if(isSignal(value)) return value;
	
	const out= create();
	const contextReWatch= function(){
		stack_watch.push(contextReWatch);
		out(value());
		stack_watch.pop();
	};
	deps.set(contextReWatch, new Set([ out ]));
	deps.set(out[mark], contextReWatch);
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
	removeSignalsFromElements(signal, reRenderReactiveElement, mark_start, map);
	reRenderReactiveElement(signal());
	return out;
};

import { typeOf } from './helpers.js';
export const signals_config= {
	isSignal,
	processReactiveAttribute(_, key, attrs, set){
		if(!isSignal(attrs)) return attrs;
		const l= attr=> set(key, attr);
		addSignalListener(attrs, l);
		removeSignalsFromElements(attrs, l, _, key);
		return attrs();
	}
};
function removeSignalsFromElements(signal, listener, ...notes){
	const { current }= scope;
	if(current.prevent) return;
	const k= "__dde_reactive";
	current.host(function(element){
		if(!element[k]){
			element[k]= [];
			on.disconnected(()=>
				/*!
				 * Clears all signals listeners added in the current scope/host (`S.el`, `assign`, …?).
				* You can investigate the `__dde_reactive` key of the element.
				* */
				element[k].forEach(([ sl ])=> removeSignalListener(...sl, signal[mark]?.host() === element))
			)(element);
		}
		element[k].push([ [ signal, listener ], ...notes ]);
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
	signal[mark]= {
		value, actions, onclear, host,
		listeners: new Set()
	};
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
