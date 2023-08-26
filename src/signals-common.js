import { typeOf } from './helpers.js';
export const signals= {
	isReactiveAtrribute(attr, key){ return false; },
	isTextContent(attributes){ return typeOf(attributes)!=="[object Object]"; },
	process(key, attr, assignNth){ return false; },
	on(signal, listener){ return false; },
	off(signal, listener){ return false; },
	reactiveElement(attributes, ...connect){ return document.createDocumentFragment(); }
};
export function registerReactivity(def){
	return Object.assign(signals, def);
}
