export const mark= Symbol.for("signal");

export function isSignal(candidate){
	try{ return Reflect.has(candidate, mark); }
	catch(e){ return false; }
}
export function valueOfSignal(signal){
	return signal[mark].value;
}
export function toSignal(signal, value){
	signal[mark]= {
		value,
		listeners: new Set()
	};
	return signal;
}

export function addSignalListener(signal, listener){
	return signal[mark].listeners.add(listener);
}
export function removeSignalListener(signal, listener){
	return signal[mark].listeners.delete(listener);
}
