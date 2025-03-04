// Handling async data in SSR
import { JSDOM } from "jsdom";
import { S } from "deka-dom-el/signals";
import { register, queue } from "deka-dom-el/jsdom";

async function renderWithAsyncData() {
	const dom = new JSDOM("<!DOCTYPE html><html><body></body></html>");
	const { el } = await register(dom);

	// Create a component that fetches data
	function AsyncComponent() {
			const title= S("-");
			const description= S("-");

		// Use the queue to track the async operation
		queue(fetch("https://api.example.com/data")
			.then(response => response.json())
			.then(data => {
				title.set(data.title);
				description.set(data.description);
			}));

		return el("div", { className: "async-content" }).append(
				el("h2", title),
				el("p", description)
		);
	}

	// Render the page
	dom.window.document.body.append(
		el("h1", "Page with Async Data"),
		el(AsyncComponent)
	);

	// IMPORTANT: Wait for all queued operations to complete
	await queue();

	// Now the HTML includes all async content
	const html = dom.serialize();
	console.log(html);
}

renderWithAsyncData();
