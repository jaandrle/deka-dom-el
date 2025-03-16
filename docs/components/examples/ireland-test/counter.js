import { el } from "deka-dom-el";
import { S } from "deka-dom-el/signals";

const className = "client-side-counter";
document.body.append(
	el("style").append(`
.${className} {
	border: 1px dashed #ccc;
	padding: 1em;
	margin: 1em;
}
`.trim())
);

export function CounterStandard() {
	// Create reactive state with a signal
	const count = S(0);

	// Create UI components that react to state changes
	return el("div", { className }).append(
		el("h4", "Client-Side Counter"),
		el("div", {
			// The textContent updates automatically when count changes
			textContent: S(() => `Count: ${count.get()}`),
		}),
		el("div", { className: "controls" }).append(
			el("button", {
				onclick: () => count.set(count.get() - 1),
				textContent: "-",
			}),
			el("button", {
				onclick: () => count.set(count.get() + 1),
				textContent: "+",
			})
		)
	);
}
