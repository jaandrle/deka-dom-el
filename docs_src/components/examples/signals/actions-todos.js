import { S } from "deka-dom-el/signals";
const todos= S([], {
	push(item){
		this.value.push(S(item));
	},
	pop(){
		const removed= this.value.pop();
		if(removed) S.clear(removed);
	},
	[S.symbols.onclear](){ // this covers `O.clear(todos)`
		S.clear(...this.value);
	}
});

import { el, on } from "deka-dom-el";
/** @type {ddeElementAddon<HTMLFormElement>} */
const onsubmit= on("submit", function(event){
	event.preventDefault();
	const data= new FormData(this);
	switch (data.get("op")){
		case "A"/*dd*/:
			S.action(todos, "push", data.get("todo"));
			break;
		case "E"/*dit*/: {
			const last= todos().at(-1);
			if(!last) break;
			last(data.get("todo"));
			break;
		}
		case "R"/*emove*/:
			S.action(todos, "pop");
			break;
	}
});
document.body.append(
	el("ul").append(
		S.el(todos, todos=>
			todos.map(textContent=> el("li", textContent)))
	),
	el("form", null, onsubmit).append(
		el("input", { type: "text", name: "todo", placeholder: "Todo’s text" }),
		el(radio, { textContent: "Add", checked: true }),
		el(radio, { textContent: "Edit last" }),
		el(radio, { textContent: "Remove" }),
		el("button", "Submit")
	)
);
document.head.append(
	el("style", "form{ display: flex; flex-flow: column nowrap; }")
);
function radio({ textContent, checked= false }){
	return el("label").append(
		el("input", { type: "radio", name: "op", value: textContent[0], checked }),
		" ",textContent
	)
}
