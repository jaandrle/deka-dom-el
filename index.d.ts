import { Signal } from "./signals";
//TODO?
/** Is filled when function is succesfully called ⇒ and returns component's root element. */
type Host<el extends Element>= (extender?: ElementExtender<el>)=> el | undefined;
declare global {
	/**
	 * `ref` is filled when function is succesfully called ⇒ and returns component's root element.
	 * */
	type ddeComponent<
	A extends Record<any, any>,
	R extends Element,
	T extends string[] = []
	>= (attrs: A, ref: Host<R>)=> R & { _events: T };
}
type ElementTagNameMap= HTMLElementTagNameMap & SVGElementTagNameMap & {
	'#text': Text
}
type Element= ElementTagNameMap[keyof ElementTagNameMap];
type AttrsModified= {
	/**
	 * In fact argumen for `*.setAttribute("style", *)`.
	 */
	style: string
	/**
	 * Provide option to add/remove/toggle CSS clasess (index of object) using 1/0/-1. In fact `el.classList.toggle(class_name)` for `-1` and `el.classList.toggle(class_name, Boolean(...))` for others.
	 */
	classList: Record<string,-1|0|1>,
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
type ElementAttributes<T extends keyof ElementTagNameMap | ElementTagNameMap[keyof ElementTagNameMap]>=
	T extends keyof ElementTagNameMap ?
	Omit<ElementTagNameMap[T],"classList"|"className"> & AttrsModified :
	Omit<T,"classList"|"className"> & AttrsModified;
export function assign<El extends Element>(element: El, ...attrs_array: Partial<ElementAttributes<El>>[]): El

type ElementExtender<El extends Element>= (element: El)=> El;
type TagNameFragment= "<>";
export function el<TAG extends keyof ElementTagNameMap>(
	tag_name: TAG,
	attrs?: Partial<ElementAttributes<ElementTagNameMap[TAG]>>,
	...extenders: ElementExtender<ElementTagNameMap[TAG]>[]
): ElementTagNameMap[TAG]
export function el<T>(
	tag_name: TagNameFragment,
): DocumentFragment
export function el<R extends Element, T extends (attrs: any, host: Host<R>)=> R>(
	fComponent: T,
	attrs?: Parameters<T>,
	...extenders: ElementExtender<ReturnType<T>>[]
): ReturnType<T>

export function dispatchEvent(element: HTMLElement, name: keyof DocumentEventMap): void;
export function dispatchEvent(element: HTMLElement, name: string, data: any): void;
interface On{
	<
		EE extends ElementExtender<Element>,
		El extends ( EE extends ElementExtender<infer El> ? El : never ),
		Event extends keyof DocumentEventMap>(
			type: Event,
			listener: (this: El, ev: DocumentEventMap[Event]) => any,
			options?: AddEventListenerOptions
		) : EE;
	connected<
		EE extends ElementExtender<Element>,
		El extends ( EE extends ElementExtender<infer El> ? El : never )
		>(
			listener: (el: El) => any,
			options?: AddEventListenerOptions
		) : EE;
	disconnected<
		EE extends ElementExtender<Element>,
		El extends ( EE extends ElementExtender<infer El> ? El : never )
		>(
			listener: (el: El) => any,
			options?: AddEventListenerOptions
		) : EE;
}
export const on: On;

//TODO?
export type Fires<T extends string[]>= ( (...a: any[])=> any ) & { events: T };

//TODO for SVG
declare global{
	interface HTMLDivElement{ append(...nodes: (Node | string)[]): HTMLDivElement; }
	interface HTMLAnchorElement{ append(...nodes: (Node | string)[]): HTMLAnchorElement; }
	interface HTMLElement{ append(...nodes: (Node | string)[]): HTMLElement; }
	interface HTMLElement{ append(...nodes: (Node | string)[]): HTMLElement; }
	interface HTMLAreaElement{ append(...nodes: (Node | string)[]): HTMLAreaElement; }
	interface HTMLElement{ append(...nodes: (Node | string)[]): HTMLElement; }
	interface HTMLElement{ append(...nodes: (Node | string)[]): HTMLElement; }
	interface HTMLAudioElement{ append(...nodes: (Node | string)[]): HTMLAudioElement; }
	interface HTMLElement{ append(...nodes: (Node | string)[]): HTMLElement; }
	interface HTMLBaseElement{ append(...nodes: (Node | string)[]): HTMLBaseElement; }
	interface HTMLElement{ append(...nodes: (Node | string)[]): HTMLElement; }
	interface HTMLElement{ append(...nodes: (Node | string)[]): HTMLElement; }
	interface HTMLQuoteElement{ append(...nodes: (Node | string)[]): HTMLQuoteElement; }
	interface HTMLBodyElement{ append(...nodes: (Node | string)[]): HTMLBodyElement; }
	interface HTMLBRElement{ append(...nodes: (Node | string)[]): HTMLBRElement; }
	interface HTMLButtonElement{ append(...nodes: (Node | string)[]): HTMLButtonElement; }
	interface HTMLCanvasElement{ append(...nodes: (Node | string)[]): HTMLCanvasElement; }
	interface HTMLTableCaptionElement{ append(...nodes: (Node | string)[]): HTMLTableCaptionElement; }
	interface HTMLElement{ append(...nodes: (Node | string)[]): HTMLElement; }
	interface HTMLElement{ append(...nodes: (Node | string)[]): HTMLElement; }
	interface HTMLTableColElement{ append(...nodes: (Node | string)[]): HTMLTableColElement; }
	interface HTMLTableColElement{ append(...nodes: (Node | string)[]): HTMLTableColElement; }
	interface HTMLDataElement{ append(...nodes: (Node | string)[]): HTMLDataElement; }
	interface HTMLDataListElement{ append(...nodes: (Node | string)[]): HTMLDataListElement; }
	interface HTMLElement{ append(...nodes: (Node | string)[]): HTMLElement; }
	interface HTMLModElement{ append(...nodes: (Node | string)[]): HTMLModElement; }
	interface HTMLDetailsElement{ append(...nodes: (Node | string)[]): HTMLDetailsElement; }
	interface HTMLElement{ append(...nodes: (Node | string)[]): HTMLElement; }
	interface HTMLDialogElement{ append(...nodes: (Node | string)[]): HTMLDialogElement; }
	interface HTMLDivElement{ append(...nodes: (Node | string)[]): HTMLDivElement; }
	interface HTMLDListElement{ append(...nodes: (Node | string)[]): HTMLDListElement; }
	interface HTMLElement{ append(...nodes: (Node | string)[]): HTMLElement; }
	interface HTMLElement{ append(...nodes: (Node | string)[]): HTMLElement; }
	interface HTMLEmbedElement{ append(...nodes: (Node | string)[]): HTMLEmbedElement; }
	interface HTMLFieldSetElement{ append(...nodes: (Node | string)[]): HTMLFieldSetElement; }
	interface HTMLElement{ append(...nodes: (Node | string)[]): HTMLElement; }
	interface HTMLElement{ append(...nodes: (Node | string)[]): HTMLElement; }
	interface HTMLElement{ append(...nodes: (Node | string)[]): HTMLElement; }
	interface HTMLFormElement{ append(...nodes: (Node | string)[]): HTMLFormElement; }
	interface HTMLHeadingElement{ append(...nodes: (Node | string)[]): HTMLHeadingElement; }
	interface HTMLHeadingElement{ append(...nodes: (Node | string)[]): HTMLHeadingElement; }
	interface HTMLHeadingElement{ append(...nodes: (Node | string)[]): HTMLHeadingElement; }
	interface HTMLHeadingElement{ append(...nodes: (Node | string)[]): HTMLHeadingElement; }
	interface HTMLHeadingElement{ append(...nodes: (Node | string)[]): HTMLHeadingElement; }
	interface HTMLHeadingElement{ append(...nodes: (Node | string)[]): HTMLHeadingElement; }
	interface HTMLHeadElement{ append(...nodes: (Node | string)[]): HTMLHeadElement; }
	interface HTMLElement{ append(...nodes: (Node | string)[]): HTMLElement; }
	interface HTMLElement{ append(...nodes: (Node | string)[]): HTMLElement; }
	interface HTMLHRElement{ append(...nodes: (Node | string)[]): HTMLHRElement; }
	interface HTMLHtmlElement{ append(...nodes: (Node | string)[]): HTMLHtmlElement; }
	interface HTMLElement{ append(...nodes: (Node | string)[]): HTMLElement; }
	interface HTMLIFrameElement{ append(...nodes: (Node | string)[]): HTMLIFrameElement; }
	interface HTMLImageElement{ append(...nodes: (Node | string)[]): HTMLImageElement; }
	interface HTMLInputElement{ append(...nodes: (Node | string)[]): HTMLInputElement; }
	interface HTMLModElement{ append(...nodes: (Node | string)[]): HTMLModElement; }
	interface HTMLElement{ append(...nodes: (Node | string)[]): HTMLElement; }
	interface HTMLLabelElement{ append(...nodes: (Node | string)[]): HTMLLabelElement; }
	interface HTMLLegendElement{ append(...nodes: (Node | string)[]): HTMLLegendElement; }
	interface HTMLLIElement{ append(...nodes: (Node | string)[]): HTMLLIElement; }
	interface HTMLLinkElement{ append(...nodes: (Node | string)[]): HTMLLinkElement; }
	interface HTMLElement{ append(...nodes: (Node | string)[]): HTMLElement; }
	interface HTMLMapElement{ append(...nodes: (Node | string)[]): HTMLMapElement; }
	interface HTMLElement{ append(...nodes: (Node | string)[]): HTMLElement; }
	interface HTMLMenuElement{ append(...nodes: (Node | string)[]): HTMLMenuElement; }
	interface HTMLMetaElement{ append(...nodes: (Node | string)[]): HTMLMetaElement; }
	interface HTMLMeterElement{ append(...nodes: (Node | string)[]): HTMLMeterElement; }
	interface HTMLElement{ append(...nodes: (Node | string)[]): HTMLElement; }
	interface HTMLElement{ append(...nodes: (Node | string)[]): HTMLElement; }
	interface HTMLObjectElement{ append(...nodes: (Node | string)[]): HTMLObjectElement; }
	interface HTMLOListElement{ append(...nodes: (Node | string)[]): HTMLOListElement; }
	interface HTMLOptGroupElement{ append(...nodes: (Node | string)[]): HTMLOptGroupElement; }
	interface HTMLOptionElement{ append(...nodes: (Node | string)[]): HTMLOptionElement; }
	interface HTMLOutputElement{ append(...nodes: (Node | string)[]): HTMLOutputElement; }
	interface HTMLParagraphElement{ append(...nodes: (Node | string)[]): HTMLParagraphElement; }
	interface HTMLPictureElement{ append(...nodes: (Node | string)[]): HTMLPictureElement; }
	interface HTMLPreElement{ append(...nodes: (Node | string)[]): HTMLPreElement; }
	interface HTMLProgressElement{ append(...nodes: (Node | string)[]): HTMLProgressElement; }
	interface HTMLQuoteElement{ append(...nodes: (Node | string)[]): HTMLQuoteElement; }
	interface HTMLElement{ append(...nodes: (Node | string)[]): HTMLElement; }
	interface HTMLElement{ append(...nodes: (Node | string)[]): HTMLElement; }
	interface HTMLElement{ append(...nodes: (Node | string)[]): HTMLElement; }
	interface HTMLElement{ append(...nodes: (Node | string)[]): HTMLElement; }
	interface HTMLElement{ append(...nodes: (Node | string)[]): HTMLElement; }
	interface HTMLScriptElement{ append(...nodes: (Node | string)[]): HTMLScriptElement; }
	interface HTMLElement{ append(...nodes: (Node | string)[]): HTMLElement; }
	interface HTMLSelectElement{ append(...nodes: (Node | string)[]): HTMLSelectElement; }
	interface HTMLSlotElement{ append(...nodes: (Node | string)[]): HTMLSlotElement; }
	interface HTMLElement{ append(...nodes: (Node | string)[]): HTMLElement; }
	interface HTMLSourceElement{ append(...nodes: (Node | string)[]): HTMLSourceElement; }
	interface HTMLSpanElement{ append(...nodes: (Node | string)[]): HTMLSpanElement; }
	interface HTMLElement{ append(...nodes: (Node | string)[]): HTMLElement; }
	interface HTMLStyleElement{ append(...nodes: (Node | string)[]): HTMLStyleElement; }
	interface HTMLElement{ append(...nodes: (Node | string)[]): HTMLElement; }
	interface HTMLElement{ append(...nodes: (Node | string)[]): HTMLElement; }
	interface HTMLElement{ append(...nodes: (Node | string)[]): HTMLElement; }
	interface HTMLTableElement{ append(...nodes: (Node | string)[]): HTMLTableElement; }
	interface HTMLTableSectionElement{ append(...nodes: (Node | string)[]): HTMLTableSectionElement; }
	interface HTMLTableCellElement{ append(...nodes: (Node | string)[]): HTMLTableCellElement; }
	interface HTMLTemplateElement{ append(...nodes: (Node | string)[]): HTMLTemplateElement; }
	interface HTMLTextAreaElement{ append(...nodes: (Node | string)[]): HTMLTextAreaElement; }
	interface HTMLTableSectionElement{ append(...nodes: (Node | string)[]): HTMLTableSectionElement; }
	interface HTMLTableCellElement{ append(...nodes: (Node | string)[]): HTMLTableCellElement; }
	interface HTMLTableSectionElement{ append(...nodes: (Node | string)[]): HTMLTableSectionElement; }
	interface HTMLTimeElement{ append(...nodes: (Node | string)[]): HTMLTimeElement; }
	interface HTMLTitleElement{ append(...nodes: (Node | string)[]): HTMLTitleElement; }
	interface HTMLTableRowElement{ append(...nodes: (Node | string)[]): HTMLTableRowElement; }
	interface HTMLTrackElement{ append(...nodes: (Node | string)[]): HTMLTrackElement; }
	interface HTMLElement{ append(...nodes: (Node | string)[]): HTMLElement; }
	interface HTMLUListElement{ append(...nodes: (Node | string)[]): HTMLUListElement; }
	interface HTMLElement{ append(...nodes: (Node | string)[]): HTMLElement; }
	interface HTMLVideoElement{ append(...nodes: (Node | string)[]): HTMLVideoElement; }
	interface HTMLElement{ append(...nodes: (Node | string)[]): HTMLElement; }
	interface DocumentFragment{ append(...nodes: (Node | string)[]): DocumentFragment; }
}
