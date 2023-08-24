[ HTMLElement, DocumentFragment ].forEach(c=> {
	const { append }= c.prototype;
	c.prototype.append= function(...els){ append.apply(this, els); return this; };
});
export * from "./src/dom.js";
export * from "./src/events.js";
export * from "./src/signals.js";
