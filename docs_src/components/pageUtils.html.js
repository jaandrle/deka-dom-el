import { pages, styles } from "../ssr.js";
const host= "."+prevNext.name;
styles.css`
${host}{
	display: grid;
	grid-template-columns: 1fr 2fr 1fr;
	margin-top: 1rem;
	border-top: 1px solid var(--border);
}
${host} [rel=prev]{
	grid-column: 1;
}
${host} [rel=next]{
	grid-column: 3;
	text-align: right;
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
		el("a", { textContent: "#", href: "#"+id, tabIndex: -1 }),
		" ", textContent
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
	return el("a", { rel, href, title: description }).append(
		rel==="next" ?"(next) " : "",
		title,
		rel==="prev" ? " (previous)" : "",
	);
}
