import { el } from "deka-dom-el";

// Create element with properties
const button = el("button", {
	textContent: "Click me",
	className: "primary",
	disabled: true
});

// Shorter and more expressive
// than the native approach

// Add to DOM
document.body.append(button);