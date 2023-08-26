import { el, on, off } from "../index.js";
import { S } from "../src/signals.js";
//import { empty, namespace, on, dispatch } from "../index.js";
Object.assign(globalThis, { S, el, on, off });

const style= createStyle();
const app= el(todosComponent);
document.head.append(style.element);
document.body.append(app);

function todosComponent({ todos= [] }= {}){
	const className= "basicTodoForm";
	style.css`
		.${className}{
			display: flex;
			flex-flow: column nowrap;
		}
		.${className} input{
			margin-inline-start: .5em;
		}
	`;
	todos= S.reactive(todos);
	globalThis.__todos__= todos; //TODO
	const name= "todoName";
	const onsubmit= on("submit", event=> {
		const value= event.target.elements[name].value;
		if(!value) return;
		
		event.preventDefault();
		todos.push(value)
		event.target.elements[name].value= "";
	});
	const onremove= on("click", event=> {
		const value= Number(event.target.value);
		if(Number.isNaN(value)) return;
		event.preventDefault();
		todos.splice(value, 1);
	});
	
	return el("div", { className }).append(
		el("div").append(
			el("h1", "Todos:"),
			el("<>", todos, ts=> !ts.length
				? el("p", "No todos yet")
				: ts.map((t, i)=> el(todoComponent, { textContent: t, value: i, className }, onremove)))
		),
		el("form", null, onsubmit).append(
			el("h2", "Add:"),
			el("label", "New todo: ").append(
				el("input", { name, type: "text", required: true }),
			),
			el("button", "+")
		)
	)
}
function todoComponent({ textContent, className, value }){
	style.key(todoComponent).css`
		.${className} button{
			margin-inline-start: 1em;
		}
	`;
	return el("p").append(
		el("#text", textContent),
		el("button", { type: "button", value, textContent: "-" })
	);
}
function createStyle(){
	const element= el("style");
	const store= new WeakSet();
	return {
		element,
		key(k){
			if(store.has(k)) return { css: ()=> {} };
			store.add(k);
			return this;
		},
		css(...args){
			element.appendChild(el("#text", { textContent: String.raw(...args) }));
		}
	};
}
