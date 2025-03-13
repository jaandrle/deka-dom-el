import { S } from "deka-dom-el/signals";

// ===== Approach 1: Traditional debouncing with utility function =====
function debounce(func, wait) {
	let timeout;
	return (...args)=> {
		clearTimeout(timeout);
		timeout= setTimeout(() => func(...args), wait);
	};
}

const inputSignal = S("");
const debouncedSet = debounce(value => inputSignal.set(value), 300);

// In your input handler
inputElement.addEventListener("input", e => debouncedSet(e.target.value));

// ===== Approach 2: Signal debouncing utility =====
/**
 * Creates a debounced signal that only updates after delay
 * @param {any} initialValue Initial signal value
 * @param {number} delay Debounce delay in ms
 */
function createDebouncedSignal(initialValue, delay = 300) {
	// Create two signals: one for immediate updates, one for debounced values
	const immediateSignal = S(initialValue);
	const debouncedSignal = S(initialValue);
	
	// Keep track of the timeout
	let timeout = null;
	
	// Set up a listener on the immediate signal
	S.on(immediateSignal, value => {
		// Clear any existing timeout
		if (timeout) clearTimeout(timeout);
		
		// Set a new timeout to update the debounced signal
		timeout = setTimeout(() => {
			debouncedSignal.set(value);
		}, delay);
	});
	
	// Return an object with both signals and a setter function
	return {
		// The raw signal that updates immediately
		raw: immediateSignal,
		// The debounced signal that only updates after delay
		debounced: debouncedSignal,
		// Setter function to update the immediate signal
		set: value => immediateSignal.set(value)
	};
}

// Usage example
const searchInput = createDebouncedSignal("", 300);

// Log immediate changes for demonstration
S.on(searchInput.raw, value => console.log("Input changed to:", value));

// Only perform expensive operations on the debounced value
S.on(searchInput.debounced, value => {
	console.log("Performing search with:", value);
	// Expensive operation would go here
});

// In your input handler
searchElement.addEventListener("input", e => searchInput.set(e.target.value));