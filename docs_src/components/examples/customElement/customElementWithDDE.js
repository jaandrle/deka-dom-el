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
on.connected( // preffered
	e=> console.log("Element connected to the DOM (v1):", e)
)(instance);
instance.addEventListener(
	"dde:connected",
	e=> console.log("Element connected to the DOM (v2):", e)
);
document.body.append(
	instance,
);
