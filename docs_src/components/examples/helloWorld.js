import { el, S } from "../../../index-with-signals.js";
const clicks= S(0);
document.body.append(
	el("<>").append(
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
