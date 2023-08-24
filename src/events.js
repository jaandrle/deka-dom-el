import { isSignal } from './signals.js';
export function listen(event, listener, options){
	if(isSignal(event)) return event.listeners.add(listener);
	return element=> element.addEventListener(event, listener, options);
}
export function dispatch(event, detail){
	if(typeof event === "string")
		event= typeof detail==="undefined" ? new Event(event) : new CustomEvent(event, { detail });
	return element=> element.dispatchEvent(event);
}
