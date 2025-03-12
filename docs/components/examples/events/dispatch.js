import { el, on, dispatchEvent, scope } from "deka-dom-el";
document.body.append(
	el(component),
);

function component(){
	const { host }= scope;
	const dispatchExample= dispatchEvent(
		"example",
		{ bubbles: true },
		host
	);

	return el("div").append(
		el("p", "Dispatch events from outside of the component."),
		el("button", { textContent: "Dispatch", type: "button" },
			on("click", dispatchExample))
	);
}
