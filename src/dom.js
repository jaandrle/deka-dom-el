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
	if(s.isTextContent(attributes))
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

import { prop_cache, prop_process } from './dom-common.js';
const { setDelete }= prop_process;
export function assign(element, ...attributes){
	const s= signals(this);
	if(!attributes.length) return element;
	const is_svg= element instanceof SVGElement;
	const setRemoveAttr= (is_svg ? setRemoveNS : setRemove).bind(null, element, "Attribute");
	
	/* jshint maxcomplexity:16 */
	Object.entries(Object.assign({}, ...attributes)).forEach(function assignNth([ key, attr ]){
		attr= s.processReactiveAttribute(element, key, attr, assignNth);
		const [ k ]= key;
		if("="===k) return setRemoveAttr(key.slice(1), attr);
		if("."===k) return setDelete(element, key.slice(1), attr);
		if(typeof attr === "object"){
			switch(key){
				case "style":		return forEachEntries(attr, setRemove.bind(null, element.style, "Property"));
				case "dataset":		return forEachEntries(attr, setDelete.bind(null, element.dataset));
				case "ariaset":		return forEachEntries(attr, (key, val)=> setRemoveAttr("aria-"+key, val));
				case "classList":	return classListDeclarative(element, attr);
				default:			return Reflect.set(element, key, attr);
			}
		}
		if(/(aria|data)([A-Z])/.test(key)){
			key= key.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
			return setRemoveAttr(key, attr);
		}
		switch(key){
			case "href" || "src":
				return setRemoveAttr(key, attr);
			case "xlink:href":
				return setRemoveAttr(key, attr, "http://www.w3.org/1999/xlink");
			case "textContent" || "innerText":
				if(!is_svg) break;
				return element.appendChild(document.createTextNode(attr));
		}
		return isPropSetter(element, key) ? setDelete(element, key, attr) : setRemoveAttr(key, attr);
	});
	return element;
}
export function classListDeclarative(element, toggle){
	if(typeof toggle !== "object") return element;
	
	forEachEntries(toggle,
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
	const cache_key_he= "HTMLElement,"+key;
	if(el instanceof HTMLElement && prop_cache.has(cache_key_he))
		return prop_cache.get(cache_key_he);
	const cache_key= el.nodeName+","+key;
	if(prop_cache.has(cache_key)) return prop_cache.get(cache_key);
	const [ des, level, p ]= getPropDescriptor(el, key);
	const is_set= !isUndef(des.set);
	if(!is_set || level)
		prop_cache.set(p===HTMLElement.prototype ? cache_key_he : cache_key, is_set);
	return is_set;
}
function getPropDescriptor(p, key, level= 0){
	p= Object.getPrototypeOf(p);
	if(!p) return [ {}, level, p ];
	const des= Object.getOwnPropertyDescriptor(p, key);
	if(!des) return getPropDescriptor(p, key, level+1);
	return [ des, level, p ];
}

/** @template {Record<any, any>} T  @param {T} obj @param {(param: [ keyof T, T[keyof T] ])=> void} cb */
function forEachEntries(obj, cb){ return Object.entries(obj).forEach(([ key, val ])=> cb(key, val)); }

function setRemove(obj, prop, key, val){ return obj[ (isUndef(val) ? "remove" : "set") + prop ](key, val); }
function setRemoveNS(obj, prop, key, val, ns= null){ return obj[ (isUndef(val) ? "remove" : "set") + prop + "NS" ](ns, key, val); }
