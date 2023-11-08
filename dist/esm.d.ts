type CustomElementTagNameMap= { '#text': Text, '#comment': Comment }
declare global {
	interface ddePublicElementTagNameMap{
	}
}
type SupportedElement=
	  HTMLElementTagNameMap[keyof HTMLElementTagNameMap]
	| SVGElementTagNameMap[keyof SVGElementTagNameMap]
	| MathMLElementTagNameMap[keyof MathMLElementTagNameMap]
	| CustomElementTagNameMap[keyof CustomElementTagNameMap]
	| ddePublicElementTagNameMap[keyof ddePublicElementTagNameMap];
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
type ExtendedHTMLElementTagNameMap= HTMLElementTagNameMap & CustomElementTagNameMap & ddePublicElementTagNameMap
export function el<TAG extends keyof ExtendedHTMLElementTagNameMap>(
	tag_name: TAG,
	attrs?: string | Partial<ElementAttributes<ExtendedHTMLElementTagNameMap[TAG]>>,
	...modifiers: ddeElementModifier<ExtendedHTMLElementTagNameMap[TAG]>[]
): ExtendedHTMLElementTagNameMap[TAG]
export function el<T>(
	tag_name?: "<>",
): DocumentFragment
export function el<
	A extends ddeComponentAttributes,
	C extends (attr: A)=> SupportedElement | DocumentFragment>(
	fComponent: C,
	attrs?: A,
	...modifiers: ddeElementModifier<ReturnType<C>>[]
): ReturnType<C>
export function el(
	tag_name: string,
	attrs?: string | Record<string, any>,
	...modifiers: ddeElementModifier<HTMLElement>[]
): HTMLElement
export function elNS(
	namespace: "http://www.w3.org/2000/svg"
): <TAG extends keyof SVGElementTagNameMap, KEYS extends keyof SVGElementTagNameMap[TAG] & { d: string }>(
	tag_name: TAG,
	attrs?: string | Partial<{ [key in KEYS]: SVGElementTagNameMap[TAG][key] | string | number | boolean }>,
	...modifiers: ddeElementModifier<SVGElementTagNameMap[TAG]>[]
)=> SVGElementTagNameMap[TAG]
export function elNS(
	namespace: "http://www.w3.org/1998/Math/MathML"
): <TAG extends keyof MathMLElementTagNameMap, KEYS extends keyof MathMLElementTagNameMap[TAG] & { d: string }>(
	tag_name: TAG,
	attrs?: string | Partial<{ [key in KEYS]: MathMLElementTagNameMap[TAG][key] | string | number | boolean }>,
	...modifiers: ddeElementModifier<MathMLElementTagNameMap[TAG]>[]
)=> MathMLElementTagNameMap[TAG]
export function elNS(
	namespace: string
): (
	tag_name: string,
	attrs?: string | Record<string, any>,
	...modifiers: ddeElementModifier<SupportedElement>[]
)=> SupportedElement
export function dispatchEvent(element: SupportedElement, name: keyof DocumentEventMap): void;
export function dispatchEvent(element: SupportedElement, name: string, data: any): void;
interface On{
	/** Listens to the DOM event. See {@link Document.addEventListener} */
	<
		EE extends ddeElementModifier<SupportedElement>,
		El extends ( EE extends ddeElementModifier<infer El> ? El : never ),
		Event extends keyof DocumentEventMap>(
			type: Event,
			listener: (this: El, ev: DocumentEventMap[Event]) => any,
			options?: AddEventListenerOptions
		) : EE;
	/** Listens to the element is connected to the live DOM. In case of custom elements uses [`connectedCallback`](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements#custom_element_lifecycle_callbacks), or {@link MutationObserver} else where */
	connected<
		EE extends ddeElementModifier<SupportedElement>,
		El extends ( EE extends ddeElementModifier<infer El> ? El : never )
		>(
			listener: (el: El) => any,
			options?: AddEventListenerOptions
		) : EE;
	/** Listens to the element is disconnected from the live DOM. In case of custom elements uses [`disconnectedCallback`](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements#custom_element_lifecycle_callbacks), or {@link MutationObserver} else where */
	disconnected<
		EE extends ddeElementModifier<SupportedElement>,
		El extends ( EE extends ddeElementModifier<infer El> ? El : never )
		>(
			listener: (el: El) => any,
			options?: AddEventListenerOptions
		) : EE;
	/** Listens to the element attribute changes. In case of custom elements uses [`attributeChangedCallback`](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements#custom_element_lifecycle_callbacks), or {@link MutationObserver} else where */
	attributeChanged<
		EE extends ddeElementModifier<SupportedElement>,
		El extends ( EE extends ddeElementModifier<infer El> ? El : never )
		>(
			listener: (el: El) => any,
			options?: AddEventListenerOptions
		) : EE;
}
export const on: On;
type Scope= { scope: Node | Function | Object, host: ddeElementModifier<any>, prevent: boolean }
/** Current scope created last time the `el(Function)` was invoke. (Or {@link scope.push}) */
export const scope: {
	current: Scope,
	/** Stops all automatizations. E. g. signals used as attributes in current scope
	 * registers removing these listeners (and clean signal if no other listeners are detected)
	 * on `disconnected` event. */
	preventDefault<T extends boolean>(prevent: T): T,
	/**
	 * This represents reference to the current host element — `scope.host()`.
	 * It can be also used to register Modifier (function to be called when component is initized)
	 * — `scope.host(on.connected(console.log))`.
	 * */
	host: ddeElementModifier<any>,
	
	state: Scope[],
	/** Adds new child scope. All attributes are inherited by default. */
	push(scope: Partial<Scope>): ReturnType<Array<Scope>["push"]>
	/** Removes last/current child scope. */
	pop(): ReturnType<Array<Scope>["pop"]>
};
/*
 * TODO TypeScript HACK (better way?)
 * this doesnt works
 * ```ts
 * interface element<el> extends Node{
 * 	prototype: el;
 * 	append(...els: (SupportedElement | DocumentFragment | string | element<SupportedElement | DocumentFragment>)[]): el
 * }
 * export function el<T>(
 * 	tag_name?: "<>",
 * ): element<DocumentFragment>
 * ```
 * …as its complains here
 * ```ts
 * const d= el("div");
 * const f= (a: HTMLDivElement)=> a;
 * f(d); //←
 * document.head.append( //←
 * 	el("script", { src: "https://flems.io/flems.html", type: "text/javascript", charset: "utf-8" }),
 * );
 * ```
 * TODO for SVG
 * */
