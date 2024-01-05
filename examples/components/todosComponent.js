import { style, el, dispatchEvent, on, O, scope } from '../exports.js';
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
	const todosS= O(todos.map(t=> O(t)), {
		add(v){ this.value.push(O(v)); },
		remove(i){ O.clear(this.value.splice(i, 1)[0]); }
	});

	const name= "todoName";
	const onsubmitAdd= on("submit", event=> {
		const el= event.target.elements[name];
		event.preventDefault();
		O.action(todosS, "add", el.value);
		el.value= "";
	});
	const onremove= on("remove", event=>
		O.action(todosS, "remove", event.detail));
	
	//TODO: Not supported because of connectionsChangesObserverConstructor→collectChildren!!!
	const ul_todos= el("ul").append(
		O.el(todosS, ts=> ts
			.map((textContent, value)=>
				el(todoComponent, { textContent, value, className }, onremove))
	));
	return el("div", { className }).append(
		el("div").append(
			el("h2", "Todos:"),
			el("h3", "List of todos:"),
			O.el(todosS, ts=> !ts.length
				? el("p", "No todos yet")
				: ul_todos
				//: el("ul").append(
				//	...ts.map((textContent, value)=>
				//		el(todoComponent, { textContent, value, className }, onremove))
				//)
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
			el("output", O(()=> JSON.stringify(todosS, null, "\t")))
		)
	)
}
/**
 * @dispatch {number} remove
 * */
function todoComponent({ textContent, value }){
	const { host }= scope;
	const onclick= on("click", event=> {
		const value= Number(event.target.value);
		event.preventDefault();
		event.stopPropagation();
		dispatchEvent("remove")(host(), value);
	});
	const is_editable= O(false);
	const onedited= on("change", ev=> {
		textContent(ev.target.value);
		is_editable(false);
	});
	return el("li").append(
		O.el(is_editable, is=> is
			? el("input", { value: textContent(), type: "text" }, onedited)
			: el("span", { textContent, onclick: is_editable.bind(null, true) }),
		),
		el("button", { type: "button", value, textContent: "-" }, onclick)
	);
}
