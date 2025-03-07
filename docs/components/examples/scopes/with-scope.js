import { el, scope } from "deka-dom-el";
import { S } from "deka-dom-el/signals";

function CounterWithIsolatedTimer() {
	const { host } = scope;

	// Main component state
	const count = S(0);

	// Create a timer in an isolated scope
	scope.isolate(() => {
	// These subscriptions won't be tied to the component lifecycle
	// They would continue to run even if the component was removed
	const timer = S(0);

	// Not recommended for real applications!
	// Just demonstrating scope isolation
	setInterval(() => {
		timer.set(timer.get() + 1);
		console.log(`Timer: ${timer.get()}`);
	}, 1000);
	});

	// Normal component functionality within main scope
	function increment() {
	count.set(count.get() + 1);
	}

	return el("div").append(
	el("p").append(
		"Count: ",
		el("#text", S(() => count.get()))
	),
	el("button", {
		textContent: "Increment",
		onclick: increment
	}),
	el("p", "An isolated timer runs in console")
	);
}

// Usage
document.body.append(
	el(CounterWithIsolatedTimer)
);
