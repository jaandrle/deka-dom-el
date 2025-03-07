import { JSDOM } from "jsdom";
const html_default= "<!doctype html><html lang=\"en\"><head><meta charset=\"utf-8\"></head><body></body></html>";
let keys= [];
let dom= null;
import { relative } from 'node:path';
import { writeFileSync } from 'node:fs';
/** @param {string} html */
export function createHTMl(html, options= {}){
	if(!html) html= html_default;
	if(dom) cleanHTML();
	// set a default url if we don't get one - otherwise things explode when we copy localstorage keys
	if (!('url' in options)) { Object.assign(options, { url: 'http://localhost:3000' }) }

	dom= new JSDOM(html, options);
	const window= dom.window;
	return {
		dom,
		writeToFS({ html, css }){
			if(css) this.style.writeToFile(css, relative(html, css).slice(1));
			if(html) writeFileSync(html, dom.serialize());
		},
		/** @param {string[]} [names] */
		registerGlobally(...names){
			keys.push(...names);
			if(!keys.length)
				keys= Object.getOwnPropertyNames(window).filter((k) => !k.startsWith('_') && !(k in globalThis));
			keys.forEach(key=> globalThis[key]= window[key]);
			globalThis.document= window.document
			globalThis.window= window
			window.console= globalThis.console
			return this;
		},
		serialize(){ return dom.serialize(); },
		window, document: window.document
	};
}
export function cleanHTML(){
	if(!dom) return;
	keys.forEach(key=> delete globalThis[key]);
	keys.length= 0;
	dom= false;
}
