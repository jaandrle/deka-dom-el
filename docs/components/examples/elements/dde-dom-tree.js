import { el } from "deka-dom-el";

// Chainable, natural nesting
// append() returns parent element
// making chains easy and intuitive
document.body.append(
	el("div").append(
		el("h1", "Title"),
		el("p", "Paragraph"),
	),
);
