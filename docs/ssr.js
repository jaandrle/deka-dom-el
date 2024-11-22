export { t } from "./utils/index.js";
export const path_target= {
	root: "dist/docs/",
	css: "dist/docs/"
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
 * @param {HTMLScriptElement|HTMLLinkElement} [element_head]
 * */
export function registerClientFile(url, element_head){
	const file_name= url.pathname.split("/").pop();
	s.cat(url).to(path_target.root+file_name);

	if(!element_head) return;
	element_head[element_head instanceof HTMLScriptElement ? "src" : "href"]= file_name;
	document.head.append(
		element_head
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
