import { el, elNS } from "deka-dom-el";
import { pages, styles } from "../ssr.js";
const host= "."+header.name;
const host_nav= "."+nav.name;
styles.css`
/* Header */
${host} {
	grid-area: header;
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: space-between;
	padding: 0.75rem 1.5rem;
	background-color: var(--primary);
	color: white;
	box-shadow: var(--shadow);
	min-height: calc(var(--header-height) - 1em);
	--_m: .75em;
	margin: var(--_m) var(--_m) 0 var(--_m);
	border-radius: var(--border-radius);
}

${host} .header-title {
	display: flex;
	align-items: center;
	gap: 0.75rem;
}

${host} h1 {
	font-size: 1.25rem;
	margin: 0;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	color: white;
}

${host} .version-badge {
	font-size: 0.75rem;
	background-color: hsla(0, 0%, 59%, 0.2);
	padding: 0.25rem 0.5rem;
	border-radius: var(--border-radius);
}

${host} p {
	display: block;
	font-size: 0.875rem;
	opacity: 0.9;
	margin: 0;
}

${host} .github-link {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	color: white;
	font-size: 0.875rem;
	padding: 0.375rem 0.75rem;
	border-radius: var(--border-radius);
	background-color: hsla(0, 0%, 0%, 0.2);
	text-decoration: none;
	transition: background-color 0.2s;
}

${host} .github-link:hover {
	background-color: hsla(0, 0%, 0%, 0.3);
	text-decoration: none;
}

/* Navigation */
${host_nav} {
	grid-area: sidebar;
	background-color: var(--bg-sidebar);
	border-right: 1px solid var(--border);
	padding: 1.5rem 1rem;
	overflow-y: auto;
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}

${host_nav} a {
	display: flex;
	align-items: center;
	padding: 0.625rem 0.75rem;
	border-radius: var(--border-radius);
	color: var(--text);
	transition: background-color 0.1s ease, color 0.1s ease, transform 0.1s ease, box-shadow 0.1s ease;
	line-height: 1.2;
}

${host_nav} a.current,
${host_nav} a[aria-current=page] {
	background-color: hsl(var(--primary-hs), 40%);
	color: whitesmoke;
	font-weight: 600;
	box-shadow: var(--shadow);
}

${host_nav} a:hover {
	background-color: hsl(var(--primary-hs), 45%);
	color: whitesmoke;
	transform: translateY(-1px);
}

${host_nav} a .nav-number {
	color: rgb(from currentColor r g b / .75);
}

${host_nav} a:first-child {
	display: flex;
	align-items: center;
	font-weight: 600;
	margin-bottom: 0.5rem;
}

/* Mobile navigation */
@media (max-width: 767px) {
	${host_nav} {
		padding: 0.75rem;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		gap: 0.5rem;
		border-bottom: 1px solid var(--border);
		border-right: none;
		justify-content: center;
	}

	${host_nav} a {
		font-size: 0.875rem;
		padding: 0.375rem 0.75rem;
		white-space: nowrap;
	}

	${host_nav} a .nav-number {
		width: auto;
		margin-right: 0.25rem;
	}

	${host_nav} a:first-child {
		margin-bottom: 0;
		margin-right: 0.5rem;
		min-width: 100%;
		justify-content: center;
	}
}
`;
/**
 * @param {object} def
 * @param {import("../types.d.ts").Info} def.info
 * @param {import("../types.d.ts").Pkg} def.pkg Package information.
 * */
