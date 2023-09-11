import { el } from "../../index.js";
import { S } from "../../src/signals.js";
const store= new WeakMap();
Object.assign(S, {
	customElementParams(_this){
		const observedProperties= store.get(_this.constructor).observedProperties;
		observedProperties.forEach(p=> _this[p]);
		return store.has(_this) ? store.get(_this) : getAttributes(_this);
	},
	customElementPrototype(cls){
	}
});

/**
 * Compatible with `npx-wca test/components/webComponent.js`
 * */
export class CustomHTMLTestElement extends HTMLElement{
	static get observedAttributes(){
		return [ "name" ];
	}
	connectedCallback(){
		customElementRender(this, this.attachShadow({ mode: "open" }), this.render);
	}

	render({ name, test }, host){
		host(on.connected(console.log));
		return el("p", { className: test, textContent: name });
	}
}
customElementsAssign(
	CustomHTMLTestElement,
	reflectObservedAttributes,
	lifecycleToEvents(true),
	attrsPropsToSignals([ "test" ])
);
customElements.define("custom-test", CustomHTMLTestElement);

function customElementRender(_this, root, render){
	const host= (...a)=> a.length ? a[0](_this) : _this;
	const attrs= S.customElementParams ? S.customElementParams(_this) : getAttributes(_this);
	root.appendChild(render(attrs, host));
}
function getAttributes(_this){
	return Object.fromEntries(_this.getAttributeNames().map(n=> [ n, _this.getAttribute(n) ]));
}
/** @returns {HTMLElement} */
function customElementsAssign(class_base, ...automatize){
	automatize.forEach(a=> a(class_base, getStore));
	function getStore(t){
		if(store.has(t)) return store.get(t);
		const s= {};
		store.set(t, s);
		return s;
	}
}
function reflectObservedAttributes(c){
	for(const name of c.observedAttributes)
		Reflect.defineProperty(c.prototype, name, {
			get(){ return this.getAttribute(name); },
			set(value){ this.setAttribute(name, value); }
		});
}
function lifecycleToEvents(is_attrs){
	return function(c){
		wrapMethod(c.prototype, "connectedCallback", function(target, thisArg, detail){
			target.apply(thisArg, detail);
			thisArg.dispatchEvent(new Event("dde:connected"));
		});
		wrapMethod(c.prototype, "disconnectedCallback", function(target, thisArg, detail){
			target.apply(thisArg, detail);
			thisArg.dispatchEvent(new Event("dde:disconnected"));
		});
		if(is_attrs)
			wrapMethod(c.prototype, "attributeChangedCallback", function(target, thisArg, detail){
				thisArg.dispatchEvent(new CustomEvent("dde:attribute", { detail }));
				target.apply(thisArg, detail);
			});
	};
}
function attrsPropsToSignals(props= []){
	return function(c, getStore){
		const store= getStore(c);
		store.observedProperties= props;
		wrapMethod(c.prototype, "attributeChangedCallback", function(target, thisArg, detail){
			const [ name, _, value ]= detail;
			const s= getStore(thisArg);
			if(s[name]) s[name](value);
			else s[name]= S(value);
			
			target.apply(thisArg, detail);
		});
		for(const name of props){
			Reflect.defineProperty(c.prototype, name, {
				get(){
					const s= getStore(this);
					if(s[name]) return s[name]();
					const out= S(undefined);
					s[name]= out;
					return out();
				},
				set(value){
					const s= getStore(this);
					if(s[name]) s[name](value);
					else s[name]= S(value);
				}
			});
		}
	};
}
function wrapMethod(obj, method, apply){
	obj[method]= new Proxy(obj[method] || (()=> {}), { apply });
}
