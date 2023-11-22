import { el, on, scope } from "../../index.js";
import { S } from "../../signals.js";

/**
 * Compatible with `npx -y web-component-analyzer examples/components/webComponent.js`
 * @element custom-test
 * */
export class CustomHTMLTestElement extends HTMLElement{
	static tagName= "custom-test";
	static get observedAttributes(){
		return [ "name", "pre-name" ];
	}
	connectedCallback(){
		if(!this.hasAttribute("pre-name")) this.setAttribute("pre-name", "default");
		this.attachShadow({ mode: "open" }).append(
			customElementRender(this, this.render)
		);
	}

	render({ test }){
		console.log(scope.state);
		scope.host(
			on.connected(()=> console.log(CustomHTMLTestElement)),
			on.attributeChanged(e=> console.log(e)),
			on.disconnected(()=> console.log(CustomHTMLTestElement))
		);
		const name= S.attribute("name");
		const preName= S.attribute("pre-name");
		
		console.log({ name, test, preName});
		return el("p").append(
			el("#text", name),
			el("#text", preName),
			el("button", { type: "button", textContent: "pre-name", onclick: ()=> preName("Ahoj") })
		);
	}
	test= "A";
	
	get name(){ return this.getAttribute("name"); }
	set name(value){ this.setAttribute("name", value); }
	/** @attr pre-name */
	get preName(){ return this.getAttribute("pre-name"); }
	set preName(value){ this.setAttribute("pre-name", value); }
}
// https://gist.github.com/WebReflection/ec9f6687842aa385477c4afca625bbf4
lifecycleToEvents(CustomHTMLTestElement)
customElements.define(CustomHTMLTestElement.tagName, CustomHTMLTestElement);

function customElementRender(_this, render, props= _this){
	console.log(_this.shadowRoot, _this.childList);
	scope.push({ scope: _this, host: (...c)=> c.length ? c.forEach(c=> c(_this)) : _this, custom_element: _this });
	if(typeof props==="function") props= props(_this);
	const out= render(props);
	scope.pop();
	return out;
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
	return class_declaration;
}
function wrapMethod(obj, method, apply){
	obj[method]= new Proxy(obj[method] || (()=> {}), { apply });
}
