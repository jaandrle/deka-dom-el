import { el } from "deka-dom-el";
import { S } from "deka-dom-el/signals";
const threePS= ({ emoji= "🚀" })=> {
	const clicks= S(0); // A
	return el().append(
		el("p", S(()=>
			"Hello World "+emoji.repeat(clicks()) // B
		)),
		el("button", {
			type: "button",
			onclick: ()=> clicks(clicks()+1), // C
			textContent: "Fire",
		})
	);
};
document.body.append(
	el(threePS, { emoji: "🎉" }),
);

