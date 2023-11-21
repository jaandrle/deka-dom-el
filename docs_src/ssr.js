export const path_target= {
	root: "docs/",
	css: "docs/"
};
export const pages= [
	{ id: "index", href: "./", title: "Introduction", description: "Introducing a library." },
	{ id: "elements", href: "elements", title: "Elements", description: "Basic concepts of elements modifications and creations." },
	{ id: "events", href: "events", title: "Events and Addons", description: "Using not only events in UI declaratively." },
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

const scopes= new Set();
export const styles= {
	element: null,
	name: "global.css",
	get location(){ return path_target.css.replace(path_target.root, "")+this.name; },
	content: "",

	skip: false,
	/** @param {function|string} s */
	scope(s){
		if(scopes.has(s)){ this.skip= true; return this; }
		
		scopes.add(s);
		if(typeof s==="function") this.host= s.name;
		return this;
	},
	/** @param {Parameters<typeof String.raw>} a */
	css(...a){
		if(this.skip){ this.skip= false; return this; }
		
		let c= css(...a);
		if(this.host){
			c= c.replaceAll(":host", "."+this.host);
			this.host= "";
		}
		if(this.content) this.content+= "\n";
		this.content+= c;
		return this;
	}
};
addEventListener("onssrend", ()=> scopes.clear());
addEventListener("oneachrender", ()=> document.head.append(
	Object.assign(document.createElement("link"), { rel: "stylesheet", href: styles.location })
));
/** @type {typeof String.raw} */
function css(...a){ return String.raw(...a).trim(); }
