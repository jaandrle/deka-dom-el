/* PSEUDO-CODE!!! */
import { el } from "deka-dom-el";
import { O } from "deka-dom-el/observables";
function component(){
	/* prepare changeable data */
	const dataA= O("data");
	const dataB= O("data");
	/* define data flow (can be asynchronous) */
	fetchAPI().then(data_new=> dataA(data_new));
	setTimeout(()=> dataB("DATA"));
	/* declarative UI */
	return el().append(
		el("h1", {
			textContent: "Example",
			/* declarative attribute(s) */
			classList: { declarative: dataB }
		}),
		el("ul").append(
			/* declarative element(s) */
			O.el(dataA, data=> data.map(d=> el("li", d)))
		),
		el("ul").append(
			/* declarative component(s) */
			O.el(dataA, data=> data.map(d=> el(subcomponent, d)))
		)
	);
}
function subcomponent({ id }){
	/* prepare changeable data */
	const textContent= O("…");
	/* define data flow (can be asynchronous) */
	fetchAPI(id).then(text=> textContent(text));
	/* declarative UI */
	return el("li", { textContent, dataId: id });
}
