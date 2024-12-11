import { el } from "deka-dom-el";
import { S } from "deka-dom-el/signals";
document.body.append(
	el(HelloWorldComponent)
);
function HelloWorldComponent(){
	const clicksS= S(0); // A
	return el().append(
		el("p", S(()=>
			"Hello World "+"🎉".repeat(clicksS()) // B
		)),
		el("button", {
			type: "button",
			onclick: ()=> clicksS(clicksS()+1), // C
			textContent: "Fire",
		})
	)
}
