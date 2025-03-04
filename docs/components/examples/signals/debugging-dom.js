import { el, on, scope } from "deka-dom-el";
import { S } from "deka-dom-el/signals";

// Create a component with reactive elements
function ReactiveCounter() {
	const count = S(0);
		scope.host(on.connected(ev=>
				console.log(ev.target.__dde_reactive)
		));

	const counter = el('div', {
		// This element will be added into the __dde_reactive property
		textContent: count,
	});

	const incrementBtn = el('button', {
		textContent: 'Increment',
		onclick: () => count.set(count.get() + 1)
	});

	// Dynamic section will be added into __dde_signal property
	const counterInfo = S.el(count, value =>
		el('p', `Current count is ${value}`)
	);

	return el('div', { id: 'counter' }).append(
		counter,
		incrementBtn,
		counterInfo
	);
}
document.body.append(
	el(ReactiveCounter),
);

// In DevTools console:
const counter = document.querySelector('#counter');
setTimeout(()=> console.log(counter.__dde_reactive), 1000); // See reactive bindings
