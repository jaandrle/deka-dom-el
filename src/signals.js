const mark= Symbol.for("signal");
export function isSignal(candidate){
	try{ return Reflect.has(candidate, mark); }
	catch(e){ return false; }
}
export function S(signal){
	if(typeof signal!=="function")
		return create(signal);
	if(isSignal(signal)) return signal;
	
	const out= create();
	watch(()=> out(signal()));
	return out;
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
	
	if(typeof value==="object" && value!==null)
		//TODO Array?
		return Object.fromEntries(
			Object.entries(value)
			.map(([ key, value ])=> [ key, create(value) ])
		);
	const signal= (...value)=>
		value.length ? write(signal, value[0]) : read(signal);
	Object.assign(signal, {
		[mark]: true,
		value,
		listeners: new Set()
	});
	return signal;
}
function read({ value, listeners }){
	const context= currentContext();
	if(context) listeners.add(context);
	return value;
}
function write(signal, value){
	signal.value= value;
	signal.listeners.forEach(fn=> fn(value))
}
