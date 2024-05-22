/* PSEUDO-CODE!!! */
import { el } from "deka-dom-el";
import { S } from "deka-dom-el/signals";
function component(){
	/* prepare changeable data */
	const dataA= S("data");
	const dataB= S("data");
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
			S.el(dataA, data=> data.map(d=> el("li", d)))
		),
		el("ul").append(
			/* declarative component(s) */
			S.el(dataA, data=> data.map(d=> el(subcomponent, d)))
		)
	);
}
function subcomponent({ id }){
	/* prepare changeable data */
	const textContent= S("…");
	/* define data flow (can be asynchronous) */
	fetchAPI(id).then(text=> textContent(text));
	/* declarative UI */
	return el("li", { textContent, dataId: id });
}
