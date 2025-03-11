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
		// THE HOST IS PROBABLY DIFFERENT THAN
		// YOU EXPECT AND SIGNAL MAY BE
		// UNEXPECTEDLY REMOVED!!!
		S.on(count, (count)=>
			host().querySelector("button").disabled = count >= 10
		);
	};
	setTimeout(()=> {
		// ok, BUT consider extract to separate function
		// see section below for more info
		const ok= S(0);
		S.on(ok, console.log);
		setInterval(()=> ok.set(ok.get() + 1), 100);
	}, 100);

	return el("div").append(
		counterText,
		el("button", {
			onclick: increment,
			textContent: "Increment"
		})
	);
}
