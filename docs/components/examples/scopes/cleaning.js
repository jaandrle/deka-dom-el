import { el, empty, on } from "deka-dom-el";
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
		textContent("Text changed! "+(new Date()).toString())
	});
	return el("p", textContent, onclickChange);
}
