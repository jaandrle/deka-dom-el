import { el } from "deka-dom-el";
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

import { chainableAppend, scope } from "deka-dom-el";
function elClass(_class, attributes, ...addons){
	let element, element_host;
	scope.push({
		scope: _class, //just informative purposes
		host: (...addons_append)=> addons_append.length
			? (
				!element
				? addons.unshift(...addons_append)
				: addons_append.forEach(c=> c(element_host))
			, undefined)
			: element_host
	});
	const instance= new _class(attributes);
	element= instance.render();
	const is_fragment= element instanceof DocumentFragment;
	const el_mark= el.mark({ //this creates html comment `<dde:mark …/>`
		type: "class-component",
		name: _class.name,
		host: is_fragment ? "this" : "parentElement",
	});
	element.prepend(el_mark);
	if(is_fragment) element_host= el_mark;

	chainableAppend(element);
	addons.forEach(c=> c(element_host));
	scope.pop();
	return element;
}
