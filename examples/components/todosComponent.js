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
	const todosO= O(todos.map(t=> O(t)), {
		add(v){ this.value.push(O(v)); },
		remove(i){ O.clear(this.value.splice(i, 1)[0]); }
	});

	const name= "todoName";
	const onsubmitAdd= on("submit", event=> {
		const el= event.target.elements[name];
		event.preventDefault();
		O.action(todosO, "add", el.value);
		el.value= "";
	});
	const onremove= on("remove", event=>
		O.action(todosO, "remove", event.detail));
	
	const ul_todos_version= 1; // ul_todos_v1/ul_todos_v2
	const ul_todos_v1= el("ul").append(
		O.el(todosO, ts=> ts
			.map((textContent, value)=>
				el(todoComponent, { textContent, value, className }, onremove))
	));
	const ul_todos_v2= ts=> el("ul").append(
		...ts.map((textContent, value)=>
			el(todoComponent, { textContent, value, className }, onremove))
	);
	
	return el("div", { className }).append(
		el("div").append(
			el("h2", "Todos:"),
			el("h3", "List of todos:"),
			O.el(todosO, ts=> !ts.length
				? el("p", "No todos yet")
				: ( !(ul_todos_version-1) ? ul_todos_v1 : ul_todos_v2(ts) )
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
			el("output", O(()=> JSON.stringify(todosO, null, "\t")))
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
	const is_editable= O(false);
	const onedited= on("change", ev=> {
		textContent(ev.target.value);
		is_editable(false);
	});
	const memo= initMemo(host);
	return el("li").append(
		O.el(is_editable, is=> is
			? memo("view", ()=> el("input", { value: textContent(), type: "text" }, onedited))
			: memo("edit", ()=> el("span", { textContent, onclick: is_editable.bind(null, true) }))
		),
		el("button", { type: "button", value, textContent: "-" }, onclick)
	);
}
function initMemo(host){
	const memos= new Map();
	host(on.disconnected(()=> memos.clear()));
	return function useMemo(key, fn){
		let memo= memos.get(key);
		if(!memo){
			memo= fn();
			memos.set(key, memo);
		}
		return memo;
	}
}
