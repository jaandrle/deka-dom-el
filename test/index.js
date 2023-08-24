import { S, watch, el, elNS, assign, listen, dispatch } from "../index.js";
Object.assign(globalThis, { S, watch, el, elNS, assign, listen, dispatch });

const { style, css }= createStyle();
globalThis.test= console.log;
const app= el(component, null, listen("change", globalThis.test));
dispatch("change", "Peter")(app);
console.log(app, app instanceof HTMLDivElement);

document.head.append(style);
document.body.append(app);

function component({ name= "World", surname= "" }= {}){
	const className= "naiveForm";
	css`
		.${className}{
			display: flex;
			flex-flow: column nowrap;
		}
		.${className} input{
			margin-inline-start: .5em;
		}
	`;
	const store= S({ name, surname });
	const full_name= S(()=> S(store.name)+" "+S(store.surname));
	listen(full_name, console.log);
	
	return el("div", { className }).append(
		el("p").append(
			el("#text", { textContent: "Hello " }),
			el("strong", { textContent: ()=> S(full_name) }),
			el("#text", { textContent: "!" }),
		),
		el("label").append(
			el("#text", { textContent: "Set name:" }),
			el("input", { type: "text", value: ()=> S(store.name) },
				listen("change", ev=> S(store.name, ev.target.value))),
		),
		el("label").append(
			el("#text", { textContent: "Set surname:" }),
			el("input", { type: "text", value: ()=> S(store.surname) },
				listen("change", ev=> S(store.surname, ev.target.value))),
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
