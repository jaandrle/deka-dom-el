export const observables_global= {
	isObservable(attributes){ return false; },
	processReactiveAttribute(obj, key, attr, set){ return attr; },
};
export function registerReactivity(def, global= true){
	if(global) return Object.assign(observables_global, def);
	Object.setPrototypeOf(def, observables_global);
	return def;
}
/** @param {unknown} _this @returns {typeof observables_global} */
export function observables(_this){
	return observables_global.isPrototypeOf(_this) && _this!==observables_global ? _this : observables_global;
}
