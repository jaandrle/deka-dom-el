export class HTMLCustomElement extends HTMLElement{
	static tagName= "custom-element"; // just suggestion, we can use `el(HTMLCustomElement.tagName)`
	static observedAttributes= [ "custom-attribute" ];
	constructor(){
		super();
		// nice place to prepare custom element
	}
	connectedCallback(){
		// nice place to render custom element
	}
	attributeChangedCallback(name, oldValue, newValue){
		// listen to attribute changes (see `S.observedAttributes`)
	}
	disconnectedCallback(){
		// nice place to clean up
	}
	// for example, we can mirror get/set prop to attribute
	get customAttribute(){ return this.getAttribute("custom-attribute"); }
	set customAttribute(value){ this.setAttribute("custom-attribute", value); }
}
customElements.define(HTMLCustomElement.tagName, HTMLCustomElement);
