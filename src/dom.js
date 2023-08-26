import { signals } from "./signals-common.js";

let namespace_curr= "html";
export function namespace(namespace){
	namespace_curr= namespace==="svg" ? "http://www.w3.org/2000/svg" : namespace;
	return {
		append(el){ namespace_curr= "html"; return el; }
	};
}
export function createElement(tag, attributes, ...connect){
	let el;
	if("<>"===tag){
		if(signals.isReactiveAtrribute(attributes))
			return signals.reactiveElement(attributes, ...connect);
		el= document.createDocumentFragment();
	}
	if(signals.isTextContent(attributes))
		attributes= { textContent: attributes };
	switch(true){
		case typeof tag==="function": el= tag(attributes || undefined); break;
		case tag==="#text":           el= assign(document.createTextNode(""), attributes); break;
		case namespace_curr!=="html": el= assign(document.createElementNS(namespace_curr, tag), attributes); break;
		default:                      el= assign(document.createElement(tag), attributes);
	}
	connect.forEach(c=> c(el));
	return el;
}
export { createElement as el };

export function assign(element, ...attributes){
	if(!attributes.length) return element;
	const is_svg= element instanceof SVGElement;
	const setRemoveAttr= (is_svg ? setRemoveNS : setRemove).bind(null, element, "Attribute");
	
	Object.entries(Object.assign({}, ...attributes)).forEach(function assignNth([ key, attr ]){
		if(signals.isReactiveAtrribute(attr, key))
			attr= signals.process(key, attr, assignNth);
		if(key[0]==="=") return setRemoveAttr(key.slice(1), attr);
		if(key[0]===".") return setDelete(element, key.slice(1), attr);
		if(typeof attr === "object"){
			switch(key){
				case "style":		return forEachEntries(attr, setRemove.bind(null, element.style, "Property"))
				case "dataset":		return forEachEntries(attr, setDelete.bind(null, element.dataset));
				case "ariaset":		return forEachEntries(attr, (key, val)=> setRemoveAttr("aria-"+key, val));
				case "classList":	return classListDeclartive(element, attr);
				default:			return Reflect.set(element, key, attr);
			}
		}
		if(/(aria|data)([A-Z])/.test(key)){
			key= key.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
			return setRemoveAttr(key, attr);
		}
		switch(key){
			case "href" || "src" || "style":
				return setRemoveAttr(key, attr);
			case "xlink:href":
				return setRemoveAttr(key, attr, "http://www.w3.org/1999/xlink");
			case "textContent" || "innerText":
				if(!is_svg) break;
				return element.appendChild(document.createTextNode(attr));
		}
		if(key in element && !is_svg)
			return setDelete(element, key, attr);
		return setRemoveAttr(key, attr);
	});
	return element;
}
export function classListDeclartive(element, toggle){
	if(typeof toggle !== "object") return element;
	
	forEachEntries(toggle,
		(class_name, val)=>
			element.classList.toggle(class_name, val===-1 ? undefined : Boolean(val)))
	return element;
}

export function empty(el){ Array.from(el.children).forEach(el=> el.remove()); return el; }

function forEachEntries(obj, cb){ return Object.entries(obj).forEach(([ key, val ])=> cb(key, val)); }
function isUndef(value){ return typeof value==="undefined"; }

function setRemove(obj, prop, key, val){ return obj[ (isUndef(val) ? "remove" : "set") + prop ](key, val); }
function setRemoveNS(obj, prop, key, val, ns= null){ return obj[ (isUndef(val) ? "remove" : "set") + prop + "NS" ](ns, key, val); }
function setDelete(obj, prop, val){ return Reflect[ isUndef(val) ? "deleteProperty" : "set" ](obj, prop, val); }