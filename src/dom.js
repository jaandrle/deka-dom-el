import { signals } from "./signals-common.js";
import { enviroment as env } from './dom-common.js';

/** @type {{ scope: object, prevent: boolean, host: function }[]} */
const scopes= [ {
	get scope(){ return  env.D.body; },
	host: c=> c ? c(env.D.body) : env.D.body,
	prevent: true,
} ];
export const scope= {
	get current(){ return scopes[scopes.length-1]; },
	get host(){ return this.current.host; },

	preventDefault(){
		const { current }= this;
		current.prevent= true;
		return current;
	},

	get state(){ return [ ...scopes ]; },
	push(s= {}){ return scopes.push(Object.assign({}, this.current, { prevent: false }, s)); },
	pushRoot(){ return scopes.push(scopes[0]); },
	pop(){
		if(scopes.length===1) return;
		return scopes.pop();
	},
};
// following chainableAppend implementation is OK as the ElementPrototype.append description already is { writable: true, enumerable: true, configurable: true } // editorconfig-checker-disable-line
function append(...els){ this.appendOriginal(...els); return this; }
export function chainableAppend(el){
	if(el.append===append) return el; el.appendOriginal= el.append; el.append= append; return el;
}
let namespace;
export function createElement(tag, attributes, ...addons){
	/* jshint maxcomplexity: 15 */
	const s= signals(this);
	let scoped= 0;
	let el, el_host;
	//TODO Array.isArray(tag) ⇒ set key (cache els)
	if(Object(attributes)!==attributes || s.isSignal(attributes))
		attributes= { textContent: attributes };
	switch(true){
		case typeof tag==="function": {
			scoped= 1;
			const host= (...c)=> !c.length ? el_host :
				(scoped===1 ? addons.unshift(...c) : c.forEach(c=> c(el_host)), undefined);
			scope.push({ scope: tag, host });
			el= tag(attributes || undefined);
			const is_fragment= el instanceof env.F;
			if(el.nodeName==="#comment") break;
			const el_mark= createElement.mark({
				type: "component",
				name: tag.name,
				host: is_fragment ? "this" : "parentElement",
			});
			el.prepend(el_mark);
			if(is_fragment) el_host= el_mark;
			break;
		}
		case tag==="#text":      el= assign.call(this, env.D.createTextNode(""), attributes); break;
		case tag==="<>" || !tag: el= assign.call(this, env.D.createDocumentFragment(), attributes); break;
		case Boolean(namespace): el= assign.call(this, env.D.createElementNS(namespace, tag), attributes); break;
		case !el:                el= assign.call(this, env.D.createElement(tag), attributes);
	}
	chainableAppend(el);
	if(!el_host) el_host= el;
	addons.forEach(c=> c(el_host));
	if(scoped) scope.pop();
	scoped= 2;
	return el;
}
import { hasOwn } from "./helpers.js";
/** @param {HTMLElement} element @param {HTMLElement} [root] */
export function simulateSlots(element, root, mapper){
	if(typeof root!=="object"){
		mapper= root;
		root= element;
	}
	const _default= Symbol.for("default");
	const slots= Array.from(root.querySelectorAll("slot"))
		.reduce((out, curr)=> Reflect.set(out, curr.name || _default, curr) && out, {});
	const has_d= hasOwn(slots, _default);
	element.append= new Proxy(element.append, {
		apply(orig, _, els){
			if(els[0]===root) return orig.apply(element, els);
			if(!els.length) return element;

			const d= env.D.createDocumentFragment();
			for(const el of els){
				if(!el || !el.slot){ if(has_d) d.append(el); continue; }
				const name= el.slot;
				const slot= slots[name];
				elementAttribute(el, "remove", "slot");
				if(!slot) continue;
				simulateSlotReplace(slot, el, mapper);
				Reflect.deleteProperty(slots, name);
			}
			if(has_d){
				slots[_default].replaceWith(d);
				Reflect.deleteProperty(slots, _default);
			}
			element.append= orig; //TODO: better memory management, but non-native behavior!
			return element;
		}
	});
	if(element!==root){
		const els= Array.from(element.childNodes);
		els.forEach(el=> el.remove());
		element.append(...els);
	}
	return root;
}
function simulateSlotReplace(slot, element, mapper){
	if(mapper) mapper(slot, element);
	try{ slot.replaceWith(assign(element, {
		className: [ element.className, slot.className ],
		dataset: { ...slot.dataset } })); }
	catch(_){ slot.replaceWith(element); }
}
/**
 * @param { { type: "component", name: string, host: "this" | "parentElement" } | { type: "reactive" | "later" } } attrs
 * @param {boolean} [is_open=false]
 * */
createElement.mark= function(attrs, is_open= false){
	attrs= Object.entries(attrs).map(([ n, v ])=> n+`="${v}"`).join(" ");
	const end= is_open ? "" : "/";
	const out= env.D.createComment(`<dde:mark ${attrs}${env.ssr}${end}>`);
	if(is_open) out.end= env.D.createComment("</dde:mark>");
	return out;
};
export { createElement as el };

//const namespaceHelper= ns=> ns==="svg" ? "http://www.w3.org/2000/svg" : ns;
export function createElementNS(ns){
	const _this= this;
	return function createElementNSCurried(...rest){
		namespace= ns;
		const el= createElement.call(_this, ...rest);
		namespace= undefined;
		return el;
	};
}
export { createElementNS as elNS };

const assign_context= new WeakMap();
const { setDeleteAttr }= env;
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
	const is_svg= element instanceof env.S;
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
export function elementAttribute(element, op, key, value){
	if(element instanceof env.H)
		return element[op+"Attribute"](key, value);
	return element[op+"AttributeNS"](null, key, value);
}
import { isUndef } from "./helpers.js";
//TODO add cache? `(Map/Set)<el.tagName+key,isUndef>`
function isPropSetter(el, key){
	if(!(key in el)) return false;
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

/**
 * @template {Record<any, any>} T @param {object} s @param {T} obj @param {(param: [ keyof T, T[keyof T] ])=> void} cb
 * */
function forEachEntries(s, obj, cb){
	if(typeof obj !== "object" || obj===null) return;
	return Object.entries(obj).forEach(function process([ key, val ]){
		if(!key) return;
		val= s.processReactiveAttribute(obj, key, val, cb);
		cb(key, val);
	});
}

function attrArrToStr(attr){ return Array.isArray(attr) ? attr.filter(Boolean).join(" ") : attr; }
function setRemove(obj, prop, key, val){
	return obj[ (isUndef(val) ? "remove" : "set") + prop ](key, attrArrToStr(val)); }
function setRemoveNS(obj, prop, key, val, ns= null){
	return obj[ (isUndef(val) ? "remove" : "set") + prop + "NS" ](ns, key, attrArrToStr(val)); }
function setDelete(obj, key, val){
	Reflect.set(obj, key, val); if(!isUndef(val)) return; return Reflect.deleteProperty(obj, key); }
