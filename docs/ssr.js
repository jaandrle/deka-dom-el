export { t } from "./utils/index.js";
export const path_target= {
	root: "dist/docs/",
	css: "dist/docs/",
	assets: "dist/docs/assets/"
};
/**
 * This variable will be filled with the list of pages during the build process (see `bs/docs.js`).
 * @type {import("./types.d.ts").Info[]}
 * */
export let pages= [];
/**
 * @typedef registerClientFile
 * @type {function}
 * @param {URL} url
 * @param {Object} [options]
 * @param {HTMLScriptElement|HTMLLinkElement} [options.head]
 * @param {string} [options.folder]
 * @param {function} [options.replacer]
 * */
export function registerClientFile(url, { head, folder= "", replacer }= {}){
	if(folder && !folder.endsWith("/")) folder+= "/";
	const file_name= url.pathname.split("/").pop();
	s.mkdir("-p", path_target.root+folder);
	let content= s.cat(url)
	if(replacer) content= s.echo(replacer(content.toString()));
	content.to(path_target.root+folder+file_name);

	if(!head) return;
	head[head instanceof HTMLScriptElement ? "src" : "href"]= file_name;
	document.head.append(
		head
	);
}

const events= {
	oneachrender: new Set(),
	onssrend: new Set()
};
/** @param {keyof typeof events} name @param {function} listener */
export function addEventListener(name, listener){
	events[name].add(listener);
}
/** @param {keyof typeof events} name @param {any} a */
export function dispatchEvent(name, a){
	const ls= events[name];
	ls.forEach(l=> l(a));
	if(name!=="oneachrender")
		ls.clear();
}

export const styles= {
	element: null,
	name: "global.css",
	get location(){ return path_target.css.replace(path_target.root, "")+this.name; },
	content: "",

	/** @param {Parameters<typeof String.raw>} a */
	css(...a){
		let c= css(...a);
		if(this.content) this.content+= "\n";
		this.content+= c;
		return this;
	}
};
addEventListener("oneachrender", ()=> document.head.append(
	Object.assign(document.createElement("link"), { rel: "stylesheet", href: styles.location })
));
/** @type {typeof String.raw} */
function css(...a){ return String.raw(...a).trim(); }
