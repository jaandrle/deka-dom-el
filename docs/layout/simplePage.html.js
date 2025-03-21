import "../global.css.js";
import { el, simulateSlots } from "deka-dom-el";

import { header } from "./head.html.js";
import { prevNext } from "../components/pageUtils.html.js";
import { scrollTop } from "../components/scrollTop.html.js";

/** @param {Pick<import("../types.d.ts").PageAttrs, "pkg" | "info">} attrs */
export function simplePage({ pkg, info }){
	return simulateSlots(el().append(
		// Skip link for keyboard navigation
		el("a", {
			href: "#main-content",
			className: "skip-link",
			textContent: "Skip to main content"
		}),

		// Header with site information
		el(header, { info, pkg }),

		// Main content area
		el("main", { id: "main-content", role: "main" }).append(
			el("h2", { textContent: info.fullTitle || info.title }),

			// Main content from child elements
			el("slot"),

			// Navigation between pages
			el(prevNext, info)
		),

		// Scroll to top button
		el(scrollTop),
	));
}
