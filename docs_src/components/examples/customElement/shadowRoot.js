import {
	el,
	customElementRender,
	customElementWithDDE,
} from "deka-dom-el";
function ddeComponent(){
	return el().append(
		el("style", `
			.red{ color: firebrick; }
		`),
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
	el(A.tagName).append("Without shadowRoot"),
	el("hr"),
	el(B.tagName).append("Open shadowRoot"),
	el("hr"),
	el(C.tagName).append("Closed shadowRoot"),
	el("style", `
		.red{ color: crimson; }
	`),
);
console.log(A.tagName, "expect modifications");
document.body.querySelector(A.tagName).querySelector("p").textContent+= " (editable with JS)";
console.log(B.tagName, "expect modifications");
document.body.querySelector(B.tagName).shadowRoot.querySelector("p").textContent+= " (editable with JS)";
console.log(C.tagName, "expect error ↓");
document.body.querySelector(C.tagName).querySelector("p").textContent+= " (editable with JS)";
