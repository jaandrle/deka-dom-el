export const path_target= {
	root: "docs/",
	css: "docs/"
};
export const pages= [
	{ id: "index", href: "./", title: "Introduction", description: "Introducing a library." },
	{ id: "p02-elements", href: "p02-elements", title: "Elements", description: "Basic concepts of elements modifications and creations." },
	{ id: "p03-events", href: "p03-events", title: "Events and Addons", description: "Using not only events in UI declaratively." },
	{ id: "p04-signals", href: "p04-signals", title: "Signals and reactivity", description: "Handling reactivity in UI via signals." },
];
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
