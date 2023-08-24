const mark= Symbol.for("signal");
export function isSignal(candidate){
	try{
		return Reflect.has(candidate, mark);
	} catch(e){
		return false;
	}
}
export function S(signal, ...value){
	if(typeof signal==="function"){
		const out= create();
		watch(()=> S(out, signal()));
		return out;
	}
	if(!isSignal(signal))
		return create(signal);
	
	if(value.length===0)
		return read(signal);
	return write(signal, value[0]);
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
	if(typeof value==="object" && value!==null)
		return Object.fromEntries(
			Object.entries(value)
			.map(([ key, value ])=> [ key, create(value) ])
		);
	return {
		[mark]: true,
		value,
		listeners: new Set()
	};
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
