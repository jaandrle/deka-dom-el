import { el, elNS, assign } from "../index.js";
Object.assign(globalThis, { el, elNS, assign });

console.log(el("p", { className: "red", textContent: "Hello "}));
console.log(el("p", { className: "red", textContent: "Hello "}) instanceof HTMLParagraphElement);

document.head.append(
	el("style", { textContent: `
		.red{ color: red; }
	` })
)
document.body.append(
	el("p", { className: "red" }).append(
		el("", { textContent: "Hello " }),
		el("strong", { textContent: "World" })
	)
);
