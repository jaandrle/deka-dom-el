import { pages, styles } from "../ssr.js";
const host= "."+prevNext.name;
styles.css`
/* Previous/Next navigation */
${host} {
	display: flex;
	justify-content: space-between;
	margin-top: 3rem;
	padding-top: 1.5rem;
	border-top: 1px solid var(--border);
	gap: 1rem;
	width: 100%;
}

${host} a {
	display: flex;
	align-items: center;
	padding: 0.5rem 0.75rem;
	border-radius: var(--border-radius);
	background-color: var(--primary-dark); /* Darker background for better contrast */
	color: white;
	font-weight: 600; /* Bolder text for better readability */
	text-decoration: none;
	transition: background-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
	max-width: 45%;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15); /* Subtle shadow for better visibility */
}

${host} a:hover {
	background-color: var(--primary);
	transform: translateY(-2px);
	text-decoration: none;
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Enhanced shadow on hover */
}

${host} [rel=prev] {
	margin-right: auto;
}

${host} [rel=next] {
	margin-left: auto;
}

${host} [rel=prev]::before {
	content: "←";
	margin-right: 0.75rem;
	font-size: 1.2em;
}

${host} [rel=next]::after {
	content: "→";
	margin-left: 0.75rem;
	font-size: 1.2em;
}

/* If there's no previous/next, ensure the spacing still works */
${host} a:only-child {
	margin-left: auto;
}

@media (max-width: 640px) {
	${host} a {
		font-size: 0.9rem;
	}
}
`;
import { el } from "../../index.js";
/**
 * @param {Object} attrs
 * @param {string} attrs.textContent
 * @param {string} [attrs.id]
 * */
export function h3({ textContent, id }){
		if(!id) id= "h-"+textContent.toLowerCase().replaceAll(/\s/g, "-").replaceAll(/[^a-z-]/g, "");
		return el("h3", { id }).append(
				el("a", {
						className: "heading-anchor",
						href: "#"+id,
						textContent: "#",
						title: `Link to this section: ${textContent}`,
						"aria-label": `Link to section ${textContent}`
				}),
				" ",
				textContent,
		);
}
/**
 * @param {import("../types.d.ts").Info} page
 * */
export function prevNext(page){
		const page_index= pages.indexOf(page);
		return el("div", { className: prevNext.name }).append(
				el(pageLink, { rel: "prev", page: pages[page_index-1] }),
				el(pageLink, { rel: "next", page: pages[page_index+1] })
		);
}
/**
 * @param {Object} attrs
 * @param {"prev"|"next"} attrs.rel
 * @param {import("../types.d.ts").Info} [attrs.page]
 * */
function pageLink({ rel, page }){
		if(!page) return el();
		let { href, title, description }= page;

		// Find the page index to show numbering
		const pageIndex = pages.findIndex(p => p === page);
		const pageNumber = pageIndex + 1;

		const linkTitle = rel === "prev"
				? `Previous: ${pageNumber}. ${title}`
				: `Next: ${pageNumber}. ${title}`;

		return el("a", {
				rel,
				href,
				title: description || linkTitle
		}).append(
				title
		);
}
