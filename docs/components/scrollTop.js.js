import { el } from "deka-dom-el";

export function scrollTop() {
	return el("a", {
		href: "#",
		className: "scroll-top-button",
		ariaLabel: "Scroll to top",
		textContent: "↑",
		onclick: (e) => {
			e.preventDefault();
			window.scrollTo({ top: 0, behavior: "smooth" });
		}
	})
}
