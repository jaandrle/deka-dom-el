/* PSEUDO-CODE!!! */
import { el, scope } from "deka-dom-el";
function Counter() {
	const { host } = scope;

	let count = 0;
	const counterText = el("p", "Count: 0");

	// Manually update DOM element
	const increment = () => {
		count++;
		counterText.textContent = "Count: " + count;
		host().querySelector("button").disabled = count >= 10;
	};
	setTimeout(increment, 1000);
	// or fetchAPI().then(increment);

	return el("div").append(
		counterText,
		el("button", {
			onclick: increment,
			textContent: "Increment"
		})
	);
}
