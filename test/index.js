import { S, reactive, watch, el, namespace, assign, on, dispatch } from "../index.js";
Object.assign(globalThis, { S, reactive, watch, el, namespace, assign, on, dispatch });

const { style, css }= createStyle();
globalThis.test= console.log;
const app= el(component, null, on("change", globalThis.test));
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
	const store= reactive({ name, surname });
	const full_name= S(()=> store.name()+" "+store.surname());
	on(full_name, console.log);
	
	return el("div", { className }, on.connected(console.log)).append(
		el("p").append(
			el("#text", { textContent: "Hello " }),
			el("strong", { textContent: full_name }),
			el("#text", { textContent: "!" }),
		),
		el("label").append(
			el("#text", { textContent: "Set name:" }),
			el("input", { type: "text", value: store.name },
				on("change", ev=> store.name(ev.target.value))),
		),
		el("label").append(
			el("#text", { textContent: "Set surname:" }),
			el("input", { type: "text", value: store.surname },
				on("change", ev=> store.surname(ev.target.value))),
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
