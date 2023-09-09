import { el } from "../../index.js";
import { S } from "../../src/signals.js";
Object.assign(S, {
	customElementParams(_this){
		console.log("zde");
		return getAttributes(_this);
	},
	customElementPrototype(cls){
	}
});

const store= new WeakMap();
/**
 * Compatible with `npx-wca test/components/webComponent.js`
 * @prop {string} test
 * */
class CustomHTMLTestElement extends HTMLElement{
	static get tagName(){
		return "custom-test";
	}
	static get observedAttributes(){
		return [ "name" ];
	}
	constructor(){
		super();
		customElementInit(this, this.attachShadow({ mode: "open" }));
	}
	connectedCallback(){
		customElementRender(this, render);
	}
}
S.customElementPrototype(CustomHTMLTestElement);
customElements.define(CustomHTMLTestElement.tagName, CustomHTMLTestElement);

function render({ name }, host){
	return el("p", name);
}
function customElementInit(_this, root= _this){
	const host= (...a)=> a.length ? a[0](_this) : _this;
	store.set(_this, { host, root });
}
function customElementRender(_this, render){
	const { host, root }= store.get(_this);
	const attrs= S.customElementParams ? S.customElementParams(_this) : getAttributes(_this);
	root.appendChild(render(attrs, host));
}
function getAttributes(_this){
	return Object.fromEntries(_this.getAttributeNames().map(n=> [ n, _this.getAttribute(n) ]));
}
