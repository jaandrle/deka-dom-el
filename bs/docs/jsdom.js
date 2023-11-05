import { JSDOM } from "jsdom";
const html_default= "<!doctype html><html><head><meta charset=\"utf-8\"></head><body></body></html>";
let keys= [];
let dom= null;
import { relative } from 'node:path';
import { writeFileSync } from 'node:fs';
export function createHTMl(html, options= {}){
	if(!html) html= html_default;
	if(dom) cleanHTML();
	// set a default url if we don't get one - otherwise things explode when we copy localstorage keys
	if (!('url' in options)) { Object.assign(options, { url: 'http://localhost:3000' }) }
	
	dom= new JSDOM(html, options);
	const window= dom.window;
	if(!keys.length)
		keys= Object.getOwnPropertyNames(window).filter((k) => !k.startsWith('_') && !(k in globalThis));
	keys.forEach(key=> globalThis[key]= window[key]);
	globalThis.document= window.document
	globalThis.window= window
	window.console= globalThis.console
	return {
		dom,
		writeToFS({ html, css }){
			if(css) this.style.writeToFile(css, relative(html, css).slice(1));
			if(html) writeFileSync(html, dom.serialize());
		},
		serialize(){ return dom.serialize(); }
	};
}
export function cleanHTML(){
	if(!dom) return;
	keys.forEach(key=> delete globalThis[key]);
	dom= false;
}
