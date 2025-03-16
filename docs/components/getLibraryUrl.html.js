import { styles } from "../ssr.js";

styles.css`
#library-url-form {
	display: flex;
	flex-flow: column nowrap;
	gap: 1rem;
	padding: 1.5rem;
	border-radius: var(--border-radius);
	background-color: var(--bg-sidebar);
	box-shadow: var(--shadow);
	border: 1px solid var(--border);
	margin: 1.5rem 0;
}

#library-url-form .selectors {
	display: flex;
	flex-flow: row wrap;
	gap: 0.75rem;
}

#library-url-form output {
	display: flex;
	flex-flow: column nowrap;
	gap: 0.75rem;
	margin-top: 0.5rem;
}

#library-url-form output p {
	font-weight: 500;
	margin: 0.25rem 0;
	color: var(--text-light);
}

#library-url-form .url-title {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	margin-bottom: -0.25rem;
}

#library-url-form .url-title strong {
	font-family: var(--font-mono);
	font-size: 0.95rem;
}

#library-url-form .url-title span {
	color: var(--text-light);
	font-size: 0.9rem;
}

#library-url-form .code {
	margin-bottom: 1rem;
}

#library-url-form .info-text {
	font-size: 0.9rem;
	font-style: italic;
	margin-top: 1rem;
	color: var(--text-light);
}

@media (max-width: 768px) {
	#library-url-form .selectors {
		flex-direction: column;
	}

	#library-url-form select {
		width: 100%;
	}
}
`;

import { el } from "deka-dom-el";
import { ireland } from "./ireland.html.js";

export function getLibraryUrl({ page_id }){
	return el(ireland, {
		src: new URL("./getLibraryUrl.js.js", import.meta.url),
		exportName: "getLibraryUrl",
		page_id,
	});
}
