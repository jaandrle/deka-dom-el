import { styles } from "./ssr.js";
styles.css`
:root {
	--primary: hsl(0, 74%, 42%);
	--primary-light: hsl(5, 87%, 61%);
	--primary-dark: hsl(0, 100%, 25%);
	--primary-hs: 0, 74%;
	--secondary: hsl(330, 100%, 22%);
	--secondary-light: hsl(339, 80%, 38%);
	--secondary-dark: hsl(328, 100%, 15%);
	--secondary-hs: 330, 100%;

	--font-main: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI',
		Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
	--font-mono: 'Fira Code', 'JetBrains Mono', 'SF Mono',
		SFMono-Regular, Consolas, 'Liberation Mono', Menlo, monospace;

	--body-max-width: 40rem;
	--header-height: 4rem;
	--border-radius: 0.375rem;

	--bg: hsl(0, 0%, 100%);
	--bg-sidebar: hsl(0, 100%, 98%);
	--text: hsl(0, 16%, 15%);
	--text-light: hsl(0, 4%, 33%);
	--code-bg: hsl(0, 39%, 97%);
	--code-text: hsl(0, 100%, 30%);
	--border: hsl(0, 32%, 80%);
	--selection: hsl(var(--primary-hs), 90%);
	--marked: var(--primary);
	--accent: var(--secondary);
	--shadow: 0 2px 6px hsla(0, 0%, 0%, 0.15);
	--shadow-sm: 0 2px 4px hsla(0, 0%, 0%, 0.15);


	--link-color: hsl(0, 100%, 30%);
	--link-hover: hsl(0, 100%, 25%);
	--button-text: hsl(0, 0%, 100%);
}

@media (prefers-color-scheme: dark) {
	:root {
		--bg: hsl(0, 0%, 7%);
		--bg-sidebar: hsl(0, 9%, 9%);
		--text: hsl(0, 0%, 100%);
		--text-light: hsl(0, 0%, 80%);
		--code-bg: hsl(0, 18%, 15%);
		--code-text: hsl(20, 100%, 75%);
		--border: hsl(0, 14%, 27%);
		--selection: hsla(9, 100%, 64%, 0.25);
		--primary: hsl(0, 48%, 49%);
		--primary-light: hsl(5, 100%, 75%);
		--primary-dark: hsl(0, 67%, 47%);
		--secondary: hsl(350, 87%, 55%);
		--secondary-light: hsl(341, 100%, 69%);
		--secondary-dark: hsl(340, 100%, 35%);
		--accent: var(--secondary);

		--link-color: hsl(0, 100%, 66%);
		--link-hover: hsl(5, 100%, 75%);
		--button-text: hsl(0, 0%, 100%);

		--primary-hs: 0, 48%;
		--secondary-hs: 350, 87%;
	}
}

/* Base styling */
* {
	box-sizing: border-box;
}

html {
	scroll-behavior: smooth;
	tab-size: var(--tab-size, 2rem);
}

/* Accessibility improvements */
:focus {
	outline: 3px solid hsl(231, 48%, 70%);
	outline-offset: 2px;
}

:focus:not(:focus-visible) {
	outline: none;
}

:focus-visible {
	outline: 3px solid hsl(231, 48%, 70%);
	outline-offset: 2px;
}

/* Ensure reduced motion preferences are respected */
@media (prefers-reduced-motion: reduce) {
	html {
		scroll-behavior: auto;
	}

	*, *::before, *::after {
		animation-duration: 0.01ms !important;
		animation-iteration-count: 1 !important;
		transition-duration: 0.01ms !important;
	}
}

/* Skip link for better keyboard navigation */
.skip-link {
	position: absolute;
	top: 0;
	left: 0;
	transform: translateX(-100%);
	z-index: 9999;
	background-color: var(--primary);
	color: white;
	padding: 0.5rem 1rem;
	text-decoration: none;
	transition: transform 0.3s ease-in-out;
}

.skip-link:focus {
	transform: translateX(0);
}

/* Typography */
::selection {
	background-color: var(--selection);
}

h1, h2, h3, h4, h5, h6 {
	margin-bottom: 1rem;
	margin-top: 2rem;
	font-weight: 700;
	line-height: 1.25;
	color: var(--text);
}

h1 {
	font-size: 2.25rem;
	margin-top: 0;
	color: var(--primary-dark);
}
h1 > a {
	font-weight: unset;
	color: unset;
}

h3 {
	font-size: 1.25rem;
	color: var(--secondary);
}

p {
	margin-bottom: 1.5rem;
}

a {
	color: var(--link-color, var(--primary));
	transition: color 0.2s ease;
	font-weight: 500;
	text-underline-offset: 3px;
	transition: color 0.2s ease, text-underline-offset 0.2s ease;
}
a:visited {
	--link-color: var(--secondary, #700037);
}
a:hover {
	--link-color: var(--link-hover, var(--primary-light));
	text-underline-offset: 5px;
}

code, pre {
	font-family: var(--font-mono);
	font-size: 0.9em;
	border-radius: var(--border-radius);
}

code {
	background-color: var(--code-bg);
	color: var(--code-text);
	padding: 0.2em 0.4em;
	word-wrap: break-word;
}

pre {
	background-color: var(--code-bg);
	padding: 1rem;
	overflow-x: auto;
	margin-bottom: 1.5rem;
	border: 1px solid var(--border);
}

pre code {
	background-color: transparent;
	padding: 0;
}
figure {
	width: 100%;
	text-align: center;
	color: var(--text-light);
	border: 1px dashed var(--border);
	border-radius: var(--border-radius);

	img {
		object-fit: contain;
		border-radius: var(--border-radius);
		box-shadow: var(--shadow);
		max-width: 100%;
	}
}

/* Layout */
body {
	font-family: var(--font-main);
	background-color: var(--bg);
	color: var(--text);
	line-height: 1.6;
	font-size: 1.05rem;
	display: grid;
	grid-template-columns: 100%;
	grid-template-areas:
		"header"
		"sidebar"
		"content";
	min-height: 100vh;
	margin: 0;
	--_gap: .75em;
	gap: var(--_gap);
	padding: var(--_gap);
}
@media (min-width: 768px) {
	body {
		grid-template-rows: auto 1fr;
		grid-template-columns: auto 1fr;
		grid-template-areas:
			"header header"
			"sidebar content";
	}
}
body > main {
	grid-area: content;
	max-width: 100%;
	overflow-x: hidden;
	display: grid;
	grid-template-columns:
	[full-main-start] 1fr
	[main-start] min(var(--body-max-width), 90%) [main-end]
	1fr [full-main-end];
}
body > main > *, body > main slot > * {
	width: 100%;
	max-width: 100%;
	margin-inline: auto;
	grid-column: main;
}

/* Page title with ID anchor for skip link */
h2 {
	margin-top: 0;
	border-bottom: 1px solid var(--border);
	padding-bottom: 0.75rem;
	margin-bottom: 1.5rem;
	color: var(--primary);
}

/* Section headings with better visual hierarchy */
body > main h3, body > main h4 {
	scroll-margin-top: 1rem;
}

/* Make clickable heading links for better navigation */
.heading-anchor {
	color: var(--text-light);
	text-decoration: none;
	font-weight: normal;
	opacity: .4;
	transition: opacity .2s;

	&:hover { opacity: .8; }
}

/* Boxes */
.illustration{
	grid-column: full-main;
	width: calc(100% - .75em);
}
.illustration:not(:has( .comparison)){
	grid-column: main;

	pre {
		background: none;
		border-style: dashed !important;
		width: fit-content;
		padding: 1em 2em;
	}
}

.comparison {
	display: grid;
	grid-template-columns: 1fr;
	gap: calc(.75em / 2);
	margin: 1.5rem 0;

	> div {
		width: 100%;
		overflow: hidden;
	}
}

@media (min-width: 768px) {
	.comparison {
		grid-template-columns: 1fr 1fr;
	}
}

.good-practice, .bad-practice {
	border: 1px solid var(--border);
	border-radius: var(--border-radius);
	border-top: 4px solid var(--practice-color);
	padding: 0 1rem;
}
.good-practice {
	--practice-color: hsl(145, 63%, 49%); }
.bad-practice {
	--practice-color: hsl(340, 82%, 52%); }

/* Icon styling */
.icon {
	display: inline-block;
	width: 1em;
	height: 1em;
	vertical-align: -0.125em;
	stroke-width: 0;
	stroke: currentColor;
	fill: currentColor;
}

/* Information blocks */
.note, .tip, .warning, .callout, .troubleshooting {
	padding: 1rem 1.25rem;
	margin: 1.5rem 0;
	border-radius: var(--border-radius);
	position: relative;
	font-size: 0.95rem;
	line-height: 1.5;
	background-color: var(--bg-sidebar);
	border-radius: 0 var(--border-radius) var(--border-radius) 0;
	--block-color: var(--primary);
	border-left: 4px solid var(--block-color);

	h4 { margin-top: 0; }
}
.tip {
	--block-color: hsl(145, 63%, 49%); }
.warning {
	--block-color: hsl(48, 89%, 50%); }

.callout {
	--block-color: hsl(231, 48%, 70%); }

.troubleshooting {
	--block-color: hsl(340, 82%, 52%); }

.note::before, .tip::before, .warning::before, .callout::before, .troubleshooting::before {
	font-weight: 600;
	display: block;
	margin-bottom: 0.5rem;
	color: var(--block-color);
}

.note::before {
	content: "Note"; }
.warning::before {
	content: "Warning"; }

/* Function table styling */
.function-table {
	border: 1px solid var(--border);
	border-radius: var(--border-radius);
	padding: 1rem;
	margin: 1.5rem 0;
	background-color: var(--bg-sidebar);
}

.function-table h4 {
	margin-top: 0;
	color: var(--primary);
	font-family: var(--font-mono);
	border-bottom: 1px solid var(--border);
	padding-bottom: 0.5rem;
	margin-bottom: 1rem;
}

.function-table dl {
	margin: 0;
}

.function-table dt {
	font-weight: 600;
	margin-top: 0.75rem;
}

.function-table dd {
	margin-left: 1rem;
	margin-bottom: 0.75rem;
	white-space: pre-wrap;
	word-wrap: break-word;
}

/* Tabs styling */
.tabs {
	border: 1px solid var(--border);
	border-radius: var(--border-radius);
	margin: 1.5rem 0;
	overflow: hidden;
}

.tab {
	padding: 1rem;
	border-top: 1px solid var(--border);
}

.tab:first-child {
	border-top: none;
}

.tab h4 {
	margin-top: 0;
	margin-bottom: 0.75rem;
	font-size: 1.1rem;
}

@media (min-width: 768px) {
	.tabs {
		display: flex;
		flex-flow: row wrap;
	}

	.tab {
		flex: 1;
		min-width: 50%;
		border-top: none;
		display: flex;
		flex-flow: column nowrap;
		align-items: center;
		text-align: justify;
	}

	.tab:first-child {
		border-inline-end: 1px solid var(--border);
	}
}

/* Prev/Next buttons */
.prev-next {
	display: flex;
	justify-content: space-between;
	margin-top: 3rem;
	padding-top: 1.5rem;
	border-top: 1px solid var(--border);
}

.prev-next a {
	display: flex;
	align-items: center;
	padding: 0.5rem 1rem;
	border-radius: var(--border-radius);
	background-color: var(--primary);
	color: white;
	transition: background-color 0.2s ease;
}

.prev-next a:hover {
	background-color: var(--primary-dark);
	text-decoration: none;
}

.prev-next a:empty {
	display: none;
}

.prev-next a[rel="prev"]::before {
	content: "←";
	margin-right: 0.5rem;
}

.prev-next a[rel="next"]::after {
	content: "→";
	margin-left: 0.5rem;
}
`;
