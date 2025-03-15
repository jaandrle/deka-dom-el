import { styles } from "../ssr.js";

styles.css`
/* Scroll to top button */
.scroll-top-button {
	position: fixed;
	bottom: 2rem;
	left: 2rem;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 3rem;
	height: 3rem;
	border-radius: 50%;
	background-color: var(--primary);
	color: var(--button-text);
	font-size: 1.5rem;
	text-decoration: none;
	box-shadow: var(--shadow);
	transition: background-color 0.2s ease, transform 0.2s ease;
	z-index: 1000;
}

.scroll-top-button:hover {
	background-color: var(--primary-dark);
	transform: translateY(-4px);
	text-decoration: none;
}

@media (max-width: 768px) {
	.scroll-top-button {
		bottom: 0.5rem;
		left: unset;
		right: .5rem;
		width: 2.5rem;
		height: 2.5rem;
	}
}
`;

import { el } from "deka-dom-el";
import { ireland } from "./ireland.html.js";

export function scrollTop(){
	return el(ireland, {
		src: new URL("./scrollTop.js.js", import.meta.url),
		exportName: "scrollTop",
		page_id: "*",
	});
}
