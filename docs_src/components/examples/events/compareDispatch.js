import { el, on, dispatchEvent } from "deka-dom-el";
document.body.append(
	el("p", "Listenning to `test` event.", on("test", console.log)).append(
		el("br"),
		el("button", "native", on("click", native)),
		" ",
		el("button", "dde", on("click", dde)),
		" ",
		el("button", "dde with options", on("click", ddeOptions))
	)
);
function native(){ this.dispatchEvent(new CustomEvent("test", { bubbles: true, detail: "hi" })); }
function dde(){ dispatchEvent("test")(this.parentElement, "hi"); }
function ddeOptions(){ dispatchEvent("test", { bubbles: true })(this, "hi"); }
