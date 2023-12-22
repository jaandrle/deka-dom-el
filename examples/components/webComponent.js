import { el, on, customElementRender, customElementWithDDE, scope, simulateSlots } from "../../index.js";
import { O } from "../../observables.js";

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
		const name= O.attribute("name");
		const preName= O.attribute("pre-name");
		
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
customElementWithDDE(CustomHTMLTestElement);
customElements.define(CustomHTMLTestElement.tagName, CustomHTMLTestElement);

export class CustomSlottingHTMLElement extends HTMLElement{
	static tagName= "custom-slotting";
	render(){
		return simulateSlots(this, el().append(
			el("p").append(
				"Ahoj ", el("slot", { name: "name", className: "name", textContent: "World" })
			),
			el("p").append(
				"BTW ", el("slot")
			)
		));
	}
	connectedCallback(){
		this.append(customElementRender(this, this.render));
	}
}
customElementWithDDE(CustomSlottingHTMLElement);
customElements.define(CustomSlottingHTMLElement.tagName, CustomSlottingHTMLElement);
