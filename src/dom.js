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
	let el, el_host;
	//TODO Array.isArray(tag) ⇒ set key (cache els)
	if(Object(attributes)!==attributes || s.isSignal(attributes))
		attributes= { textContent: attributes };
	switch(true){
		case typeof tag==="function": {
			scoped= 1;
			scope.push({ scope: tag, host: c=> c ? (scoped===1 ? connect.unshift(c) : c(el_host), undefined) : el_host });
			el= tag(attributes || undefined);
			const is_fragment= el instanceof DocumentFragment;
			const el_mark= document.createComment(`<dde:mark type="component" name="${tag.name}" host="${is_fragment ? "this" : "parentElement"}"/>`);
			el.prepend(el_mark);
			if(is_fragment) el_host= el_mark;
			break;
		}
		case tag==="#text":      el= assign.call(this, document.createTextNode(""), attributes); break;
		case tag==="<>" || !tag: el= assign.call(this, document.createDocumentFragment(), attributes); break;
		case namespace!=="html": el= assign.call(this, document.createElementNS(namespace, tag), attributes); break;
		case !el:                el= assign.call(this, document.createElement(tag), attributes);
	}
	if(!el_host) el_host= el;
	connect.forEach(c=> c(el_host));
	if(scoped) scope.pop();
	scoped= 2;
	return el;
}
export { createElement as el };

import { prop_process } from './dom-common.js';
const { setDeleteAttr }= prop_process;
const assign_context= new WeakMap();
export function assign(element, ...attributes){
	if(!attributes.length) return element;
	assign_context.set(element, assignContext(element, this));
	
	for(const [ key, value ] of Object.entries(Object.assign({}, ...attributes)))
		assignAttribute.call(this, element, key, value);
	assign_context.delete(element);
	return element;
}
export function assignAttribute(element, key, value){
	const { setRemoveAttr, s }= assignContext(element, this);
	const _this= this;
	
	value= s.processReactiveAttribute(element, key, value,
		(key, value)=> assignAttribute.call(_this, element, key, value));
	const [ k ]= key;
	if("="===k) return setRemoveAttr(key.slice(1), value);
	if("."===k) return setDelete(element, key.slice(1), value);
	if(/(aria|data)([A-Z])/.test(key)){//TODO: temporal as aria* exists in Element for some browsers
		key= key.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
		return setRemoveAttr(key, value);
	}
	if("className"===key) key= "class";//just optimalization, `isPropSetter` returns false immediately
	switch(key){
		case "xlink:href":
			return setRemoveAttr(key, value, "http://www.w3.org/1999/xlink");
		case "textContent": //just optimalization, its part of Node ⇒ deep for `isPropSetter`
			return setDeleteAttr(element, key, value);
		case "style":
			if(typeof value!=="object") break;
			/* falls through */
		case "dataset":
			return forEachEntries(s, value, setDelete.bind(null, element[key]));
		case "ariaset":
			return forEachEntries(s, value, (key, val)=> setRemoveAttr("aria-"+key, val));
		case "classList":
			return classListDeclarative.call(_this, element, value);
	}
	return isPropSetter(element, key) ? setDeleteAttr(element, key, value) : setRemoveAttr(key, value);
}
function assignContext(element, _this){
	if(assign_context.has(element)) return assign_context.get(element);
	const is_svg= element instanceof SVGElement;
	const setRemoveAttr= (is_svg ? setRemoveNS : setRemove).bind(null, element, "Attribute");
	const s= signals(_this);
	return { setRemoveAttr, s };
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
		val= s.processReactiveAttribute(obj, key, val, cb);
		cb(key, val);
	});
}

function attrArrToStr(attr){ return Array.isArray(attr) ? attr.filter(Boolean).join(" ") : attr; }
function setRemove(obj, prop, key, val){ return obj[ (isUndef(val) ? "remove" : "set") + prop ](key, attrArrToStr(val)); }
function setRemoveNS(obj, prop, key, val, ns= null){ return obj[ (isUndef(val) ? "remove" : "set") + prop + "NS" ](ns, key, attrArrToStr(val)); }
function setDelete(obj, key, val){ Reflect.set(obj, key, val); if(!isUndef(val)) return; return Reflect.deleteProperty(obj, key); }
