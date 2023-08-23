import { el, elNS, assign, listen, dispatch } from "../index.js";
Object.assign(globalThis, { el, elNS, assign, listen, dispatch });

const { style, css }= createStyle();
globalThis.test= console.log;
const app= el(component, null, listen("change", globalThis.test));
dispatch("change", "Peter")(app);
console.log(app, app instanceof HTMLDivElement);

document.head.append(style);
document.body.append(app);

function component({ value= "World" }= {}){
	const name= "naiveForm";
	css`
		.${name}{
			display: flex;
			flex-flow: column nowrap;
		}
		.${name} input{
			margin-inline-start: .5em;
		}
	`;
	
	const output= (function(){
		const element= el("strong", { textContent: value });
		return {
			element,
			onchange: listen("change", function(event){
				assign(element, { textContent: event.target.value });
			})
		}
	})();
	const input= (function(){
		const element= el("input", { type: "text", value }, output.onchange);
		return {
			element,
			onchange: listen("change", function(event){
				assign(element, { value: event.detail });
				dispatch("change")(element);
			})
		};
	})();
	return el("div", { className: name }, input.onchange).append(
		el("p").append(
			el("#text", { textContent: "Hello " }),
			output.element,
		),
		el("label").append(
			el("#text", { textContent: "Set name:" }),
			input.element
		)
	)
}
function createStyle(){
	const style= el("style");
	return {
		style,
		css(...args){
			style.appendChild(el("#text", { textContent: String.raw(...args) }));
		}
	};
}
