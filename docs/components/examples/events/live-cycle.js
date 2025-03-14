import { el, on } from "deka-dom-el";
function allLifecycleEvents(){
	return el("form", null,
		el=> log({ type: "dde:created", detail: el }),
		on.connected(log),
		on.disconnected(log),
	).append(
		el("select", { id: "country" }, on.host(select => {
			// This runs when the host (select) is ready with all its options
			select.value = "cz"; // Pre-select Czechia
			log({ type: "dde:on.host", detail: select });
		})).append(
			el("option", { value: "au", textContent: "Australia" }),
			el("option", { value: "ca", textContent: "Canada" }),
			el("option", { value: "cz", textContent: "Czechia" }),
		),
		el("p", "See lifecycle events in console."),
	);
}

document.body.append(
	el(allLifecycleEvents),
	el("button", "Remove Element", on("click", function(){
		this.previousSibling.remove();
	}))
);

/** @param {Partial<CustomEvent>} event */
function log({ type, detail }){
	console.log({ _this: this, type, detail });
}
