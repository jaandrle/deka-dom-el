/* PSEUDO-CODE!!! */
import { el, scope } from "deka-dom-el";
import { S } from "deka-dom-el/signals";
function Counter() {
	const { host } = scope;

	let count = S(0);
	const counterText = el("p", "Count: 0");
	S.on(count, c=> counterText.textContent= "Count: " + c);

	// Manually update DOM element
	const increment = () => {
		count.set(count.get() + 1);
		// NEVER EVER
		// count = S(count.get() + 1);
		host().querySelector("button").disabled = count.get() >= 10;
	};
	// NEVER EVER
	// setTimeout(()=> {
	//	const wrong= S(0);
	//  // THE HOST IS PROBABLY DIFFERENT THAN
	//  // YOU EXPECT AND OBSERVABLES MAY BE
	//  // UNEXPECTEDLY REMOVED!!!
	//	counterText.textContent= "Count: " + wrong.get();
	// }, 1000);

	return el("div").append(
		counterText,
		el("button", {
			onclick: increment,
			textContent: "Increment"
		})
	);
}
