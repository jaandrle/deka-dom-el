import { signals } from "./signals-common.js";

/** @type {"html"|"svg"|string} */
let namespace_curr= "html";
export function namespace(namespace){
	namespace_curr= namespace==="svg" ? "http://www.w3.org/2000/svg" : namespace;
	return {
		append(...el){
			namespace_curr= "html";
			if(el.length===1) return el[0];
			const f= document.createDocumentFragment();
			return f.append(...el);
		}
	};
}
export function createElement(tag, attributes, ...connect){
	const s= signals(this);
	let el;
	//TODO Array.isArray(tag) ⇒ set key (cache els)
	if(Object(attributes)!==attributes || s.isSignal(attributes))
		attributes= { textContent: attributes };
	switch(true){
		case typeof tag==="function": {
			const ref= c=> c ? (connect.unshift(c), undefined) : el;
			el= tag(attributes || undefined, ref);
			break;
		}
		case tag==="#text":           el= assign(document.createTextNode(""), attributes); break;
		case tag==="<>":              el= assign(document.createDocumentFragment(), attributes); break;
		case namespace_curr!=="html": el= assign(document.createElementNS(namespace_curr, tag), attributes); break;
		case !el:                     el= assign(document.createElement(tag), attributes);
	}
	connect.forEach(c=> c(el));
	return el;
}
export { createElement as el };

import { prop_process } from './dom-common.js';
const { setDeleteAttr }= prop_process;
export function assign(element, ...attributes){
	const _this= this;
	const s= signals(this);
	if(!attributes.length) return element;
	const is_svg= element instanceof SVGElement;
	const setRemoveAttr= (is_svg ? setRemoveNS : setRemove).bind(null, element, "Attribute");
	
	/* jshint maxcomplexity:17 */
	Object.entries(Object.assign({}, ...attributes)).forEach(function assignNth([ key, attr ]){
		attr= s.processReactiveAttribute(element, key, attr, assignNth);
		const [ k ]= key;
		if("="===k) return setRemoveAttr(key.slice(1), attr);
		if("."===k) return setDelete(element, key.slice(1), attr);
		if(/(aria|data)([A-Z])/.test(key)){
			key= key.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
			return setRemoveAttr(key, attr);
		}
		if("className"===key) key= "class";
		switch(key){
			case "href": case "src": case "class": case "xlink:href":
				return setRemoveAttr(key, attr, "http://www.w3.org/1999/xlink");
			case "textContent": case "innerText":
				if(!is_svg) return setDeleteAttr(element, key, attr);
				return element.appendChild(document.createTextNode(attr));
			case "style": case "dataset":
				return forEachEntries(s, attr, setDelete.bind(null, element[key]));
			case "ariaset":
				return forEachEntries(s, attr, (key, val)=> setRemoveAttr("aria-"+key, val));
			case "classList":
				return classListDeclarative.call(_this, element, attr);
		}
		return isPropSetter(element, key) ? setDeleteAttr(element, key, attr) : setRemoveAttr(key, attr);
	});
	return element;
}
export function classListDeclarative(element, toggle){
	const s= signals(this);
	forEachEntries(s, toggle,
		(class_name, val)=>
			element.classList.toggle(class_name, val===-1 ? undefined : Boolean(val)));
	return element;
}
export function empty(el){
	Array.from(el.children).forEach(el=> el.remove());
	return el;
}
import { isUndef } from "./helpers.js";
function isPropSetter(el, key){
	if(!Reflect.has(el, key)) return false;
	const des= getPropDescriptor(el, key);
	return !isUndef(des.set);
}
function getPropDescriptor(p, key, level= 0){
	p= Object.getPrototypeOf(p);
	if(!p) return {};
	const des= Object.getOwnPropertyDescriptor(p, key);
	if(!des) return getPropDescriptor(p, key, level+1);
	return des;
}

/** @template {Record<any, any>} T @param {object} s @param {T} obj @param {(param: [ keyof T, T[keyof T] ])=> void} cb */
function forEachEntries(s, obj, cb){
	if(typeof obj !== "object") return;
	return Object.entries(obj).forEach(function process([ key, val ]){
		if(!key) return;
		val= s.processReactiveAttribute(obj, key, val, a=> cb(...a));
		cb(key, val);
	});
}

function attrArrToStr(attr){ return Array.isArray(attr) ? attr.filter(Boolean).join(" ") : attr; }
function setRemove(obj, prop, key, val){ return obj[ (isUndef(val) ? "remove" : "set") + prop ](key, attrArrToStr(val)); }
function setRemoveNS(obj, prop, key, val, ns= null){ return obj[ (isUndef(val) ? "remove" : "set") + prop + "NS" ](ns, key, attrArrToStr(val)); }
function setDelete(obj, key, val){ Reflect.set(obj, key, val); if(!isUndef(val)) return; return Reflect.deleteProperty(obj, key); }
