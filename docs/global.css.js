import { styles } from "./ssr.js";
styles.css`
:root {
	--primary: #b71c1c;
	--primary-light: #f05545;
	--primary-dark: #7f0000;
	--primary-rgb: 183, 28, 28;
	--secondary: #700037;
	--secondary-light: #ae1357;
	--secondary-dark: #4a0027;
	--secondary-rgb: 112, 0, 55;

	--font-main: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
	--font-mono: 'Fira Code', 'JetBrains Mono', 'SF Mono', SFMono-Regular, Consolas, 'Liberation Mono', Menlo, monospace;

	--body-max-width: 40rem;
	--sidebar-width: 20rem;
	--header-height: 4rem;
	--border-radius: 0.375rem;

	--bg: #ffffff;
	--bg-sidebar: #fff5f5;
	--text: #1a1313;
	--text-light: #555050;
	--code-bg: #f9f2f2;
	--code-text: #9a0000;
	--border: #d8c0c0;
	--selection: rgba(183, 28, 28, 0.15);
	--marked: #b71c1c;
	--accent: var(--secondary);
	--shadow: 0 2px 6px rgba(0, 0, 0, 0.15);

	--link-color: #9a0000;
	--link-hover: #7f0000;
	--button-text: #ffffff;
}

@media (prefers-color-scheme: dark) {
	:root {
		--bg: #121212;
		--bg-sidebar: #1a1212;
		--text: #ffffff;
		--text-light: #cccccc;
		--code-bg: #2c2020;
		--code-text: #ff9e80;
		--border: #4d3939;
		--selection: rgba(255, 99, 71, 0.25);
		--primary: #b74141;
		--primary-light: #ff867f;
		--primary-dark: #c62828;
		--secondary: #f02b47;
		--secondary-light: #ff6090;
		--secondary-dark: #b0003a;
		--accent: var(--secondary);

		--link-color: #ff5252;
		--link-hover: #ff867f;
		--button-text: #ffffff;

		--nav-current-bg: #aa2222;
		--nav-current-text: #ffffff;

		--primary-rgb: 255, 82, 82;
		--secondary-rgb: 233, 30, 99;
	}
}

/* Base styling */
* {
	box-sizing: border-box;
}

html {
	scroll-behavior: smooth;
}

/* Accessibility improvements */
:focus {
	outline: 3px solid rgba(63, 81, 181, 0.5);
	outline-offset: 2px;
}

:focus:not(:focus-visible) {
	outline: none;
}

:focus-visible {
	outline: 3px solid rgba(63, 81, 181, 0.5);
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

body {
	font-family: var(--font-main);
	background-color: var(--bg);
	color: var(--text);
	line-height: 1.6;
	font-size: 1rem;
	display: grid;
	grid-template-columns: 100%;
	grid-template-areas:
		"header"
		"sidebar"
		"content";
	min-height: 100vh;
}

::selection {
	background-color: var(--selection);
}

/* Typography */
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

/* Layout */
@media (min-width: 768px) {
	body {
		grid-template-rows: var(--header-height) 1fr;
		grid-template-columns: var(--sidebar-width) 1fr;
		grid-template-areas:
			"header header"
			"sidebar content";
	}
}

/* Main content */
body > main {
	grid-area: content;
	padding: 2rem;
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
body > main .page-title {
	margin-top: 0;
	border-bottom: 1px solid var(--border);
	padding-bottom: 0.75rem;
	margin-bottom: 1.5rem;
	color: var(--primary);
	position: relative;
}

/* Section headings with better visual hierarchy */
body > main h2, body > main h3 {
	scroll-margin-top: calc(var(--header-height) + 1rem);
	position: relative;
}

body > main h3 {
	border-left: 3px solid var(--primary);
	position: relative;
	left: -1.5rem;
	padding-inline-start: 1em;
}

/* Make clickable heading links for better navigation */
.heading-anchor {
	position: absolute;
	color: var(--text-light);
	left: -2rem;
	text-decoration: none;
	font-weight: normal;
	opacity: 0;
	transition: opacity 0.2s;
}
h2:hover .heading-anchor,
h3:hover .heading-anchor {
	opacity: 0.8;
}

@media (max-width: 767px) {
	body > main {
		padding: 1.5rem 1rem;
	}
	body > main h2, body > main h3 {
		left: 1rem;
		width: calc(100% - 1rem);
	}
	.heading-anchor {
		opacity: 0.4;
	}
}

/* Example boxes */
.example {
	border: 1px solid var(--border);
	border-radius: var(--border-radius);
	margin: 2rem 0;
	overflow: hidden;
	box-shadow: var(--shadow-sm);
	transition: box-shadow 0.2s;
}

.example:hover {
	box-shadow: var(--shadow);
}

.example-header {
	background-color: var(--bg-sidebar);
	padding: 0.75rem 1rem;
	border-bottom: 1px solid var(--border);
	font-weight: 600;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.example-content {
	padding: 1.25rem;
}

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
.note, .tip, .warning {
	padding: 1rem 1.25rem;
	margin: 1.5rem 0;
	border-radius: var(--border-radius);
	position: relative;
	font-size: 0.95rem;
	line-height: 1.5;
}

.note {
	background-color: rgba(63, 81, 181, 0.08);
	border-left: 4px solid var(--primary);
	border-radius: 0 var(--border-radius) var(--border-radius) 0;
}

.tip {
	background-color: rgba(46, 204, 113, 0.08);
	border-left: 4px solid #2ecc71;
	border-radius: 0 var(--border-radius) var(--border-radius) 0;
}

.warning {
	background-color: rgba(241, 196, 15, 0.08);
	border-left: 4px solid #f1c40f;
	border-radius: 0 var(--border-radius) var(--border-radius) 0;
}

.note::before, .tip::before, .warning::before {
	font-weight: 600;
	display: block;
	margin-bottom: 0.5rem;
}

.note::before {
	content: "Note";
	color: var(--primary);
}

.tip::before {
	content: "Tip";
	color: #2ecc71;
}

.warning::before {
	content: "Warning";
	color: #f1c40f;
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
