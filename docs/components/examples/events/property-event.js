import { el } from "deka-dom-el";

// Using events with property assignment
el("button", {
	textContent: "click me",
	onclick: console.log
});