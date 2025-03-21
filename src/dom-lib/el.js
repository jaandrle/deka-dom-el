import { signals } from "../signals-lib/common.js";
import { enviroment as env } from './common.js';
import { isInstance, isUndef, oAssign } from "../helpers.js";

/**
 * Queues a promise, this is helpful for crossplatform components (on server side we can wait for all registered
 * promises to be resolved before rendering).
 * @param {Promise} promise - Promise to process
 * @returns {Promise} Processed promise
 */
export function queue(promise){ return env.q(promise); }

/**
 * Chainable append function for elements
 * @private
 */
function append(...els){ this.appendOriginal(...els); return this; }

/**
 * Makes an element's append method chainable. NOTE: following chainableAppend implementation is OK as the
 * ElementPrototype.append description already is { writable: true, enumerable: true, configurable: true }
 * @param {Element} el - Element to modify
 * @returns {Element} Modified element
 */
export function chainableAppend(el){
	if(el.append===append) return el; el.appendOriginal= el.append; el.append= append; return el;
}
/** Current namespace for element creation */
let namespace;

import { scope } from "./scopes.js";
/**
 * Creates a DOM element with specified tag, attributes and addons
 *
 * @param {string|Function} tag - Element tag name or component function
 * @param {Object|string|number} [attributes] - Element attributes
 * @param {...Function} addons - Functions to call with the created element
 * @returns {Element|DocumentFragment} Created element
 */
