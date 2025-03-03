import { el, on, customElementRender, customElementWithDDE, scope, simulateSlots } from "../../index.js";
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
		customElementRender(this.attachShadow({ mode: "open" }), this.render, this.attributes)
	}

	attributes(element){
		const observed= S.observedAttributes(element);
		return Object.assign({ test: element.test }, observed);
	}
	render({ name, preName, test }){
		console.log(scope.state);
		scope.host(
			on.connected(console.log),
			on.attributeChanged(e=> console.log(e)),
			on.disconnected(()=> console.log(CustomHTMLTestElement))
		);
		const text= text=> el().append(
			el("#text", text),
			" | "
		);
		return el("p").append(
			text(test),
			text(name),
			text(preName),
			el("button", { type: "button", textContent: "pre-name", onclick: ()=> preName.set("Ahoj") }),
			" | ",
			el("slot", { className: "test", name: "test" }),
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
		customElementRender(this, this.render);
	}
}
customElementWithDDE(CustomSlottingHTMLElement);
customElements.define(CustomSlottingHTMLElement.tagName, CustomSlottingHTMLElement);
