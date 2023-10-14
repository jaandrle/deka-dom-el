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
	const todosS= S(todos.map(t=> S(t)), {
		add(v){ this.value.push(S(v)); },
		remove(i){ this.value.splice(i, 1)[0]; },
		[S.symbols.onclear](){
			console.log("zde");
			S.clear(...this.value);
		},
	});
	console.log(todosS);
	const name= "todoName";
	const onsubmitAdd= on("submit", event=> {
		const el= event.target.elements[name];
		event.preventDefault();
		S.action(todosS, "add", el.value);
		el.value= "";
	});
	const onremove= on("remove", event=>
		S.action(todosS, "remove", event.detail));
	
	const ul_todos= el("ul").append(
		S.el(todosS, ts=> ts
			.map((textContent, value)=>
				el(todoComponent, { textContent, value, className }, onremove))
	));
	return el("div", { className }).append(
		el("div").append(
			el("h2", "Todos:"),
			el("h3", "List of todos:"),
			S.el(todosS, ts=> !ts.length
				? el("p", "No todos yet")
				: ul_todos),
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
			el("output", S(()=> JSON.stringify(todosS, null, "\t")))
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
		dispatchEvent(host(), "remove", value);
	});
	const is_editable= S(false);
	const onedited= on("change", ev=> {
		textContent(ev.target.value);
		is_editable(false);
	});
	return el("li").append(
		S.el(is_editable, is=> is
			? el("input", { value: textContent(), type: "text" }, onedited)
			: el("span", { textContent, onclick: is_editable.bind(null, true) }),
		),
		el("button", { type: "button", value, textContent: "-" }, onclick)
	);
}
