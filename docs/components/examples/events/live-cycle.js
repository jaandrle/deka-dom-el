import { el, on } from "deka-dom-el";
const paragraph= el("p", "See lifecycle events in console.",
	el=> log({ type: "dde:created", detail: el }),
	on.connected(log),
	on.disconnected(log),
);

document.body.append(
	paragraph,
	el("button", "Remove", on("click", ()=> paragraph.remove()))
);

/** @param {Partial<CustomEvent>} event */
function log({ type, detail }){
	console.log({ _this: this, type, detail });
}
