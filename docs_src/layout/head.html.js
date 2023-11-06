import { el } from "deka-dom-el";
/**
 * @param {object} def
 * @param {string} def.id Page `id` is used as stylesheet name.
 * @param {string} def.title Page `title` is also used as `h1`
 * @param {string} def.description Page 'description'.
 * @param {object} def.pkg Package information.
 * @param {string} def.pkg.name
 * @param {string} def.pkg.description
 * @param {string} def.pkg.homepage
 * @param {{ root: string, css: string}} def.path_target Final URL where the page will be rendered.
 * @param {object} def
 * */
export function head({ id, title, description, pkg, path_target }){
	return el().append(
		el("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }),
		el("link", { rel: "stylesheet", href: stylesheetHref(path_target, id) }),
		
		el("meta", { name: "description", content: description }),
		el(metaTwitter, pkg),
		el(metaFacebook, pkg),
		el("title", title),
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
function stylesheetHref(path_target, name){
	return path_target.css.replace(path_target.root, "")+name+".css";
}
