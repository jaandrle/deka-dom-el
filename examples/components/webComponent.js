import { el, scope } from "../../index.js";
import { S } from "../../signals.js";
const { hasOwnProperty }= Object.prototype;

/**
 * Compatible with `npx-wca test/components/webComponent.js`
 * */
export class CustomHTMLTestElement extends HTMLElement{
	static get observedAttributes(){
		return [ "name", "pre-name" ];
	}
	connectedCallback(){
		this.attachShadow({ mode: "open" }).append(
			customElementRender(this, this.render)
		);
	}

	render({ test }){
		console.log(scope.state);
		scope.host(on.connected(()=> console.log(CustomHTMLTestElement)));
		scope.host(on.attributeChanged(e=> console.log(e)));
		scope.host(on.disconnected(()=> console.log(CustomHTMLTestElement)));
		
		const name= S.attribute("name");
		const preName= S.attribute("pre-name");
		console.log({ name, test, preName});
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
	lifecycleToEvents,
);
customElements.define("custom-test", CustomHTMLTestElement);

function customElementRender(_this, render){
	scope.push({ scope: _this, host: (...a)=> a.length ? a[0](_this) : _this });
	const out= render(_this);
	scope.pop();
	return out;
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
function lifecycleToEvents(class_declaration){
	for (const name of [ "connected", "disconnected" ])
		wrapMethod(class_declaration.prototype, name+"Callback", function(target, thisArg, detail){
			target.apply(thisArg, detail);
			thisArg.dispatchEvent(new Event("dde:"+name));
		});
	const name= "attributeChanged";
	wrapMethod(class_declaration.prototype, name+"Callback", function(target, thisArg, detail){
		const [ attribute, , value ]= detail;
		thisArg.dispatchEvent(new CustomEvent("dde:"+name, {
			detail: [ attribute, value ]
		}));
		target.apply(thisArg, detail);
	});
	class_declaration.prototype.__dde_lifecycleToEvents= true;
}
function wrapMethod(obj, method, apply){
	obj[method]= new Proxy(obj[method] || (()=> {}), { apply });
}
