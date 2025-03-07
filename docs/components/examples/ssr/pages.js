// ❌ WRONG: Static imports are hoisted and will register before JSDOM is created
import { register } from "deka-dom-el/jsdom";
import { el } from "deka-dom-el";
import { Header } from "./components/Header.js";

// ✅ CORRECT: Use dynamic imports to ensure proper initialization order
import { JSDOM } from "jsdom";

async function renderPage() {
	// 1. Create JSDOM instance first
	const dom = new JSDOM(`<!DOCTYPE html><html><body></body></html>`);

	// 2. Dynamically import jsdom module
	const { register, queue } = await import("deka-dom-el/jsdom");

	// 3. Register and get el function
	const { el } = await register(dom);

	// 4. Dynamically import page components
	const { Header } = await import("./components/Header.js");
	const { Content } = await import("./components/Content.js");

	// 5. Render components
	const body = dom.window.document.body;
	el(body).append(
		el(Header, { title: "My Page" }),
		el(Content, { text: "This is server-rendered content" })
	);

	// 6. Wait for async operations
	await queue();

	// 7. Get HTML and clean up
	return dom.serialize();
}
