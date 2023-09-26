import { el } from "../../index.js";
import { S } from "../../signals.js";
const { hasOwnProperty }= Object.prototype;

const store= attrsPropsToSignals([ "test" ]);
/**
 * Compatible with `npx-wca test/components/webComponent.js`
 * */
export class CustomHTMLTestElement extends HTMLElement{
	static get observedAttributes(){
		return [ "name", "pre-name" ];
	}
	connectedCallback(){
		this.attachShadow({ mode: "open" }).append(
			customElementRender(this, store.toRender(this), this.render)
		);
	}

	render({ name, test, preName }, host){
		host(on.connected(console.log));
		return el("p").append(
			el("#text", { textContent: name }),
			el("#text", { textContent: test }),
			el("#text", { textContent: preName }),
		);
	}
}
// https://gist.github.com/WebReflection/ec9f6687842aa385477c4afca625bbf4
customElementsAssign(
	CustomHTMLTestElement,
	reflectObservedAttributes,
	lifecycleToEvents(false),
	store.connect
);
customElements.define("custom-test", CustomHTMLTestElement);

function customElementRender(_this, attrs, render){
	const host= (...a)=> a.length ? a[0](_this) : _this;
	return render(attrs, host);
}
/** @returns {HTMLElement} */
function customElementsAssign(class_base, ...automatize){
	automatize.forEach(a=> a(class_base));
}
function reflectObservedAttributes(c){
	for(const name of c.observedAttributes){
		const name_camel= name.replace(/([a-z])-([a-z])/g, (_, l, r)=> l+r.toUpperCase());
		if(hasOwnProperty.call(c.prototype, name_camel))
			continue;
		Reflect.defineProperty(c.prototype, name_camel, {
			get(){ return this.getAttribute(name); },
			set(value){ this.setAttribute(name, value); }
		});
	}
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
	const store_attrs= new WeakMap();
	const store_props= new WeakMap();
	return {
		toRender(target){
			const out= {};
			const sattrs= get(store_attrs, target);
			target.constructor.observedAttributes.forEach(function(name){
				const name_camel= name.replace(/([a-z])-([a-z])/g, (_, l, r)=> l+r.toUpperCase());
				if(!hasOwnProperty.call(sattrs, name)) sattrs[name]= S(undefined);
				out[name_camel]= sattrs[name];
			});
			const sprops= get(store_props, target);
			props.forEach(p=> !hasOwnProperty.call(sprops, p) && (sprops[p]= S(undefined)));
			return Object.assign(out, sprops);
		},
		connect(c){
			wrapMethod(c.prototype, "attributeChangedCallback", function(target, thisArg, detail){
				const [ name, _, value ]= detail;
				const s= get(store_attrs, thisArg);
				if(s[name]) s[name](value);
				else s[name]= S(value);
				
				target.apply(thisArg, detail);
			});
			for(const name of props){
				Reflect.defineProperty(c.prototype, name, {
					get(){
						const s= get(store_props, this);
						if(s[name]) return s[name]();
					},
					set(value){
						const s= get(store_props, this);
						if(s[name]) s[name](value);
						else s[name]= S(value);
					}
				});
			}
		}
	};
	function get(store, t){
		if(store.has(t)) return store.get(t);
		const s= {};
		store.set(t, s);
		return s;
	}
}
function wrapMethod(obj, method, apply){
	obj[method]= new Proxy(obj[method] || (()=> {}), { apply });
}