type ddeAppend<el>= (...nodes: (Node | string)[])=> el;
declare global{
	interface HTMLAnchorElement{
		/** Elements returned by {@link el} return parent element for `.append` method. **Regullarly created elements are untouched.** */
		append: ddeAppend<HTMLAnchorElement>;
	}
	interface HTMLElement{
		/** Elements returned by {@link el} return parent element for `.append` method. **Regullarly created elements are untouched.** */
		append: ddeAppend<HTMLElement>;
	}
	interface HTMLAreaElement{
		/** Elements returned by {@link el} return parent element for `.append` method. **Regullarly created elements are untouched.** */
		append: ddeAppend<HTMLAreaElement>;
	}
	interface HTMLAudioElement{
		/** Elements returned by {@link el} return parent element for `.append` method. **Regullarly created elements are untouched.** */
		append: ddeAppend<HTMLAudioElement>;
	}
	interface HTMLBaseElement{
		/** Elements returned by {@link el} return parent element for `.append` method. **Regullarly created elements are untouched.** */
		append: ddeAppend<HTMLBaseElement>;
	}
	interface HTMLQuoteElement{
		/** Elements returned by {@link el} return parent element for `.append` method. **Regullarly created elements are untouched.** */
		append: ddeAppend<HTMLQuoteElement>;
	}
	interface HTMLBodyElement{
		/** Elements returned by {@link el} return parent element for `.append` method. **Regullarly created elements are untouched.** */
		append: ddeAppend<HTMLBodyElement>;
	}
	interface HTMLBRElement{
		/** Elements returned by {@link el} return parent element for `.append` method. **Regullarly created elements are untouched.** */
		append: ddeAppend<HTMLBRElement>;
	}
	interface HTMLButtonElement{
		/** Elements returned by {@link el} return parent element for `.append` method. **Regullarly created elements are untouched.** */
		append: ddeAppend<HTMLButtonElement>;
	}
	interface HTMLCanvasElement{
		/** Elements returned by {@link el} return parent element for `.append` method. **Regullarly created elements are untouched.** */
		append: ddeAppend<HTMLCanvasElement>;
	}
	interface HTMLTableCaptionElement{
		/** Elements returned by {@link el} return parent element for `.append` method. **Regullarly created elements are untouched.** */
		append: ddeAppend<HTMLTableCaptionElement>;
	}
	interface HTMLTableColElement{
		/** Elements returned by {@link el} return parent element for `.append` method. **Regullarly created elements are untouched.** */
		append: ddeAppend<HTMLTableColElement>;
	}
	interface HTMLTableColElement{
		/** Elements returned by {@link el} return parent element for `.append` method. **Regullarly created elements are untouched.** */
		append: ddeAppend<HTMLTableColElement>;
	}
	interface HTMLDataElement{
		/** Elements returned by {@link el} return parent element for `.append` method. **Regullarly created elements are untouched.** */
		append: ddeAppend<HTMLDataElement>;
	}
	interface HTMLDataListElement{
		/** Elements returned by {@link el} return parent element for `.append` method. **Regullarly created elements are untouched.** */
		append: ddeAppend<HTMLDataListElement>;
	}
	interface HTMLModElement{
		/** Elements returned by {@link el} return parent element for `.append` method. **Regullarly created elements are untouched.** */
		append: ddeAppend<HTMLModElement>;
	}
	interface HTMLDetailsElement{
		/** Elements returned by {@link el} return parent element for `.append` method. **Regullarly created elements are untouched.** */
		append: ddeAppend<HTMLDetailsElement>;
	}
	interface HTMLDialogElement{
		/** Elements returned by {@link el} return parent element for `.append` method. **Regullarly created elements are untouched.** */
		append: ddeAppend<HTMLDialogElement>;
	}
	interface HTMLDivElement{
		/** Elements returned by {@link el} return parent element for `.append` method. **Regullarly created elements are untouched.** */
		append: ddeAppend<HTMLDivElement>;
	}
	interface HTMLDListElement{
		/** Elements returned by {@link el} return parent element for `.append` method. **Regullarly created elements are untouched.** */
		append: ddeAppend<HTMLDListElement>;
	}
	interface HTMLEmbedElement{
		/** Elements returned by {@link el} return parent element for `.append` method. **Regullarly created elements are untouched.** */
		append: ddeAppend<HTMLEmbedElement>;
	}
	interface HTMLFieldSetElement{
		/** Elements returned by {@link el} return parent element for `.append` method. **Regullarly created elements are untouched.** */
		append: ddeAppend<HTMLFieldSetElement>;
	}
	interface HTMLFormElement{
		/** Elements returned by {@link el} return parent element for `.append` method. **Regullarly created elements are untouched.** */
		append: ddeAppend<HTMLFormElement>;
	}
	interface HTMLHeadingElement{
		/** Elements returned by {@link el} return parent element for `.append` method. **Regullarly created elements are untouched.** */
		append: ddeAppend<HTMLHeadingElement>;
	}
	interface HTMLHeadElement{
		/** Elements returned by {@link el} return parent element for `.append` method. **Regullarly created elements are untouched.** */
		append: ddeAppend<HTMLHeadElement>;
	}
	interface HTMLHRElement{
		/** Elements returned by {@link el} return parent element for `.append` method. **Regullarly created elements are untouched.** */
		append: ddeAppend<HTMLHRElement>;
	}
	interface HTMLHtmlElement{
		/** Elements returned by {@link el} return parent element for `.append` method. **Regullarly created elements are untouched.** */
		append: ddeAppend<HTMLHtmlElement>;
	}
	interface HTMLIFrameElement{
		/** Elements returned by {@link el} return parent element for `.append` method. **Regullarly created elements are untouched.** */
		append: ddeAppend<HTMLIFrameElement>;
	}
	interface HTMLImageElement{
		/** Elements returned by {@link el} return parent element for `.append` method. **Regullarly created elements are untouched.** */
		append: ddeAppend<HTMLImageElement>;
	}
	interface HTMLInputElement{
		/** Elements returned by {@link el} return parent element for `.append` method. **Regullarly created elements are untouched.** */
		append: ddeAppend<HTMLInputElement>;
	}
	interface HTMLLabelElement{
		/** Elements returned by {@link el} return parent element for `.append` method. **Regullarly created elements are untouched.** */
		append: ddeAppend<HTMLLabelElement>;
	}
	interface HTMLLegendElement{
		/** Elements returned by {@link el} return parent element for `.append` method. **Regullarly created elements are untouched.** */
		append: ddeAppend<HTMLLegendElement>;
	}
	interface HTMLLIElement{
		/** Elements returned by {@link el} return parent element for `.append` method. **Regullarly created elements are untouched.** */
		append: ddeAppend<HTMLLIElement>;
	}
	interface HTMLLinkElement{
		/** Elements returned by {@link el} return parent element for `.append` method. **Regullarly created elements are untouched.** */
		append: ddeAppend<HTMLLinkElement>;
	}
	interface HTMLMapElement{
		/** Elements returned by {@link el} return parent element for `.append` method. **Regullarly created elements are untouched.** */
		append: ddeAppend<HTMLMapElement>;
	}
	interface HTMLMenuElement{
		/** Elements returned by {@link el} return parent element for `.append` method. **Regullarly created elements are untouched.** */
		append: ddeAppend<HTMLMenuElement>;
	}
	interface HTMLMetaElement{
		/** Elements returned by {@link el} return parent element for `.append` method. **Regullarly created elements are untouched.** */
		append: ddeAppend<HTMLMetaElement>;
	}
	interface HTMLMeterElement{
		/** Elements returned by {@link el} return parent element for `.append` method. **Regullarly created elements are untouched.** */
		append: ddeAppend<HTMLMeterElement>;
	}
	interface HTMLObjectElement{
		/** Elements returned by {@link el} return parent element for `.append` method. **Regullarly created elements are untouched.** */
		append: ddeAppend<HTMLObjectElement>;
	}
	interface HTMLOListElement{
		/** Elements returned by {@link el} return parent element for `.append` method. **Regullarly created elements are untouched.** */
		append: ddeAppend<HTMLOListElement>;
	}
	interface HTMLOptGroupElement{
		/** Elements returned by {@link el} return parent element for `.append` method. **Regullarly created elements are untouched.** */
		append: ddeAppend<HTMLOptGroupElement>;
	}
	interface HTMLOptionElement{
		/** Elements returned by {@link el} return parent element for `.append` method. **Regullarly created elements are untouched.** */
		append: ddeAppend<HTMLOptionElement>;
	}
	interface HTMLOutputElement{
		/** Elements returned by {@link el} return parent element for `.append` method. **Regullarly created elements are untouched.** */
		append: ddeAppend<HTMLOutputElement>;
	}
	interface HTMLParagraphElement{
		/** Elements returned by {@link el} return parent element for `.append` method. **Regullarly created elements are untouched.** */
		append: ddeAppend<HTMLParagraphElement>;
	}
	interface HTMLPictureElement{
		/** Elements returned by {@link el} return parent element for `.append` method. **Regullarly created elements are untouched.** */
		append: ddeAppend<HTMLPictureElement>;
	}
	interface HTMLPreElement{
		/** Elements returned by {@link el} return parent element for `.append` method. **Regullarly created elements are untouched.** */
		append: ddeAppend<HTMLPreElement>;
	}
	interface HTMLProgressElement{
		/** Elements returned by {@link el} return parent element for `.append` method. **Regullarly created elements are untouched.** */
		append: ddeAppend<HTMLProgressElement>;
	}
	interface HTMLScriptElement{
		/** Elements returned by {@link el} return parent element for `.append` method. **Regullarly created elements are untouched.** */
		append: ddeAppend<HTMLScriptElement>;
	}
	interface HTMLSelectElement{
		/** Elements returned by {@link el} return parent element for `.append` method. **Regullarly created elements are untouched.** */
		append: ddeAppend<HTMLSelectElement>;
	}
	interface HTMLSlotElement{
		/** Elements returned by {@link el} return parent element for `.append` method. **Regullarly created elements are untouched.** */
		append: ddeAppend<HTMLSlotElement>;
	}
	interface HTMLSourceElement{
		/** Elements returned by {@link el} return parent element for `.append` method. **Regullarly created elements are untouched.** */
		append: ddeAppend<HTMLSourceElement>;
	}
	interface HTMLSpanElement{
		/** Elements returned by {@link el} return parent element for `.append` method. **Regullarly created elements are untouched.** */
		append: ddeAppend<HTMLSpanElement>;
	}
	interface HTMLStyleElement{
		/** Elements returned by {@link el} return parent element for `.append` method. **Regullarly created elements are untouched.** */
		append: ddeAppend<HTMLStyleElement>;
	}
	interface HTMLTableElement{
		/** Elements returned by {@link el} return parent element for `.append` method. **Regullarly created elements are untouched.** */
		append: ddeAppend<HTMLTableElement>;
	}
	interface HTMLTableSectionElement{
		/** Elements returned by {@link el} return parent element for `.append` method. **Regullarly created elements are untouched.** */
		append: ddeAppend<HTMLTableSectionElement>;
	}
	interface HTMLTableCellElement{
		/** Elements returned by {@link el} return parent element for `.append` method. **Regullarly created elements are untouched.** */
		append: ddeAppend<HTMLTableCellElement>;
	}
	interface HTMLTemplateElement{
		/** Elements returned by {@link el} return parent element for `.append` method. **Regullarly created elements are untouched.** */
		append: ddeAppend<HTMLTemplateElement>;
	}
	interface HTMLTextAreaElement{
		/** Elements returned by {@link el} return parent element for `.append` method. **Regullarly created elements are untouched.** */
		append: ddeAppend<HTMLTextAreaElement>;
	}
	interface HTMLTableCellElement{
		/** Elements returned by {@link el} return parent element for `.append` method. **Regullarly created elements are untouched.** */
		append: ddeAppend<HTMLTableCellElement>;
	}
	interface HTMLTimeElement{
		/** Elements returned by {@link el} return parent element for `.append` method. **Regullarly created elements are untouched.** */
		append: ddeAppend<HTMLTimeElement>;
	}
	interface HTMLTitleElement{
		/** Elements returned by {@link el} return parent element for `.append` method. **Regullarly created elements are untouched.** */
		append: ddeAppend<HTMLTitleElement>;
	}
	interface HTMLTableRowElement{
		/** Elements returned by {@link el} return parent element for `.append` method. **Regullarly created elements are untouched.** */
		append: ddeAppend<HTMLTableRowElement>;
	}
	interface HTMLTrackElement{
		/** Elements returned by {@link el} return parent element for `.append` method. **Regullarly created elements are untouched.** */
		append: ddeAppend<HTMLTrackElement>;
	}
	interface HTMLUListElement{
		/** Elements returned by {@link el} return parent element for `.append` method. **Regullarly created elements are untouched.** */
		append: ddeAppend<HTMLUListElement>;
	}
	interface HTMLVideoElement{
		/** Elements returned by {@link el} return parent element for `.append` method. **Regullarly created elements are untouched.** */
		append: ddeAppend<HTMLVideoElement>;
	}
	interface DocumentFragment{
		/** Elements returned by {@link el} return parent element for `.append` method. **Regullarly created elements are untouched.** */
		append: ddeAppend<DocumentFragment>;
	}
}