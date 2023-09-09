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
