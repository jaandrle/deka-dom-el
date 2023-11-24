import { el } from "deka-dom-el";
import { S } from "deka-dom-el/observables";
const clicks= S(0);
document.body.append(
	el().append(
		el("p", S(()=>
			"Hello World "+"🎉".repeat(clicks())
		)),
		el("button", {
			type: "button",
			onclick: ()=> clicks(clicks()+1),
			textContent: "Fire"
		})
	)
);
