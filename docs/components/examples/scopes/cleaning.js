import { el, on } from "deka-dom-el";
/** @param {HTMLElement} el */
const empty= el=> Array.from(el.children).forEach(c=> c.remove());
document.body.append(
	el(component),
	el("button", {
		textContent: "Remove",
		onclick: ()=> empty(document.body),
		type: "button"
	})
);
import { S } from "deka-dom-el/signals";
function component(){
	const textContent= S("Click to change text.");

	const onclickChange= on("click", function redispatch(){
		textContent.set("Text changed! "+(new Date()).toString())
	});
	return el("p", textContent, onclickChange);
}
