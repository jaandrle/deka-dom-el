import { chainableAppend, el, scope } from "deka-dom-el";
class Test {
	constructor(params){
		this._params= params;
	}
	render(){
		return el("div").append(
			this._params.textContent
		);
	}
}
document.body.append(
	elClass(Test, { textContent: "Hello World" })
);

function elClass(c, props, ...addons){
	let element, element_host;
	scope.push({
		scope: c, //just informative purposes
		host: (...c)=> c.length
		? (!element
			? addons.unshift(...c)
			: c.forEach(c=> c(element_host)), undefined)
		: element_host
	});
	const C= new c(props);
	element= C.render();
	const is_fragment= el instanceof DocumentFragment;
	const el_mark= el.mark({ //this creates html comment `<dde:mark …/>`
		type: "class-component",
		name: C.name,
		host: is_fragment ? "this" : "parentElement",
	});
	element.prepend(el_mark);
	if(is_fragment) element_host= el_mark;
	
	chainableAppend(element);
	addons.forEach(c=> c(element_host));
	scope.pop();
	return element;
}
