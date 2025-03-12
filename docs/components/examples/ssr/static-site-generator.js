// Building a simple static site generator
import { JSDOM } from "jsdom";
import { register, queue } from "deka-dom-el/jsdom";
import { writeFileSync, mkdirSync } from "node:fs";

async function buildSite() {
	// Define pages to build
	const pages = [
		{ id: "index", title: "Home", component: "./pages/home.js" },
		{ id: "about", title: "About", component: "./pages/about.js" },
		{ id: "docs", title: "Documentation", component: "./pages/docs.js" }
	];

	// Create output directory
	mkdirSync("./dist/docs", { recursive: true });

	// Build each page
	for (const page of pages) {
		// Create a fresh jsdom instance for each page
		const dom = new JSDOM("<!DOCTYPE html><html><head><meta charset=\"utf-8\"></head><body></body></html>");

		// Register with deka-dom-el
		const { el } = await register(dom);

		// Import the page component
		// use `import { el } from "deka-dom-el"`
		const { default: PageComponent } = await import(page.component);

		// Render the page with its metadata
		dom.window.document.body.append(
			el(PageComponent, { title: page.title, pages })
		);

		// Wait for any async operations
		await queue();

		// Write the HTML to a file
		const html = dom.serialize();
		writeFileSync(`./dist/docs/${page.id}.html`, html);

		console.log(`Built page: ${page.id}.html`);
	}
}

buildSite().catch(console.error);
