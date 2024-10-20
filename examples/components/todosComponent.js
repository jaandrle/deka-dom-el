import { style, el, dispatchEvent, on, S, scope } from '../exports.js';
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
	:host output{
		white-space: pre;
	}
`;
/** @param {{ todos: string[] }} */
export function todosComponent({ todos= [ "Task A" ] }= {}){
	let key= 0;
	const todosO= S(new Map(), {
		add(v){ this.value.set(key++, S(v)); },
		remove(key){ S.clear(this.value.get(key)); this.value.delete(key); }
	});
	todos.forEach(text=> S.action(todosO, "add", text));

	const name= "todoName";
	const onsubmitAdd= on("submit", event=> {
		const el= event.target.elements[name];
		event.preventDefault();
		S.action(todosO, "add", el.value);
		el.value= "";
	});
	const onremove= on("remove", event=>
		S.action(todosO, "remove", event.detail));
	
	return el("div", { className }).append(
		el("div").append(
			el("h2", "Todos:"),
			el("h3", "List of todos:"),
			S.el(todosO, (ts, memo)=> !ts.size
				? el("p", "No todos yet")
				: el("ul").append(
					...Array.from(ts).map(([ value, textContent ])=>
						memo(value, ()=> el(todoComponent, { textContent, value, className }, onremove)))
				)
			),
			el("p", "Click to the text to edit it.")
		),
		el("form", null, onsubmitAdd).append(
			el("h3", "Add a todo:"),
			el("label", "New todo: ").append(
				el("input", { name, type: "text", required: true }),
			),
			el("button", "+")
		),
		el("div").append(
			el("h3", "Output (JSON):"),
			el("output", S(()=> JSON.stringify(Array.from(todosO()), null, "\t")))
		)
	)
}
/**
 * @dispatchs {number} remove
 * */
function todoComponent({ textContent, value }){
	const { host }= scope;
	const onclick= on("click", event=> {
		const value= Number(event.target.value);
		event.preventDefault();
		event.stopPropagation();
		dispatchEvent("remove")(host(), value);
	});
	const is_editable= S(false);
	const onedited= on("change", ev=> {
		textContent(ev.target.value);
		is_editable(false);
	});
	return el("li").append(
		S.el(is_editable, is=> is
			? el("input", { value: textContent(), type: "text" }, onedited)
			: el("span", { textContent, onclick: is_editable.bind(null, true) })
		),
		el("button", { type: "button", value, textContent: "-" }, onclick)
	);
}
