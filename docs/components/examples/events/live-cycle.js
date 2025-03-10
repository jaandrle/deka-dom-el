import { el, on } from "deka-dom-el";
const paragraph= el("p", "See live-cycle events in console.",
	el=> log({ type: "dde:created", detail: el }),
	on.connected(log),
	on.disconnected(log),

document.body.append(
	paragraph,
	el("button", "Update attribute", on("click", ()=> paragraph.setAttribute("test", Math.random().toString()))),
	" ",
	el("button", "Remove", on("click", ()=> paragraph.remove()))
);

/** @param {Partial<CustomEvent>} event */
function log({ type, detail }){
	console.log({ _this: this, type, detail });
}
