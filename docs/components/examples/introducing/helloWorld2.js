import { el } from "deka-dom-el";
import { S } from "deka-dom-el/signals";
const clicks= S(0); // A
document.body.append(
	el().append(
		el("p", S(()=>
			"Hello World "+"🎉".repeat(clicks()) // B
		)),
		el("button", {
			type: "button",
			onclick: ()=> clicks(clicks()+1), // C
			textContent: "Fire",
		})
	)
);
