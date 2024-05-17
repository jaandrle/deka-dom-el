import { el, empty, on } from "deka-dom-el";
document.body.append(
	el(component),
	el("button", {
		textContent: "Remove",
		onclick: ()=> empty(document.body),
		type: "button"
	})
);
import { O } from "deka-dom-el/observables";
function component(){
	const textContent= O("Click to change text.");

	const onclickChange= on("click", function redispatch(){
		textContent("Text changed! "+(new Date()).toString())
	});
	return el("p", textContent, onclickChange);
}
