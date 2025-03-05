import { el } from "deka-dom-el";
import { S } from "deka-dom-el/signals";
function Counter() {
	// Define state
	const count = S(0);

	// Define behavior
	const increment = () => count.set(count.get() + 1);

	// Define data flow
	setTimeout(increment, 1000);
	// or fetchAPI().then(increment);

	// Declarative UI (how to render data/`count`)
	// …automatically updates when changes
	return el("div").append(
		// declarative element(s)
		el("p", S(() => "Count: " + count.get())),
		el("button", {
			onclick: increment,
			textContent: "Increment",
			// declarative attribute(s)
			disabled: S(() => count.get() >= 10)
		})
	);
}
