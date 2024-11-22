import {
	customElementRender,
	customElementWithDDE,
	el,
	simulateSlots
} from "deka-dom-el";
export class HTMLCustomElement extends HTMLElement{
	static tagName= "custom-slotting";
	connectedCallback(){
		const c= ()=> simulateSlots(this, ddeComponent());
		customElementRender(this, this, c);
	}
}
customElementWithDDE(HTMLCustomElement);
customElements.define(HTMLCustomElement.tagName, HTMLCustomElement);

document.body.append(
	el(HTMLCustomElement.tagName),
	el(HTMLCustomElement.tagName).append(
		"Slot"
	),
	el(ddeComponentSlot),
	el(ddeComponentSlot).append(
		"Slot"
	),
);

function ddeComponent(){
	return el().append(
		el("p").append(
			"Hello ", el("slot", "World")
		)
	);
}
function ddeComponentSlot(){
	return simulateSlots(el().append(
		el("p").append(
			"Hello ", el("slot", "World")
		)
	));
}
