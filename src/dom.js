import { signals } from "./signals-common.js";

/** @type {{ scope: object, prevent: boolean, namespace: "html"|string, host: function }[]} */
const scopes= [ {
	scope: document.body,
	namespace: "html",
	host: c=> c ? c(document.body) : document.body,
	prevent: true
} ];
const namespaceHelper= ns=> ns==="svg" ? "http://www.w3.org/2000/svg" : ns;
export const scope= {
	get current(){ return scopes[scopes.length-1]; },
	get host(){ return this.current.host; },
	get namespace(){ return this.current.namespace; },
	set namespace(namespace){ return ( this.current.namespace= namespaceHelper(namespace)); },
	
	preventDefault(){
		const { current }= this;
		current.prevent= true;
		return current;
	},
	elNamespace(namespace){
		const ns= this.namespace;
		this.namespace= namespace;
		return {
			append(...els){
				scope.namespace= ns;
				if(els.length===1) return els[0];
				const f= document.createDocumentFragment();
				return f.append(...els);
			}
		};
	},
	
	get state(){ return [ ...scopes ]; },
	push(s= {}){
		if(s.namespace) s.namespace= namespaceHelper(s.namespace);
		return scopes.push(Object.assign({}, this.current, { prevent: false }, s));
	},
	pop(){ return scopes.pop(); },
};
export function createElement(tag, attributes, ...connect){
	const s= signals(this);
	const { namespace }= scope;
	let scoped= 0;
	let el;
	//TODO Array.isArray(tag) ⇒ set key (cache els)
	if(Object(attributes)!==attributes || s.isSignal(attributes))
		attributes= { textContent: attributes };
	switch(true){
		case typeof tag==="function": {
			scoped= 1;
			scope.push({ scope: tag, host: c=> c ? (scoped===1 ? connect.unshift(c) : c(el), undefined) : el });
			el= tag(attributes || undefined);
			(el instanceof HTMLElement ? setRemove : setRemoveNS)(el, "Attribute", "dde-fun", tag.name);
			break;
		}
		case tag==="#text":      el= assign.call(this, document.createTextNode(""), attributes); break;
		case tag==="<>":         el= assign.call(this, document.createDocumentFragment(), attributes); break;
		case namespace!=="html": el= assign.call(this, document.createElementNS(namespace, tag), attributes); break;
		case !el:                el= assign.call(this, document.createElement(tag), attributes);
	}
	connect.forEach(c=> c(el));
	if(scoped) scope.pop();
	scoped= 2;
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
	
	/* jshint maxcomplexity:13 */
	Object.entries(Object.assign({}, ...attributes)).forEach(function assignNth([ key, attr ]){
		attr= s.processReactiveAttribute(element, key, attr, assignNth);
		const [ k ]= key;
		if("="===k) return setRemoveAttr(key.slice(1), attr);
		if("."===k) return setDelete(element, key.slice(1), attr);
		if(/(aria|data)([A-Z])/.test(key)){//TODO: temporal as aria* exists in Element for some browsers
			key= key.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
			return setRemoveAttr(key, attr);
		}
		if("className"===key) key= "class";//just optimalization, `isPropSetter` returns false immediately
		switch(key){
			case "xlink:href":
				return setRemoveAttr(key, attr, "http://www.w3.org/1999/xlink");
			case "textContent": //just optimalization, its part of Node ⇒ deep for `isPropSetter`
				return setDeleteAttr(element, key, attr);
			case "style":
				if(typeof attr!=="object") break;
				/* falls through */
			case "dataset":
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
//TODO add cache? `Map<el.tagName+key,isUndef>`
function isPropSetter(el, key){
	if(!Reflect.has(el, key)) return false;
	const des= getPropDescriptor(el, key);
	return !isUndef(des.set);
}
function getPropDescriptor(p, key){
	p= Object.getPrototypeOf(p);
	if(!p) return {};
	const des= Object.getOwnPropertyDescriptor(p, key);
	if(!des) return getPropDescriptor(p, key);
	return des;
}

/** @template {Record<any, any>} T @param {object} s @param {T} obj @param {(param: [ keyof T, T[keyof T] ])=> void} cb */
function forEachEntries(s, obj, cb){
	if(typeof obj !== "object" || obj===null) return;
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
