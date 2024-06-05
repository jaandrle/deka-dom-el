import { customElementWithDDE, el, on } from "deka-dom-el";
export class HTMLCustomElement extends HTMLElement{
	static tagName= "custom-element";
	connectedCallback(){
		this.append(
			el("p", "Hello from custom element!")
		);
	}
}
customElementWithDDE(HTMLCustomElement);
customElements.define(HTMLCustomElement.tagName, HTMLCustomElement);

const instance= el(HTMLCustomElement.tagName);
on.connected(e=> console.log("Element connected to the DOM:", e))(instance);
document.body.append(
	instance,
);
