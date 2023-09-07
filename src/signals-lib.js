export const mark= Symbol.for("Signal");

export function isSignal(candidate){
	try{ return Reflect.has(candidate, mark); }
	catch(e){ return false; }
}
export function S(value, actions){
	if(typeof value!=="function")
		return create(value, actions);
	if(isSignal(value)) return value;
	
	const out= create();
	watch(()=> out(value()));
	return out;
	//TODO for docs: is auto remove if used for args, if external listener needs also S.clear
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
		const s= signal[mark];
		const { onclear }= S.symbols;
		if(s.actions && s.actions[onclear])
			s.actions[onclear].call(s);
		s.listeners.clear();
		Reflect.deleteProperty(signal, mark);
	}
};

import { typeOf } from './helpers.js';
export const signals_config= {
	isReactiveAtrribute(attr, key){ return isSignal(attr); },
	isTextContent(attributes){
		return typeOf(attributes)==="string" || ( isSignal(attributes) && typeOf(valueOfSignal(attributes))==="string" );
	},
	processReactiveAttribute(_, key, attrS, assignNth){
		addSignalListener(attrS, attr=> assignNth([ key, attr ]));
		return attrS();
	},
	reactiveElement(signal, map){
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
		reRenderReactiveElement(signal());
		return out;
	}
};

function create(value, actions){
	const signal=  (...value)=>
		value.length ? write(signal, value[0]) : read(signal);
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
		listeners: new Set(),
	};
	Object.setPrototypeOf(signal[mark], protoSigal);
	return signal;
}

const stack_watch= [];
export function watch(context){
	const contextReWatch= function(){
		stack_watch.push(contextReWatch);
		context();
		stack_watch.pop();
	};
	stack_watch.push(contextReWatch);
	context();
	stack_watch.pop();
}
function currentContext(){
	return stack_watch[stack_watch.length - 1];
}
function read(signal){
	if(!signal[mark]) return;
	const { value, listeners }= signal[mark];
	const context= currentContext();
	if(context) listeners.add(context);
	return value;
}
function write(signal, value){
	if(!signal[mark]) return;
	const s= signal[mark];
	if(s.value===value) return;
	s.value= value;
	s.listeners.forEach(fn=> fn(value));
	return value;
}

function valueOfSignal(signal){
	return signal[mark].value;
}
function addSignalListener(signal, listener){
	return signal[mark].listeners.add(listener);
}
function removeSignalListener(signal, listener){
	return signal[mark].listeners.delete(listener);
}
