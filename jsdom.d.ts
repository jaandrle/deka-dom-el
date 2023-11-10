import { el, assign, on } from "./index.d";
export * from "./index.d";
export function register(dom: JSDOM): Promise<{
	el: typeof el,
	assign: typeof assign,
	on: typeof on
}>