export function header({ info: { href, title, description }, pkg }){
	const pageTitle = `${pkg.name} — ${title}`;

	// Add meta elements to the head
	document.head.append(
		head({ title: pageTitle, description, pkg })
	);

	return el().append(
		// Header section with accessibility support
		el("header", { role: "banner", className: header.name }).append(
			el("div", { className: "header-title" }).append(
				el("a", {
					href: pkg.homepage,
					className: "github-link",
					"aria-label": "View on GitHub",
					target: "_blank",
					rel: "noopener noreferrer"
				}).append(
					el(iconGitHub),
				),
				el("h1").append(
					el("a", { href: pages[0].href, textContent: pkg.name, title: "Go to documentation homepage" }),
				),
				el("span", {
					className: "version-badge",
					"aria-label": "Version",
					textContent: pkg.version || ""
				})
			),
			el("p", description),
		),

		// Navigation between pages
		nav({ href })
	);
}
function nav({ href }){
	return el("nav", {
		role: "navigation",
		"aria-label": "Main navigation",
		className: nav.name
	}).append(
		...pages.map((p, i) => {
			const isIndex = p.href === "index";
			const isCurrent = p.href === href;

			return el("a", {
				href: isIndex ? "./" : p.href,
				title: p.description || `Go to ${p.title}`,
				"aria-current": isCurrent ? "page" : null,
				classList: { current: isCurrent }
			}).append(
				el("span", {
					className: "nav-number",
					"aria-hidden": "true",
					textContent: `${i+1}. `
				}),
				p.title
			);
		})
	);
}
function head({ title, description, pkg }){
	return el().append(
		el("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }),
		el("meta", { name: "description", content: description }),
		el("meta", { name: "theme-color", content: "#b71c1c" }),
		el("title", title),
		el(metaAuthor),
		el(metaTwitter, pkg),
		el(metaFacebook, pkg),
	);
}
function metaAuthor(){
	return el().append(
		el("meta", { name: "author", content: "Jan Andrle" }),
		el("link", { type: "text/plain", rel: "author", href: "https://jaandrle.github.io/humans.txt" }),
		el("meta", { name: "generator", content: "deka-dom-el" }),
	);
}
function metaTwitter({ name, description, homepage }){
	return el().append(
		el("meta", { name: "twitter:card", content: "summary_large_image" }),
		//el("meta", { name: "twitter:domain", content: "" }),
		el("meta", { name: "twitter:url", content: homepage }),
		el("meta", { name: "twitter:title", content: name }),
		el("meta", { name: "twitter:description", content: description }),
		//el("meta", { name: "twitter:image", content: "" }),
		el("meta", { name: "twitter:creator", content: "@jaandrle" }),
	);
}
function metaFacebook({ name, description, homepage }){
	return el().append(
		el("meta", { name: "og:url", content: homepage }),
		el("meta", { name: "og:title", content: name }),
		el("meta", { name: "og:description", content: description }),
		//el("meta", { name: "og:image", content: "" }),
		el("meta", { name: "og:creator", content: "@jaandrle" }),
	);
}
function iconGitHub(){
	const el= elNS("http://www.w3.org/2000/svg");
	return el("svg", { className: "icon", viewBox: "0 0 32 32" }).append(
		el("path", { d: [ //see https://svg-path-visualizer.netlify.app/#M16%200.395c-8.836%200-16%207.163-16%2016%200%207.069%204.585%2013.067%2010.942%2015.182%200.8%200.148%201.094-0.347%201.094-0.77%200-0.381-0.015-1.642-0.022-2.979-4.452%200.968-5.391-1.888-5.391-1.888-0.728-1.849-1.776-2.341-1.776-2.341-1.452-0.993%200.11-0.973%200.11-0.973%201.606%200.113%202.452%201.649%202.452%201.649%201.427%202.446%203.743%201.739%204.656%201.33%200.143-1.034%200.558-1.74%201.016-2.14-3.554-0.404-7.29-1.777-7.29-7.907%200-1.747%200.625-3.174%201.649-4.295-0.166-0.403-0.714-2.030%200.155-4.234%200%200%201.344-0.43%204.401%201.64%201.276-0.355%202.645-0.532%204.005-0.539%201.359%200.006%202.729%200.184%204.008%200.539%203.054-2.070%204.395-1.64%204.395-1.64%200.871%202.204%200.323%203.831%200.157%204.234%201.026%201.12%201.647%202.548%201.647%204.295%200%206.145-3.743%207.498-7.306%207.895%200.574%200.497%201.085%201.47%201.085%202.963%200%202.141-0.019%203.864-0.019%204.391%200%200.426%200.288%200.925%201.099%200.768%206.354-2.118%2010.933-8.113%2010.933-15.18%200-8.837-7.164-16-16-16z // editorconfig-checker-disable-line
			"M 16,0.395",
			"c -8.836,0 -16,7.163 -16,16",
			"c 0,7.069 4.585,13.067 10.942,15.182",
			"c 0.8,0.148 1.094,-0.347 1.094,-0.77",
			"c 0,-0.381 -0.015,-1.642 -0.022,-2.979",
			"c -4.452,0.968 -5.391,-1.888 -5.391,-1.888",
			"c -0.728,-1.849 -1.776,-2.341 -1.776,-2.341",
			"c -1.452,-0.993 0.11,-0.973 0.11,-0.973",
			"c 1.606,0.113 2.452,1.649 2.452,1.649",
			"c 1.427,2.446 3.743,1.739 4.656,1.33",
			"c 0.143,-1.034 0.558,-1.74 1.016,-2.14",
			"c -3.554,-0.404 -7.29,-1.777 -7.29,-7.907",
			"c 0,-1.747 0.625,-3.174 1.649,-4.295",
			"c -0.166,-0.403 -0.714,-2.03 0.155,-4.234",
			"c 0,0 1.344,-0.43 4.401,1.64",
			"c 1.276,-0.355 2.645,-0.532 4.005,-0.539",
			"c 1.359,0.006 2.729,0.184 4.008,0.539",
			"c 3.054,-2.07 4.395,-1.64 4.395,-1.64",
			"c 0.871,2.204 0.323,3.831 0.157,4.234",
			"c 1.026,1.12 1.647,2.548 1.647,4.295",
			"c 0,6.145 -3.743,7.498 -7.306,7.895",
			"c 0.574,0.497 1.085,1.47 1.085,2.963",
			"c 0,2.141 -0.019,3.864 -0.019,4.391",
			"c 0,0.426 0.288,0.925 1.099,0.768",
			"c 6.354,-2.118 10.933,-8.113 10.933,-15.18",
			"c 0,-8.837 -7.164,-16 -16,-16",
			"Z"
		].join("") })
	);
}
