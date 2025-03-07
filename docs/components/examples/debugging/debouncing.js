import { S } from "deka-dom-el/signals";
// Debouncing signal updates
function debounce(func, wait) {
	let timeout;
	return (...args)=> {
		clearTimeout(timeout);
		timeout= setTimeout(() => func(...args), wait);
	};
}

const inputSignal= S("");
const debouncedSet= debounce(value => inputSignal.set(value), 300);

// In your input handler
inputElement.addEventListener("input", e=> debouncedSet(e.target.value));
