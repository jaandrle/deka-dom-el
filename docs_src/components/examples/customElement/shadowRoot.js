import {
	el,
	customElementRender,
	customElementWithDDE,
} from "deka-dom-el";
function ddeComponent(){
	return el().append(
		el("p", { className: "red" }).append(
			"Hello from ", el("slot", "Custom Element"), "!"
		)
	);
}

export class A extends HTMLElement{
	static tagName= "custom-element-without";
	connectedCallback(){
		customElementRender(
			this,
			this,
			ddeComponent
		);
	}
}
customElementWithDDE(A);
customElements.define(A.tagName, A);
export class B extends HTMLElement{
	static tagName= "custom-element-open";
	connectedCallback(){
		customElementRender(
			this,
			this.attachShadow({ mode: "open" }),
			ddeComponent
		);
	}
}
customElementWithDDE(B);
customElements.define(B.tagName, B);
export class C extends HTMLElement{
	static tagName= "custom-element-closed";
	connectedCallback(){
		customElementRender(
			this,
			this.attachShadow({ mode: "closed" }),
			ddeComponent
		);
	}
}
customElementWithDDE(C);
customElements.define(C.tagName, C);

document.body.append(
	el("style", `
		.red{ color: red; }
	`),
	el(A.tagName).append("Without shadowRoot"),
	el("hr"),
	el(B.tagName).append("Open shadowRoot"),
	el("hr"),
	el(C.tagName).append("Closed shadowRoot"),
);
