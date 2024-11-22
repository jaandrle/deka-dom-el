import { el, assign } from "deka-dom-el";
const color= "lightcoral";
document.body.append(
	el("p", { textContent: "Hello (first time)", style: { color } })
);
document.body.append(
	assign(
		document.createElement("p"),
		{ textContent: "Hello (second time)", style: { color } }
	)
);
