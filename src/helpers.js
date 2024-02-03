export const hasOwn= (...a)=> Object.prototype.hasOwnProperty.call(...a);
export function isUndef(value){ return typeof value==="undefined"; }
export function typeOf(v){
	const t= typeof v;
	if(t!=="object") return t;
	if(v===null) return "null";
	return Object.prototype.toString.call(v);
}
export function onAbort(signal, listener){
	if(!signal || !(signal instanceof AbortSignal))
		return true;
	if(signal.aborted)
		return;
	signal.addEventListener("abort", listener);
	return function cleanUp(){
		signal.removeEventListener("abort", listener);
	};
}
export function observedAttributes(instance, observedAttribute){
	const { observedAttributes= [] }= instance.constructor;
	return observedAttributes
		.reduce(function(out, name){
			out[kebabToCamel(name)]= observedAttribute(instance, name);
			return out;
		}, {});
}
function kebabToCamel(name){ return name.replace(/-./g, x=> x[1].toUpperCase()); }
