export function listen(event, listener, options){
	return element=> element.addEventListener(event, listener, options);
}
export function dispatch(event, detail){
	if(typeof event === "string")
		event= typeof detail==="undefined" ? new Event(event) : new CustomEvent(event, { detail });
	return element=> element.dispatchEvent(event);
}
