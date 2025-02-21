export const signals_global= {
	isSignal(attributes){ return false; },
	processReactiveAttribute(obj, key, attr, set){ return attr; },
};
export function registerReactivity(def, global= true){
	if(global) return Object.assign(signals_global, def);
	Object.setPrototypeOf(def, signals_global);
	return def;
}
/** @param {unknown} _this @returns {typeof signals_global} */
export function signals(_this){
	return signals_global.isPrototypeOf(_this) && _this!==signals_global ? _this : signals_global;
}
