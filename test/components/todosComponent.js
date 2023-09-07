import { style, el, on, S } from '../exports.js';
const className= style.host(todosComponent).css`
	:host{
		display: flex;
		flex-flow: column nowrap;
	}
	:host input{
		margin-inline-start: .5em;
	}
	:host button{
		margin-inline-start: 1em;
	}
`;
/** @param {{ todos: string[] }} */
export function todosComponent({ todos= [ "A" ] }= {}){
	const todosS= S([], {
		/** @param {string} v */
		add(v){ this.value.push(S(v)); },
		/** @param {number} i */
		remove(i){ this.value.splice(i, 1); },
		[S.symbols.onclear](){ S.clear(...this.value); },
	});
	todos.forEach(v=> S.action(todosS, "add", v));
	console.log(todosS); //TODO
	const name= "todoName";
	const onsubmitAdd= on("submit", event=> {
		const value= event.target.elements[name].value;
		if(!value) return;
		
		event.preventDefault();
		S.action(todosS, "add", value);
		event.target.elements[name].value= "";
	});
	const onremove= on("remove", event=>
		S.action(todosS, "remove", event.detail));
	
	const ul_todos= el("ul").append(
		el("<>", todosS,
			ts=> ts.map((t, i)=> el(todoComponent, { textContent: t, value: i, className }, onremove))
	));
	return el("div", { className }).append(
		el("div").append(
			el("h2", "Todos:"),
			el("h3", "List of todos:"),
			el("<>", todosS, ts=> !ts.length
				? el("p", "No todos yet")
				: ul_todos)
		),
		el("form", null, onsubmitAdd).append(
			el("h3", "Add a todo:"),
			el("label", "New todo: ").append(
				el("input", { name, type: "text", required: true }),
			),
			el("button", "+")
		)
	)
}
/**
 * @type {ddeFires<[ "click" ]>}
 * @param {{
 *	textContent: string | ddeSignal<string, any>
 *	value: number
 * }}
 * */
function todoComponent({ textContent, value }){
	const ref= S();
	const onclick= on("click", event=> {
		const value= Number(event.target.value);
		event.preventDefault();
		event.stopPropagation();
		ref().dispatchEvent(new CustomEvent("remove", { detail: value }));
	});
	return el("li", null, ref).append(
		el("#text", textContent),
		el("button", { type: "button", value, textContent: "-" }, onclick)
	);
}
