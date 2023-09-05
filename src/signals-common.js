import { typeOf } from './helpers.js';
export const signals_global= {
	isReactiveAtrribute(attr, key){ return false; },
	isTextContent(attributes){ return typeOf(attributes)!=="[object Object]"; },
	processReactiveAttribute(el, key, attr, assignNth){ return false; },
	reactiveElement(attributes, ...connect){ return document.createDocumentFragment(); }
};
export function registerReactivity(def, global= true){
	if(global) return Object.assign(signals_global, def);
	Object.setPrototypeOf(def, signals_global);
	return def;
}
export function signals(_this){
	return signals_global.isPrototypeOf(_this) && _this!==signals_global ? _this : signals_global;
}
