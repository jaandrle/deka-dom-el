// Basic SSR Example
import { JSDOM } from "jsdom";
import { register, queue } from "deka-dom-el/jsdom";
import { writeFileSync } from "node:fs";

async function renderPage() {
	// Create a jsdom instance
	const dom = new JSDOM("<!DOCTYPE html><html><head><meta charset=\"utf-8\"></head><body></body></html>");

	// Register with deka-dom-el and get the el function
	const { el } = await register(dom);

	// Create a simple header component
	// can be separated into a separate file and use `import { el } from "deka-dom-el"`
	function Header({ title }) {
		return el("header").append(
			el("h1", title),
			el("nav").append(
				el("ul").append(
					el("li").append(el("a", { href: "/" }, "Home")),
					el("li").append(el("a", { href: "/about" }, "About")),
					el("li").append(el("a", { href: "/contact" }, "Contact"))
				)
			)
		);
	}

	// Create the page content
	dom.window.document.body.append(
		el(Header, { title: "My Static Site" }),
		el("main").append(
			el("h2", "Welcome!"),
			el("p", "This page was rendered with deka-dom-el on the server.")
		),
		el("footer", "© 2025 My Company")
	);

	// Wait for any async operations
	await queue();

	// Get the HTML and write it to a file
	const html = dom.serialize();
	writeFileSync("index.html", html);

	console.log("Page rendered successfully!");
}

renderPage().catch(console.error);
