import "../global.css.js";
import { el, simulateSlots } from "deka-dom-el";

import { header } from "./head.html.js";
import { prevNext } from "../components/pageUtils.html.js";

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
			// Page title as an h1
			el("h1", { className: "page-title", textContent: info.title }),

			// Main content from child elements
			el("slot"),

			// Navigation between pages
			el(prevNext, info)
		)
	));
}
