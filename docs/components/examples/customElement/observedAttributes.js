import {
	customElementRender,
	customElementWithDDE,
	observedAttributes,
	el, on, scope,
} from "deka-dom-el";
import { S } from "deka-dom-el/signals";
export class HTMLCustomElement extends HTMLElement{
	static tagName= "custom-element";
	static observedAttributes= [ "attr" ];
	connectedCallback(){
		console.log(observedAttributes(this));
		customElementRender(
			this.attachShadow({ mode: "open" }),
			ddeComponent,
			S.observedAttributes
		);
	}
	set attr(value){ this.setAttribute("attr", value); }
	get attr(){ return this.getAttribute("attr"); }
}

/** @param {{ attr: ddeSignal<string, {}> }} props */
function ddeComponent({ attr }){
	scope.host(
		on.connected(e=> console.log(( /** @type {HTMLParagraphElement} */ (e.target)).outerHTML)),
	);
	return el().append(
		el("p", S(()=> `Hello from Custom Element with attribute '${attr()}'`))
	);
}
customElementWithDDE(HTMLCustomElement);
customElements.define(HTMLCustomElement.tagName, HTMLCustomElement);

document.body.append(
	el(HTMLCustomElement.tagName, { attr: "Attribute" })
);
setTimeout(
	()=> document.querySelector(HTMLCustomElement.tagName).setAttribute("attr", "New Value"),
	3*750
);
