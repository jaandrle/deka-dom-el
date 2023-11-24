import { el } from "deka-dom-el";
import { O } from "deka-dom-el/observables";
const clicks= O(0);
document.body.append(
	el().append(
		el("p", O(()=>
			"Hello World "+"🎉".repeat(clicks())
		)),
		el("button", {
			type: "button",
			onclick: ()=> clicks(clicks()+1),
			textContent: "Fire"
		})
	)
);
