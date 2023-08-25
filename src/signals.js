const mark= Symbol.for("signal");
export function isSignal(candidate){
	try{ return Reflect.has(candidate, mark); }
	catch(e){ return false; }
}
export function addSignalListener(signal, listener){
	return signal[mark].listeners.add(listener);
}
export function S(value){
	if(typeof value!=="function")
		return create(value);
	if(isSignal(value)) return value;
	
	const out= create();
	watch(()=> out(value()));
	return out;
}
export function reactive(data){
	if(isSignal(data))
		return data;
	if(typeof data!=="object" || data===null)
		return create(data);
	
	let type;
	if(Array.isArray(data)){
		type= "array";
		data= data.map(v=> reactive(v));
	} else if(data.toString()!=="[object Object]"){
		return create(data);
	} else {
		type= "object";
		data= Object.fromEntries(
			Object.entries(data)
			.map(([ key, value ])=> [ key, reactive(value) ])
		);
	}
	const signal= (...value)=>
		value.length ? write(signal, reactive(value[0])) : read(signal[mark]);
	return createWrapObject(type, toSignal(signal, data));
}
const stack= [];
export function watch(context){
	stack.push(context);
	context();
	stack.pop();
};

function currentContext(){
	return stack[stack.length - 1];
}
function create(value){
	if(isSignal(value)) return value;
	const signal=  (...value)=>
		value.length ? write(signal, value[0]) : read(signal[mark]);
	return toSignal(signal, value);
}
function toSignal(signal, value){
	signal[mark]= {
		value,
		listeners: new Set()
	};
	return signal;
}
function createWrapObject(type, signal){
	return new Proxy(signal, {
		set(_, p, newValue){
			const s= signal[mark];
			if(p in s.value){
				const v= s.value[p];
				if(isSignal(v)) return v(newValue);
				return (s.value[p]= newValue);
			}
			const v= reactive(newValue);
			s.value[p]= v;
			s.listeners.forEach(fn=> fn(s.value));
			return v;
		},
		deleteProperty(_, p){
			const s= signal[mark];
			Reflect.deleteProperty(s.value, p);
			s.listeners.forEach(fn=> fn(s.value));
		},
		get(_, p){
			if(mark===p) return signal[mark];
			if("array"!==type || !(p in Array.prototype) || p==="length")
				return Reflect.get(signal[mark].value, p);
			return (...a)=> {
				const s= signal[mark];
				const result= Array.prototype[p].call(s.value, ...a);
				//TODO optimize!
				s.value.forEach((v, i)=> Reflect.set(s.value, i, reactive(v)));
				s.listeners.forEach(fn=> fn(s.value));
				return result;
			};
		}
	});
}
function read({ value, listeners }){
	const context= currentContext();
	if(context) listeners.add(context);
	return value;
}
function write(signal, value){
	signal[mark].value= value;
	signal[mark].listeners.forEach(fn=> fn(value))
}
