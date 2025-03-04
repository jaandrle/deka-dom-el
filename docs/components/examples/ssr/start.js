// Basic jsdom integration example
import { JSDOM } from "jsdom";
import { register, unregister, queue } from "deka-dom-el/jsdom.js";

// Create a jsdom instance
const dom = new JSDOM("<!DOCTYPE html><html><body></body></html>");

// Register the dom with deka-dom-el
const { el } = await register(dom);

// Use deka-dom-el normally
dom.window.document.body.append(
	el("div", { className: "container" }).append(
		el("h1", "Hello, SSR World!"),
		el("p", "This content was rendered on the server.")
	)
);

// Wait for any async operations to complete
await queue();

// Get the rendered HTML
const html = dom.serialize();
console.log(html);

// Clean up when done
unregister();
