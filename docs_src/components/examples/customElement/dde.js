import {
	customElementRender,
	customElementWithDDE,
} from "deka-dom-el";
export class HTMLCustomElement extends HTMLElement{
	static tagName= "custom-element";
	static observedAttributes= [ "attr" ];
	connectedCallback(){
		customElementRender(
			this,
			this.attachShadow({ mode: "open" }),
			ddeComponent
		);
	}
	set attr(value){ this.setAttribute("attr", value); }
	get attr(){ return this.getAttribute("attr"); }
}

import { el, on, scope } from "deka-dom-el";
function ddeComponent({ attr }){
	scope.host(
		on.connected(e=> console.log(e.target.outerHTML)),
	);
	return el().append(
		el("p", `Hello from Custom Element with attribute '${attr}'`)
	)
}
customElementWithDDE(HTMLCustomElement);
customElements.define(HTMLCustomElement.tagName, HTMLCustomElement);

document.body.append(
	el(HTMLCustomElement.tagName, { attr: "Attribute" })
);