export function createElement(tag, attributes, ...addons){
	/* jshint maxcomplexity: 16 */
	const s= signals(this);
	let scoped= 0;
	let el, el_host;
	const att_type= typeof attributes;
	if(att_type==="string" || att_type==="number" || s.isSignal(attributes))
		attributes= { textContent: attributes };
	switch(true){
		case typeof tag==="function": {
			scoped= 1;
			const host= (...c)=> !c.length ? el_host :
				(scoped===1 ? addons.unshift(...c) : c.forEach(c=> c(el_host)), undefined);
			scope.push({ scope: tag, host });
			el= /** @type {Element} */(tag(attributes || undefined));
			if(el.nodeName==="#comment") break;
			const is_fragment= isInstance(el, env.F);
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

/**
 * Creates a marker comment for elements
 *
 * @param {{ type: "component"|"reactive"|"later", name?: string, host?: "this"|"parentElement" }} attrs - Marker
 * attributes
 * @param {boolean} [is_open=false] - Whether the marker is open-ended
 * @returns {Comment} Comment node marker
 */
createElement.mark= function(attrs, is_open= false){
	attrs= Object.entries(attrs).map(([ n, v ])=> n+`="${v}"`).join(" ");
	const end= is_open ? "" : "/";
	const out= env.D.createComment(`<dde:mark ${attrs}${env.ssr}${end}>`);
	if(is_open) out.end= env.D.createComment("</dde:mark>");
	return out;
};
/** Alias for createElement */
export { createElement as el };

//TODO?: const namespaceHelper= ns=> ns==="svg" ? "http://www.w3.org/2000/svg" : ns;
/**
 * Creates a namespaced element creation function
 *
 * @param {string} ns - Namespace URI
 * @returns {Function} Element creation function for the namespace
 */
export function createElementNS(ns){
	const _this= this;
	return function createElementNSCurried(...rest){
		namespace= ns;
		const el= createElement.call(_this, ...rest);
		namespace= undefined;
		return el;
	};
}

/** Alias for createElementNS */
export { createElementNS as elNS };

/** Store for element assignment contexts */
const assign_context= new WeakMap();
const { setDeleteAttr }= env;

/**
 * Assigns attributes to an element
 *
 * @param {Element} element - Element to assign attributes to
 * @param {...Object} attributes - Attribute objects to assign
 * @returns {Element} The element with attributes assigned
 */
export function assign(element, ...attributes){
	if(!attributes.length) return element;
	assign_context.set(element, assignContext(element, this));

	for(const [ key, value ] of Object.entries(oAssign({}, ...attributes)))
		assignAttribute.call(this, element, key, value);
	assign_context.delete(element);
	return element;
}
import { setDelete } from "./helpers.js";
/**
 * Assigns a single attribute to an element
 *
 * @param {Element} element - Element to assign attribute to
 * @param {string} key - Attribute name
 * @param {any} value - Attribute value
 * @returns {any} Result of the attribute assignment
 */
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
	if("className"===key) key= "class";//NOTE: just optimalization, this makes `isPropSetter` returns false immediately // editorconfig-checker-disable-line
	switch(key){
		case "xlink:href":
			return setRemoveAttr(key, value, "http://www.w3.org/1999/xlink");
		case "textContent": //NOTE: just optimalization, this makes `isPropSetter` returns false immediately (as its part of Node ⇒ deep for `isPropSetter`) // editorconfig-checker-disable-line
			return setDeleteAttr(element, key, value);
		case "style":
			if(typeof value!=="object") break;
			/* falls through */
		case "dataset":
			return forEachEntries(s, key, element, value, setDelete.bind(null, element[key]));
		case "ariaset":
			return forEachEntries(s, key, element, value, (key, val)=> setRemoveAttr("aria-"+key, val));
		case "classList":
			return classListDeclarative.call(_this, element, value);
	}
	return isPropSetter(element, key) ? setDeleteAttr(element, key, value) : setRemoveAttr(key, value);
}
import { setRemove, setRemoveNS } from "./helpers.js";
/**
 * Gets or creates assignment context for an element
 *
 * @param {Element} element - Element to get context for
 * @param {Object} _this - Context object
 * @returns {Object} Assignment context
 * @private
 */
function assignContext(element, _this){
	if(assign_context.has(element)) return assign_context.get(element);
	const is_svg= isInstance(element, env.S);
	const setRemoveAttr= (is_svg ? setRemoveNS : setRemove).bind(null, element, "Attribute");
	const s= signals(_this);
	return { setRemoveAttr, s };
}
/**
 * Applies a declarative classList object to an element
 *
 * @param {Element} element - Element to apply classes to
 * @param {Object} toggle - Object with class names as keys and boolean values
 * @returns {Element} The element with classes applied
 */
export function classListDeclarative(element, toggle){
	const s= signals(this);
	forEachEntries(s, "classList", element, toggle,
		(class_name, val)=>
			element.classList.toggle(class_name, val===-1 ? undefined : Boolean(val)) );
	return element;
}

//TODO: add cache? `(Map/Set)<el.tagName+key,isUndef>`
/**
 * Checks if a property can be set on an element
 *
 * @param {Element} el - Element to check
 * @param {string} key - Property name
 * @returns {boolean} Whether the property can be set
 * @private
 */
function isPropSetter(el, key){
	if(!(key in el)) return false;
	const des= getPropDescriptor(el, key);
	return !isUndef(des.set);
}

/**
 * Gets a property descriptor from a prototype chain
 *
 * @param {Object} p - Prototype object
 * @param {string} key - Property name
 * @returns {PropertyDescriptor} Property descriptor
 * @private
 */
function getPropDescriptor(p, key){
	p= Object.getPrototypeOf(p);
	if(!p) return {};
	const des= Object.getOwnPropertyDescriptor(p, key);
	if(!des) return getPropDescriptor(p, key);
	return des;
}

/**
 * @template {Record<any, any>} T
 * @param {object} s
 * @param {string} target
 * @param {Element} element
 * @param {T} obj
 * @param {(param: [ keyof T, T[keyof T] ])=> void} cb
 * */
function forEachEntries(s, target, element, obj, cb){
	const S = String;
	if(typeof obj !== "object" || obj===null) return;
	return Object.entries(obj).forEach(function process([ key, val ]){
		if(!key) return;
		key = new S(key);
		key.target = target;
		val= s.processReactiveAttribute(element, key, val, cb);
		cb(key, val);
	});
}
