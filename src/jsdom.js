let keys= [];
export function register(dom){
	const window= dom.window;
	if(!keys.length)
		keys= Object.getOwnPropertyNames(window).filter((k) => !k.startsWith('_') && !(k in globalThis));
	keys.forEach(key=> globalThis[key]= window[key]);
	global.document= window.document
	global.window= window
	window.console= global.console
	return import("../index.js");
}
