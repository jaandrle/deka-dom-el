import { el } from "deka-dom-el";
import { S } from "deka-dom-el/signals";
const threePS= ({ emoji= "🚀" })=> {
	const clicks= S(0); // A
	return el().append(
		el("p", S(()=>
			"Hello World "+emoji.repeat(clicks.get()) // B
		)),
		el("button", {
			type: "button",
			onclick: ()=> clicks.set(clicks.get()+1), // C
			textContent: "Fire",
		})
	);
};
document.body.append(
	el(threePS, { emoji: "🎉" }),
);

