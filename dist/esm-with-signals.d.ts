type CustomElementTagNameMap= { '#text': Text, '#comment': Comment }
type SupportedElement=
	  HTMLElementTagNameMap[keyof HTMLElementTagNameMap]
	| SVGElementTagNameMap[keyof SVGElementTagNameMap]
	| MathMLElementTagNameMap[keyof MathMLElementTagNameMap]
	| CustomElementTagNameMap[keyof CustomElementTagNameMap];
declare global {
	type ddeComponentAttributes= Record<any, any> | undefined | string;
	type ddeElementModifier<El extends SupportedElement | DocumentFragment>= (element: El)=> El;
}
type AttrsModified= {
	/**
	 * Use string like in HTML (internally uses `*.setAttribute("style", *)`), or object representation (like DOM API).
	 */
	style: string | Partial<CSSStyleDeclaration>
	/**
	 * Provide option to add/remove/toggle CSS clasess (index of object) using 1/0/-1. In fact `el.classList.toggle(class_name)` for `-1` and `el.classList.toggle(class_name, Boolean(...))` for others.
	 */
	classList: Record<string,-1|0|1|boolean>,
	/**
	 * By default simiral to `className`, but also supports `string[]`
	 * */
	className: string | (string|boolean|undefined)[];
	/**
	 * Sets `aria-*` simiraly to `dataset`
	 * */
	ariaset: Record<string,string>,
}
/**
 * Just element attributtes
 *
 * In most cases, you can use native propertie such as [MDN WEB/API/Element](https://developer.mozilla.org/en-US/docs/Web/API/Element) and so on (e.g. [`Text`](https://developer.mozilla.org/en-US/docs/Web/API/Text)).
 *
 * There is added support for `data[A-Z].*`/`aria[A-Z].*` to be converted to the kebab-case alternatives.
 * @private
 */
type ElementAttributes<T extends SupportedElement>= Omit<T,keyof AttrsModified> & AttrsModified;
export function assign<El extends SupportedElement>(element: El, ...attrs_array: Partial<ElementAttributes<El>>[]): El
type ExtendedHTMLElementTagNameMap= HTMLElementTagNameMap & CustomElementTagNameMap
interface element<el>{
	prototype: el;
	append(...els: (SupportedElement | DocumentFragment | string | element<SupportedElement | DocumentFragment>)[]): el
}
export function el<TAG extends keyof ExtendedHTMLElementTagNameMap>(
	tag_name: TAG,
	attrs?: string | Partial<ElementAttributes<ExtendedHTMLElementTagNameMap[TAG]>>,
	...modifiers: ddeElementModifier<ExtendedHTMLElementTagNameMap[TAG]>[]
): element<ExtendedHTMLElementTagNameMap[TAG]>
export function el<T>(
	tag_name?: "<>",
): element<DocumentFragment>
export function el<
	A extends ddeComponentAttributes,
	C extends (attr: A)=> SupportedElement | DocumentFragment>(
	fComponent: C,
	attrs?: A,
	...modifiers: ddeElementModifier<ReturnType<C>>[]
): element<ReturnType<C>>
export function el(
	tag_name: string,
	attrs?: string | Record<string, any>,
	...modifiers: ddeElementModifier<HTMLElement>[]
): element<HTMLElement>
export function elNS(
	namespace: "http://www.w3.org/2000/svg"
): <TAG extends keyof SVGElementTagNameMap, KEYS extends keyof SVGElementTagNameMap[TAG] & { d: string }>(
	tag_name: TAG,
	attrs?: string | Partial<{ [key in KEYS]: SVGElementTagNameMap[TAG][key] | string | number | boolean }>,
	...modifiers: ddeElementModifier<SVGElementTagNameMap[TAG]>[]
)=> element<SVGElementTagNameMap[TAG]>
export function elNS(
	namespace: "http://www.w3.org/1998/Math/MathML"
): <TAG extends keyof MathMLElementTagNameMap, KEYS extends keyof MathMLElementTagNameMap[TAG] & { d: string }>(
	tag_name: TAG,
	attrs?: string | Partial<{ [key in KEYS]: MathMLElementTagNameMap[TAG][key] | string | number | boolean }>,
	...modifiers: ddeElementModifier<MathMLElementTagNameMap[TAG]>[]
)=> element<MathMLElementTagNameMap[TAG]>
export function elNS(
	namespace: string
): (
	tag_name: string,
	attrs?: string | Record<string, any>,
	...modifiers: ddeElementModifier<SupportedElement>[]
)=> element<SupportedElement>
export function dispatchEvent(element: SupportedElement, name: keyof DocumentEventMap): void;
export function dispatchEvent(element: SupportedElement, name: string, data: any): void;
interface On{
	<
		EE extends ddeElementModifier<SupportedElement>,
		El extends ( EE extends ddeElementModifier<infer El> ? El : never ),
		Event extends keyof DocumentEventMap>(
			type: Event,
			listener: (this: El, ev: DocumentEventMap[Event]) => any,
			options?: AddEventListenerOptions
		) : EE;
	connected<
		EE extends ddeElementModifier<SupportedElement>,
		El extends ( EE extends ddeElementModifier<infer El> ? El : never )
		>(
			listener: (el: El) => any,
			options?: AddEventListenerOptions
		) : EE;
	disconnected<
		EE extends ddeElementModifier<SupportedElement>,
		El extends ( EE extends ddeElementModifier<infer El> ? El : never )
		>(
			listener: (el: El) => any,
			options?: AddEventListenerOptions
		) : EE;
}
export const on: On;
export const scope: {
	host: ddeElementModifier<any>,
};
export type Signal<V, A>= (set?: V)=> V & A;
type Action<V>= (this: { value: V }, ...a: any[])=> typeof S._ | void;
type SymbolOnclear= Symbol;
type SymbolSignal= Symbol;
type Actions<V>= Record<string, Action<V>>;
interface S {
	_: Symbol
	/**
	 * Simple example:
	 * ```js
	 * const hello= S("Hello Signal");
	 * ```
	 * …simple todo signal:
	 * ```js
	 * const todos= S([], {
	 * 	add(v){ this.value.push(S(v)); },
	 * 	remove(i){ this.value.splice(i, 1); },
	 * 	[S.symbols.onclear](){ S.clear(...this.value); },
	 * });
	 * ```
	 * …computed signal:
	 * ```js
	 * const name= S("Jan");
	 * const surname= S("Andrle");
	 * const fullname= S(()=> name()+" "+surname());
	 * ```
	 * @param value Initial signal value. Or function computing value from other signals.
	 * @param actions Use to define actions on the signal. Such as add item to the array.
	 *		There is also a reserved function `S.symbol.onclear` which is called when the signal is cleared
	 *		by `S.clear`.
	 * */
	<V, A extends Actions<V>>(value: V, actions?: A): Signal<V, A>;
	action<S extends Signal<any, Actions<any>>, A extends (S extends Signal<any, infer A> ? A : never), N extends keyof A>(
		signal: S,
		name: N,
		...params: A[N] extends (...args: infer P)=> any ? P : never
	): void;
	clear(...signals: Signal<any, any>[]): void;
	on<T>(signal: Signal<T, any>, onchange: (a: T)=> void, options?: AddEventListenerOptions): void;
	symbols: {
		signal: SymbolSignal;
		onclear: SymbolOnclear;
	}
	el<S extends any, T extends HTMLElement>(signal: Signal<S, any>, el: (v: S)=> T): T;
}
export const S: S;
declare global {
	type ddeSignal<T, A= {}>= Signal<T, A>;
	type ddeActions<V>= Actions<V>
}