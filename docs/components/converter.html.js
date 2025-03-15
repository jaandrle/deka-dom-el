import { styles } from "../ssr.js";

styles.css`
#html-to-dde-converter {
	grid-column: full-main;
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
	padding: 1.5rem;
	border-radius: var(--border-radius);
	background-color: var(--bg-sidebar);
	box-shadow: var(--shadow);
	border: 1px solid var(--border);
}

#html-to-dde-converter h3 {
	margin-top: 0;
	color: var(--primary);
}

#html-to-dde-converter .description {
	color: var(--text-light);
	font-size: 0.95rem;
	margin-top: -1rem;
}

#html-to-dde-converter .converter-form {
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

#html-to-dde-converter .input-group,
#html-to-dde-converter .output-group {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}
#html-to-dde-converter [type="number"]{
	width: 3em;
	font-variant-numeric: tabular-nums;
	font-size: 1rem;
}

#html-to-dde-converter label {
	font-weight: 500;
	display: flex;
	justify-content: space-between;
}

#html-to-dde-converter .options {
	display: flex;
	flex-wrap: wrap;
	gap: 1rem;
	margin-bottom: 0.5rem;
}

#html-to-dde-converter .option-group {
	display: flex;
	align-items: center;
	gap: 0.5rem;
}

#html-to-dde-converter textarea {
	font-family: var(--font-mono);
	font-size: 0.9rem;
	padding: 1rem;
	border-radius: var(--border-radius);
	border: 1px solid var(--border);
	background-color: var(--bg);
	color: var(--text);
	min-height: 200px;
	height: 25em;
	resize: vertical;
}

#html-to-dde-converter textarea:focus {
	outline: 2px solid var(--primary-light);
	outline-offset: 1px;
}

#html-to-dde-converter .button-group {
	display: flex;
	gap: 0.5rem;
	justify-content: space-between;
	align-items: center;
}

#html-to-dde-converter button {
	padding: 0.5rem 1rem;
	border-radius: var(--border-radius);
	border: none;
	background-color: var(--primary);
	color: var(--button-text);
	font-weight: 500;
	cursor: pointer;
	transition: background-color 0.2s ease;
}

#html-to-dde-converter button:hover {
	background-color: var(--primary-dark);
}

#html-to-dde-converter button.secondary {
	background-color: transparent;
	border: 1px solid var(--border);
	color: var(--text);
}

#html-to-dde-converter button.secondary:hover {
	background-color: var(--bg);
	border-color: var(--primary);
}

#html-to-dde-converter .copy-button {
	background-color: var(--secondary);
}

#html-to-dde-converter .copy-button:hover {
	background-color: var(--secondary-dark);
}

#html-to-dde-converter .status {
	font-size: 0.9rem;
	color: var(--text-light);
}

#html-to-dde-converter .error {
	color: hsl(0, 100%, 60%);
	font-size: 0.9rem;
	margin-top: 0.5rem;
}

/* Sample HTML examples list */
#html-to-dde-converter .examples-list {
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
	margin-top: 0.5rem;
}

#html-to-dde-converter .example-button {
	font-size: 0.85rem;
	padding: 0.25rem 0.5rem;
}
`;

import { ireland } from "./ireland.html.js";
import { el } from "deka-dom-el";
const fileURL= url=> new URL(url, import.meta.url);

export function converter({ page_id }){
	registerClientPart(page_id);
	return el(ireland, {
		src: fileURL("./converter.js.js"),
		exportName: "converter",
		page_id,
	});
}

let is_registered= {};
/** @param {string} page_id */
function registerClientPart(page_id){
	if(is_registered[page_id]) return;

	document.head.append(
		el("script", {
			// src: "https://unpkg.com/@beforesemicolon/html-parser/dist/client.js",
			src: "https://cdn.jsdelivr.net/npm/@beforesemicolon/html-parser/dist/client.js",
			type: "text/javascript",
			charset: "utf-8",
			defer: true
		}),
	);
	is_registered[page_id]= true;
}
