import { T, t } from "./utils/index.js";
export const info= {
	title: t`Examples Gallery`,
	fullTitle: t`DDE Examples & Code Snippets`,
	description: t`A comprehensive collection of examples and code snippets for working with Deka DOM Elements.`,
};

import { el } from "deka-dom-el";
import { simplePage } from "./layout/simplePage.html.js";
import { h3 } from "./components/pageUtils.html.js";
import { example } from "./components/example.html.js";
/** @param {string} url */
const fileURL= url=> new URL(url, import.meta.url);

/** @param {import("./types.d.ts").PageAttrs} attrs */
export function page({ pkg, info }){
	const page_id= info.id;
	return el(simplePage, { info, pkg }).append(
		el("p").append(T`
			Real-world application examples showcasing how to build complete, production-ready interfaces with dd<el>:
		`),
		el(h3, t`Data Dashboard`),
		el("p").append(T`
			Data visualization dashboard with charts, filters, and responsive layout.  Integration with a
			third-party charting library, data fetching and state management, responsive layout design, and multiple
			interactive components working together.
		`),
		el(example, { src: fileURL("./components/examples/case-studies/data-dashboard.js"), variant: "big", page_id }),

		el(h3, t`Interactive Form`),
		el("p").append(T`
			Complete form with real-time validation, conditional rendering, and responsive design. Form handling with
			real-time validation, reactive UI updates, complex form state management, and clean separation of concerns.
		`),
		el(example, { src: fileURL("./components/examples/case-studies/interactive-form.js"), variant: "big", page_id }),


		el(h3, t`Interactive Image Gallery`),
		el("p").append(T`
			Responsive image gallery with lightbox, keyboard navigation, and filtering. Dynamic loading of content,
			lightbox functionality, animation handling, and keyboard and gesture navigation support.
		`),
		el(example, { src: fileURL("./components/examples/case-studies/image-gallery.js"), variant: "big", page_id }),


		el(h3, t`Task Manager`),
		el("p").append(T`
			Kanban-style task management app with drag-and-drop and localStorage persistence. Complex state management
			with signals, drag and drop functionality, local storage persistence, and responsive design for different
			devices.
		`),
		el(example, { src: fileURL("./components/examples/case-studies/task-manager.js"), variant: "big", page_id }),


		el(h3, t`TodoMVC`),
		el("p").append(T`
			Complete TodoMVC implementation with local storage and routing. TodoMVC implementation showing routing,
			local storage persistence, filtering, and component architecture patterns. For commented code, see the
			dedicated page ${el("a", { href: "./p10-todomvc.html" }).append(T`TodoMVC`)}.
		`),

	);
}
