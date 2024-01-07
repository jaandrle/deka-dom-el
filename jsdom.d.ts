import { el, assign, on } from "./index.d";
export * from "./index.d";
type JSDOM= {
	window: Window,
	document: Document,
	HTMLElement: typeof HTMLElement,
	SVGElement: typeof SVGElement,
	DocumentFragment: typeof DocumentFragment,
	MutationObserver?: typeof MutationObserver
};
export function register(dom: JSDOM): Promise<{
	el: typeof el,
	assign: typeof assign,
	on: typeof on
}>
