declare global{ /* ddeSignal */ }
type CustomElementTagNameMap= { '#text': Text, '#comment': Comment }
type SupportedElement=
		HTMLElementTagNameMap[keyof HTMLElementTagNameMap]
	|	SVGElementTagNameMap[keyof SVGElementTagNameMap]
	|	MathMLElementTagNameMap[keyof MathMLElementTagNameMap]
	|	CustomElementTagNameMap[keyof CustomElementTagNameMap]
declare global {
	type ddeComponentAttributes= Record<any, any> | undefined;
	type ddeElementAddon<El extends SupportedElement | DocumentFragment | Node>= (element: El)=> any;
	type ddeString= string | ddeSignal<string>
	type ddeStringable= ddeString | number | ddeSignal<number>
}
type PascalCase=
`${Capitalize<string>}${string}`;
type AttrsModified= {
	/**
	 * Use string like in HTML (internally uses `*.setAttribute("style", *)`), or object representation (like DOM API).
	 */
	style: Partial<CSSStyleDeclaration> | ddeString
		| Partial<{ [K in keyof CSSStyleDeclaration]: ddeSignal<CSSStyleDeclaration[K]> }>
	/**
	 * Provide option to add/remove/toggle CSS clasess (index of object) using 1/0/-1.
	 * In fact `el.classList.toggle(class_name)` for `-1` and `el.classList.toggle(class_name, Boolean(...))`
	 * for others.
	 */
	classList: Record<string,-1|0|1|boolean|ddeSignal<-1|0|1|boolean>>,
	/**
	 * Used by the dataset HTML attribute to represent data for custom attributes added to elements.
	 * Values are converted to string (see {@link DOMStringMap}).
	 *
	 * [MDN Reference](https://developer.mozilla.org/docs/Web/API/DOMStringMap)
	 * */
	dataset: Record<string, ddeStringable>,
	/**
	 * Sets `aria-*` simiraly to `dataset`
	 * */
	ariaset: Record<string, ddeString>,
}	& Record<`=${string}` | `data${PascalCase}` | `aria${PascalCase}`, ddeString>
	& Record<`.${string}`, any>
type _fromElsInterfaces<EL extends SupportedElement>= Omit<EL, keyof AttrsModified>;
type IsReadonly<T, K extends keyof T> =
	T extends { readonly [P in K]: T[K] } ? true : false;
/**
 * Just element attributtes
 *
 * In most cases, you can use native propertie such as
 * [MDN WEB/API/Element](https://developer.mozilla.org/en-US/docs/Web/API/Element) and so on
 * (e.g. [`Text`](https://developer.mozilla.org/en-US/docs/Web/API/Text)).
 *
 * There is added support for `data[A-Z].*`/`aria[A-Z].*` to be converted to the kebab-case alternatives.
 * @private
 */
type ElementAttributes<T extends SupportedElement>= Partial<{
	[K in keyof _fromElsInterfaces<T>]:
		_fromElsInterfaces<T>[K] extends ((...p: any[])=> any)
			? _fromElsInterfaces<T>[K] | ((...p: Parameters<_fromElsInterfaces<T>[K]>)=>
																	ddeSignal<ReturnType<_fromElsInterfaces<T>[K]>>)
			: (IsReadonly<_fromElsInterfaces<T>, K> extends false
				? _fromElsInterfaces<T>[K] | ddeSignal<_fromElsInterfaces<T>[K]>
				: ddeStringable)
} & AttrsModified> & Record<string, any>;
export function classListDeclarative<El extends SupportedElement>(
	element: El,
	classList: AttrsModified["classList"]
): El
export function assign<El extends SupportedElement>(element: El, ...attrs_array: ElementAttributes<El>[]): El
export function assignAttribute<El extends SupportedElement, ATT extends keyof ElementAttributes<El>>(
	element: El,
	attr: ATT,
	value: ElementAttributes<El>[ATT]
): ElementAttributes<El>[ATT]

type ExtendedHTMLElementTagNameMap= HTMLElementTagNameMap & CustomElementTagNameMap;
export function el<
	A extends ddeComponentAttributes,
	EL extends SupportedElement | ddeDocumentFragment
>(
	component: (attr: A, ...rest: any[])=> EL,
	attrs?: NoInfer<A>,
	...addons: ddeElementAddon<EL>[]
): EL extends ddeHTMLElementTagNameMap[keyof ddeHTMLElementTagNameMap]
	? EL
	: ( EL extends ddeDocumentFragment ? EL : ddeHTMLElement )
export function el<
	A extends { textContent: ddeStringable },
	EL extends SupportedElement | ddeDocumentFragment
>(
	component: (attr: A, ...rest: any[])=> EL,
	attrs?: NoInfer<A>["textContent"],
	...addons: ddeElementAddon<EL>[]
): EL extends ddeHTMLElementTagNameMap[keyof ddeHTMLElementTagNameMap]
	? EL
	: ( EL extends ddeDocumentFragment ? EL : ddeHTMLElement )
export function el<
	TAG extends keyof ExtendedHTMLElementTagNameMap,
>(
	tag_name: TAG,
	attrs?: ElementAttributes<ExtendedHTMLElementTagNameMap[NoInfer<TAG>]> | ddeStringable,
	...addons: ddeElementAddon<
		ExtendedHTMLElementTagNameMap[NoInfer<TAG>]
	>[], // TODO: for now addons must have the same element
): TAG extends keyof ddeHTMLElementTagNameMap ? ddeHTMLElementTagNameMap[TAG] : ddeHTMLElement
export function el(
	tag_name?: "<>",
): ddeDocumentFragment
export function el(
	tag_name: string,
	attrs?: ElementAttributes<HTMLElement> | ddeStringable,
	...addons: ddeElementAddon<HTMLElement>[]
): ddeHTMLElement
export { el as createElement }

export function elNS(
	namespace: "http://www.w3.org/2000/svg"
): <
	TAG extends keyof SVGElementTagNameMap & string,
	EL extends ( TAG extends keyof SVGElementTagNameMap ? SVGElementTagNameMap[TAG] : SVGElement ),
>(
	tag_name: TAG,
	attrs?: ElementAttributes<NoInfer<EL>> | ddeStringable,
	...addons: ddeElementAddon<NoInfer<EL>>[]
)=>  TAG extends keyof ddeSVGElementTagNameMap ? ddeSVGElementTagNameMap[TAG] : ddeSVGElement
export function elNS(
	namespace: "http://www.w3.org/1998/Math/MathML"
): <
	TAG extends keyof MathMLElementTagNameMap & string,
	EL extends ( TAG extends keyof MathMLElementTagNameMap ? MathMLElementTagNameMap[TAG] : MathMLElement ),
>(
	tag_name: TAG,
	attrs?: ddeStringable | Partial<{
		[key in keyof EL]: EL[key] | ddeSignal<EL[key]> | string | number | boolean
	}>,
	...addons: ddeElementAddon<NoInfer<EL>>[]
)=> ddeMathMLElement
export function elNS(
	namespace: string
): (
	tag_name: string,
	attrs?: string | ddeStringable | Record<string, any>,
	...addons: ddeElementAddon<SupportedElement>[]
)=> SupportedElement
export { elNS as createElementNS }

export function chainableAppend<EL extends SupportedElement>(el: EL): EL;
/** Simulate slots for ddeComponents */
export function simulateSlots<EL extends SupportedElement | DocumentFragment>(
	root: EL,
): EL
/**
 * Simulate slots in Custom Elements without using `shadowRoot`.
 * @param el Custom Element root element
 * @param body Body of the custom element
 * */
export function simulateSlots<EL extends SupportedElement | DocumentFragment>(
	el: HTMLElement,
	body: EL,
): EL

export function dispatchEvent(name: keyof DocumentEventMap | string, element: SupportedElement):
	(data?: any)=> void;
export function dispatchEvent(name: keyof DocumentEventMap | string, options?: EventInit):
	(element: SupportedElement, data?: any)=> void;
export function dispatchEvent(
	name: keyof DocumentEventMap | string,
	options: EventInit | null,
	element: SupportedElement | (()=> SupportedElement)
): (data?: any)=> void;
interface On{
	/** Listens to the DOM event. See {@link Document.addEventListener} */
	<
		Event extends keyof DocumentEventMap,
		EE extends ddeElementAddon<SupportedElement>= ddeElementAddon<HTMLElement>,
		>(
			type: Event,
			listener: (this: EE extends ddeElementAddon<infer El> ? El : never, ev: DocumentEventMap[Event]) => any,
			options?: AddEventListenerOptions
		) : EE;
	<
		EE extends ddeElementAddon<SupportedElement>= ddeElementAddon<HTMLElement>,
		>(
			type: string,
			listener: (this: EE extends ddeElementAddon<infer El> ? El : never, ev: Event | CustomEvent ) => any,
			options?: AddEventListenerOptions
		) : EE;
	/** Listens to the element is connected to the live DOM. In case of custom elements uses [`connectedCallback`](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements#custom_element_lifecycle_callbacks), or {@link MutationObserver} else where */// editorconfig-checker-disable-line
	connected<
		EE extends ddeElementAddon<SupportedElement>,
		El extends ( EE extends ddeElementAddon<infer El> ? El : never )
		>(
			listener: (this: El, event: CustomEvent<El>) => any,
			options?: AddEventListenerOptions
		) : EE;
	/** Listens to the element is disconnected from the live DOM. In case of custom elements uses [`disconnectedCallback`](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements#custom_element_lifecycle_callbacks), or {@link MutationObserver} else where */// editorconfig-checker-disable-line
	disconnected<
		EE extends ddeElementAddon<SupportedElement>,
		El extends ( EE extends ddeElementAddon<infer El> ? El : never )
		>(
			listener: (this: El, event: CustomEvent<void>) => any,
			options?: AddEventListenerOptions
		) : EE;
	/** Listens to the element attribute changes. In case of custom elements uses [`attributeChangedCallback`](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements#custom_element_lifecycle_callbacks), or {@link MutationObserver} else where */// editorconfig-checker-disable-line
	attributeChanged<
		EE extends ddeElementAddon<SupportedElement>,
		El extends ( EE extends ddeElementAddon<infer El> ? El : never )
		>(
			listener: (this: El, event: CustomEvent<[ string, string ]>) => any,
			options?: AddEventListenerOptions
		) : EE;
}
export const on: On;

type Scope= {
	scope: Node | Function | Object,
	host: ddeElementAddon<any>,
	custom_element: false | HTMLElement,
	prevent: boolean
};
/** Current scope created last time the `el(Function)` was invoke. (Or {@link scope.push}) */
export const scope: {
	current: Scope,
	/** Stops all automatizations. E. g. signals used as attributes in current scope
	 * registers removing these listeners (and clean signal if no other listeners are detected)
	 * on `disconnected` event. */
	preventDefault<T extends boolean>(prevent: T): T,
	/**
	 * This represents reference to the current host element — `scope.host()`.
	 * It can be also used to register Addon(s) (functions to be called when component is initized)
	 * — `scope.host(on.connected(console.log))`.
	 * */
	host: (...addons: ddeElementAddon<SupportedElement>[])=> HTMLElement,

	state: Scope[],
	/** Adds new child scope. All attributes are inherited by default. */
	push(scope?: Partial<Scope>): ReturnType<Array<Scope>["push"]>,
	/** Adds root scope as a child of the current scope. */
	pushRoot(): ReturnType<Array<Scope>["push"]>,
	/** Removes last/current child scope. */
	pop(): ReturnType<Array<Scope>["pop"]>,
};

export function customElementRender<
	EL extends HTMLElement,
	P extends any = Record<string, string | ddeSignal<string>>
>(
	target: ShadowRoot | EL,
	render: (props: P)=> SupportedElement | DocumentFragment,
	props?: P | ((el: EL)=> P)
): EL
export function customElementWithDDE<EL extends (new ()=> HTMLElement)>(custom_element: EL): EL
export function lifecyclesToEvents<EL extends (new ()=> HTMLElement)>(custom_element: EL): EL
export function observedAttributes(custom_element: HTMLElement): Record<string, string>

/* TypeScript MEH */
declare global{
	type ddeAppend<el>= (...nodes: (Node | string)[])=> el;

	interface ddeDocumentFragment extends DocumentFragment{ append: ddeAppend<ddeDocumentFragment>; }
	interface ddeHTMLElement extends HTMLElement{ append: ddeAppend<ddeHTMLElement>; }
	interface ddeSVGElement extends SVGElement{ append: ddeAppend<ddeSVGElement>; }
	interface ddeMathMLElement extends MathMLElement{ append: ddeAppend<ddeMathMLElement>; }

	interface ddeHTMLElementTagNameMap {
		"a": ddeHTMLAnchorElement;
		"area": ddeHTMLAreaElement;
		"audio": ddeHTMLAudioElement;
		"base": ddeHTMLBaseElement;
		"blockquote": ddeHTMLQuoteElement;
		"body": ddeHTMLBodyElement;
		"br": ddeHTMLBRElement;
		"button": ddeHTMLButtonElement;
		"canvas": ddeHTMLCanvasElement;
		"caption": ddeHTMLTableCaptionElement;
		"col": ddeHTMLTableColElement;
		"colgroup": ddeHTMLTableColElement;
		"data": ddeHTMLDataElement;
		"datalist": ddeHTMLDataListElement;
		"del": ddeHTMLModElement;
		"details": ddeHTMLDetailsElement;
		"dialog": ddeHTMLDialogElement;
		"div": ddeHTMLDivElement;
		"dl": ddeHTMLDListElement;
		"embed": ddeHTMLEmbedElement;
		"fieldset": ddeHTMLFieldSetElement;
		"form": ddeHTMLFormElement;
		"h1": ddeHTMLHeadingElement;
		"h2": ddeHTMLHeadingElement;
		"h3": ddeHTMLHeadingElement;
		"h4": ddeHTMLHeadingElement;
		"h5": ddeHTMLHeadingElement;
		"h6": ddeHTMLHeadingElement;
		"head": ddeHTMLHeadElement;
		"hr": ddeHTMLHRElement;
		"html": ddeHTMLHtmlElement;
		"iframe": ddeHTMLIFrameElement;
		"img": ddeHTMLImageElement;
		"input": ddeHTMLInputElement;
		"ins": ddeHTMLModElement;
		"label": ddeHTMLLabelElement;
		"legend": ddeHTMLLegendElement;
		"li": ddeHTMLLIElement;
		"link": ddeHTMLLinkElement;
		"map": ddeHTMLMapElement;
		"menu": ddeHTMLMenuElement;
		"meta": ddeHTMLMetaElement;
		"meter": ddeHTMLMeterElement;
		"object": ddeHTMLObjectElement;
		"ol": ddeHTMLOListElement;
		"optgroup": ddeHTMLOptGroupElement;
		"option": ddeHTMLOptionElement;
		"output": ddeHTMLOutputElement;
		"p": ddeHTMLParagraphElement;
		"picture": ddeHTMLPictureElement;
		"pre": ddeHTMLPreElement;
		"progress": ddeHTMLProgressElement;
		"q": ddeHTMLQuoteElement;
		"script": ddeHTMLScriptElement;
		"select": ddeHTMLSelectElement;
		"slot": ddeHTMLSlotElement;
		"source": ddeHTMLSourceElement;
		"span": ddeHTMLSpanElement;
		"style": ddeHTMLStyleElement;
		"table": ddeHTMLTableElement;
		"tbody": ddeHTMLTableSectionElement;
		"td": ddeHTMLTableCellElement;
		"template": ddeHTMLTemplateElement;
		"textarea": ddeHTMLTextAreaElement;
		"tfoot": ddeHTMLTableSectionElement;
		"th": ddeHTMLTableCellElement;
		"thead": ddeHTMLTableSectionElement;
		"time": ddeHTMLTimeElement;
		"title": ddeHTMLTitleElement;
		"tr": ddeHTMLTableRowElement;
		"track": ddeHTMLTrackElement;
		"ul": ddeHTMLUListElement;
		"video": ddeHTMLVideoElement;
	}
	interface ddeSVGElementTagNameMap {
		"a": ddeSVGAElement;
		"animate": ddeSVGAnimateElement;
		"animateMotion": ddeSVGAnimateMotionElement;
		"animateTransform": ddeSVGAnimateTransformElement;
		"circle": ddeSVGCircleElement;
		"clipPath": ddeSVGClipPathElement;
		"defs": ddeSVGDefsElement;
		"desc": ddeSVGDescElement;
		"ellipse": ddeSVGEllipseElement;
		"feBlend": ddeSVGFEBlendElement;
		"feColorMatrix": ddeSVGFEColorMatrixElement;
		"feComponentTransfer": ddeSVGFEComponentTransferElement;
		"feComposite": ddeSVGFECompositeElement;
		"feConvolveMatrix": ddeSVGFEConvolveMatrixElement;
		"feDiffuseLighting": ddeSVGFEDiffuseLightingElement;
		"feDisplacementMap": ddeSVGFEDisplacementMapElement;
		"feDistantLight": ddeSVGFEDistantLightElement;
		"feDropShadow": ddeSVGFEDropShadowElement;
		"feFlood": ddeSVGFEFloodElement;
		"feFuncA": ddeSVGFEFuncAElement;
		"feFuncB": ddeSVGFEFuncBElement;
		"feFuncG": ddeSVGFEFuncGElement;
		"feFuncR": ddeSVGFEFuncRElement;
		"feGaussianBlur": ddeSVGFEGaussianBlurElement;
		"feImage": ddeSVGFEImageElement;
		"feMerge": ddeSVGFEMergeElement;
		"feMergeNode": ddeSVGFEMergeNodeElement;
		"feMorphology": ddeSVGFEMorphologyElement;
		"feOffset": ddeSVGFEOffsetElement;
		"fePointLight": ddeSVGFEPointLightElement;
		"feSpecularLighting": ddeSVGFESpecularLightingElement;
		"feSpotLight": ddeSVGFESpotLightElement;
		"feTile": ddeSVGFETileElement;
		"feTurbulence": ddeSVGFETurbulenceElement;
		"filter": ddeSVGFilterElement;
		"foreignObject": ddeSVGForeignObjectElement;
		"g": ddeSVGGElement;
		"image": ddeSVGImageElement;
		"line": ddeSVGLineElement;
		"linearGradient": ddeSVGLinearGradientElement;
		"marker": ddeSVGMarkerElement;
		"mask": ddeSVGMaskElement;
		"metadata": ddeSVGMetadataElement;
		"mpath": ddeSVGMPathElement;
		"path": ddeSVGPathElement;
		"pattern": ddeSVGPatternElement;
		"polygon": ddeSVGPolygonElement;
		"polyline": ddeSVGPolylineElement;
		"radialGradient": ddeSVGRadialGradientElement;
		"rect": ddeSVGRectElement;
		"script": ddeSVGScriptElement;
		"set": ddeSVGSetElement;
		"stop": ddeSVGStopElement;
		"style": ddeSVGStyleElement;
		"svg": ddeSVGSVGElement;
		"switch": ddeSVGSwitchElement;
		"symbol": ddeSVGSymbolElement;
		"text": ddeSVGTextElement;
		"textPath": ddeSVGTextPathElement;
		"title": ddeSVGTitleElement;
		"tspan": ddeSVGTSpanElement;
		"use": ddeSVGUseElement;
		"view": ddeSVGViewElement;
	}
}

// editorconfig-checker-disable
interface ddeHTMLAnchorElement extends HTMLAnchorElement{ append: ddeAppend<ddeHTMLAnchorElement>; }
interface ddeHTMLAreaElement extends HTMLAreaElement{ append: ddeAppend<ddeHTMLAreaElement>; }
interface ddeHTMLAudioElement extends HTMLAudioElement{ append: ddeAppend<ddeHTMLAudioElement>; }
interface ddeHTMLBaseElement extends HTMLBaseElement{ append: ddeAppend<ddeHTMLBaseElement>; }
interface ddeHTMLQuoteElement extends HTMLQuoteElement{ append: ddeAppend<ddeHTMLQuoteElement>; }
interface ddeHTMLBodyElement extends HTMLBodyElement{ append: ddeAppend<ddeHTMLBodyElement>; }
interface ddeHTMLBRElement extends HTMLBRElement{ append: ddeAppend<ddeHTMLBRElement>; }
interface ddeHTMLButtonElement extends HTMLButtonElement{ append: ddeAppend<ddeHTMLButtonElement>; }
interface ddeHTMLCanvasElement extends HTMLCanvasElement{ append: ddeAppend<ddeHTMLCanvasElement>; }
interface ddeHTMLTableCaptionElement extends HTMLTableCaptionElement{ append: ddeAppend<ddeHTMLTableCaptionElement>; }
interface ddeHTMLTableColElement extends HTMLTableColElement{ append: ddeAppend<ddeHTMLTableColElement>; }
interface ddeHTMLTableColElement extends HTMLTableColElement{ append: ddeAppend<ddeHTMLTableColElement>; }
interface ddeHTMLDataElement extends HTMLDataElement{ append: ddeAppend<ddeHTMLDataElement>; }
interface ddeHTMLDataListElement extends HTMLDataListElement{ append: ddeAppend<ddeHTMLDataListElement>; }
interface ddeHTMLModElement extends HTMLModElement{ append: ddeAppend<ddeHTMLModElement>; }
interface ddeHTMLDetailsElement extends HTMLDetailsElement{ append: ddeAppend<ddeHTMLDetailsElement>; }
interface ddeHTMLDialogElement extends HTMLDialogElement{ append: ddeAppend<ddeHTMLDialogElement>; }
interface ddeHTMLDivElement extends HTMLDivElement{ append: ddeAppend<ddeHTMLDivElement>; }
interface ddeHTMLDListElement extends HTMLDListElement{ append: ddeAppend<ddeHTMLDListElement>; }
interface ddeHTMLEmbedElement extends HTMLEmbedElement{ append: ddeAppend<ddeHTMLEmbedElement>; }
interface ddeHTMLFieldSetElement extends HTMLFieldSetElement{ append: ddeAppend<ddeHTMLFieldSetElement>; }
interface ddeHTMLFormElement extends HTMLFormElement{ append: ddeAppend<ddeHTMLFormElement>; }
interface ddeHTMLHeadingElement extends HTMLHeadingElement{ append: ddeAppend<ddeHTMLHeadingElement>; }
interface ddeHTMLHeadElement extends HTMLHeadElement{ append: ddeAppend<ddeHTMLHeadElement>; }
interface ddeHTMLHRElement extends HTMLHRElement{ append: ddeAppend<ddeHTMLHRElement>; }
interface ddeHTMLHtmlElement extends HTMLHtmlElement{ append: ddeAppend<ddeHTMLHtmlElement>; }
interface ddeHTMLIFrameElement extends HTMLIFrameElement{ append: ddeAppend<ddeHTMLIFrameElement>; }
interface ddeHTMLImageElement extends HTMLImageElement{ append: ddeAppend<ddeHTMLImageElement>; }
interface ddeHTMLInputElement extends HTMLInputElement{ append: ddeAppend<ddeHTMLInputElement>; }
interface ddeHTMLLabelElement extends HTMLLabelElement{ append: ddeAppend<ddeHTMLLabelElement>; }
interface ddeHTMLLegendElement extends HTMLLegendElement{ append: ddeAppend<ddeHTMLLegendElement>; }
interface ddeHTMLLIElement extends HTMLLIElement{ append: ddeAppend<ddeHTMLLIElement>; }
interface ddeHTMLLinkElement extends HTMLLinkElement{ append: ddeAppend<ddeHTMLLinkElement>; }
interface ddeHTMLMapElement extends HTMLMapElement{ append: ddeAppend<ddeHTMLMapElement>; }
interface ddeHTMLMenuElement extends HTMLMenuElement{ append: ddeAppend<ddeHTMLMenuElement>; }
interface ddeHTMLMetaElement extends HTMLMetaElement{ append: ddeAppend<ddeHTMLMetaElement>; }
interface ddeHTMLMeterElement extends HTMLMeterElement{ append: ddeAppend<ddeHTMLMeterElement>; }
interface ddeHTMLObjectElement extends HTMLObjectElement{ append: ddeAppend<ddeHTMLObjectElement>; }
interface ddeHTMLOListElement extends HTMLOListElement{ append: ddeAppend<ddeHTMLOListElement>; }
interface ddeHTMLOptGroupElement extends HTMLOptGroupElement{ append: ddeAppend<ddeHTMLOptGroupElement>; }
interface ddeHTMLOptionElement extends HTMLOptionElement{ append: ddeAppend<ddeHTMLOptionElement>; }
interface ddeHTMLOutputElement extends HTMLOutputElement{ append: ddeAppend<ddeHTMLOutputElement>; }
interface ddeHTMLParagraphElement extends HTMLParagraphElement{ append: ddeAppend<ddeHTMLParagraphElement>; }
interface ddeHTMLPictureElement extends HTMLPictureElement{ append: ddeAppend<ddeHTMLPictureElement>; }
interface ddeHTMLPreElement extends HTMLPreElement{ append: ddeAppend<ddeHTMLPreElement>; }
interface ddeHTMLProgressElement extends HTMLProgressElement{ append: ddeAppend<ddeHTMLProgressElement>; }
interface ddeHTMLScriptElement extends HTMLScriptElement{ append: ddeAppend<ddeHTMLScriptElement>; }
interface ddeHTMLSelectElement extends HTMLSelectElement{ append: ddeAppend<ddeHTMLSelectElement>; }
interface ddeHTMLSlotElement extends HTMLSlotElement{ append: ddeAppend<ddeHTMLSlotElement>; }
interface ddeHTMLSourceElement extends HTMLSourceElement{ append: ddeAppend<ddeHTMLSourceElement>; }
interface ddeHTMLSpanElement extends HTMLSpanElement{ append: ddeAppend<ddeHTMLSpanElement>; }
interface ddeHTMLStyleElement extends HTMLStyleElement{ append: ddeAppend<ddeHTMLStyleElement>; }
interface ddeHTMLTableElement extends HTMLTableElement{ append: ddeAppend<ddeHTMLTableElement>; }
interface ddeHTMLTableSectionElement extends HTMLTableSectionElement{ append: ddeAppend<ddeHTMLTableSectionElement>; }
interface ddeHTMLTableCellElement extends HTMLTableCellElement{ append: ddeAppend<ddeHTMLTableCellElement>; }
interface ddeHTMLTemplateElement extends HTMLTemplateElement{ append: ddeAppend<ddeHTMLTemplateElement>; }
interface ddeHTMLTextAreaElement extends HTMLTextAreaElement{ append: ddeAppend<ddeHTMLTextAreaElement>; }
interface ddeHTMLTableCellElement extends HTMLTableCellElement{ append: ddeAppend<ddeHTMLTableCellElement>; }
interface ddeHTMLTimeElement extends HTMLTimeElement{ append: ddeAppend<ddeHTMLTimeElement>; }
interface ddeHTMLTitleElement extends HTMLTitleElement{ append: ddeAppend<ddeHTMLTitleElement>; }
interface ddeHTMLTableRowElement extends HTMLTableRowElement{ append: ddeAppend<ddeHTMLTableRowElement>; }
interface ddeHTMLTrackElement extends HTMLTrackElement{ append: ddeAppend<ddeHTMLTrackElement>; }
interface ddeHTMLUListElement extends HTMLUListElement{ append: ddeAppend<ddeHTMLUListElement>; }
interface ddeHTMLVideoElement extends HTMLVideoElement{ append: ddeAppend<ddeHTMLVideoElement>; }
interface ddeSVGAElement extends SVGAElement{ append: ddeAppend<ddeSVGAElement>; }
interface ddeSVGAnimateElement extends SVGAnimateElement{ append: ddeAppend<ddeSVGAnimateElement>; }
interface ddeSVGAnimateMotionElement extends SVGAnimateMotionElement{ append: ddeAppend<ddeSVGAnimateMotionElement>; }
interface ddeSVGAnimateTransformElement extends SVGAnimateTransformElement{ append: ddeAppend<ddeSVGAnimateTransformElement>; }
interface ddeSVGCircleElement extends SVGCircleElement{ append: ddeAppend<ddeSVGCircleElement>; }
interface ddeSVGClipPathElement extends SVGClipPathElement{ append: ddeAppend<ddeSVGClipPathElement>; }
interface ddeSVGDefsElement extends SVGDefsElement{ append: ddeAppend<ddeSVGDefsElement>; }
interface ddeSVGDescElement extends SVGDescElement{ append: ddeAppend<ddeSVGDescElement>; }
interface ddeSVGEllipseElement extends SVGEllipseElement{ append: ddeAppend<ddeSVGEllipseElement>; }
interface ddeSVGFEBlendElement extends SVGFEBlendElement{ append: ddeAppend<ddeSVGFEBlendElement>; }
interface ddeSVGFEColorMatrixElement extends SVGFEColorMatrixElement{ append: ddeAppend<ddeSVGFEColorMatrixElement>; }
interface ddeSVGFEComponentTransferElement extends SVGFEComponentTransferElement{ append: ddeAppend<ddeSVGFEComponentTransferElement>; }
interface ddeSVGFECompositeElement extends SVGFECompositeElement{ append: ddeAppend<ddeSVGFECompositeElement>; }
interface ddeSVGFEConvolveMatrixElement extends SVGFEConvolveMatrixElement{ append: ddeAppend<ddeSVGFEConvolveMatrixElement>; }
interface ddeSVGFEDiffuseLightingElement extends SVGFEDiffuseLightingElement{ append: ddeAppend<ddeSVGFEDiffuseLightingElement>; }
interface ddeSVGFEDisplacementMapElement extends SVGFEDisplacementMapElement{ append: ddeAppend<ddeSVGFEDisplacementMapElement>; }
interface ddeSVGFEDistantLightElement extends SVGFEDistantLightElement{ append: ddeAppend<ddeSVGFEDistantLightElement>; }
interface ddeSVGFEDropShadowElement extends SVGFEDropShadowElement{ append: ddeAppend<ddeSVGFEDropShadowElement>; }
interface ddeSVGFEFloodElement extends SVGFEFloodElement{ append: ddeAppend<ddeSVGFEFloodElement>; }
interface ddeSVGFEFuncAElement extends SVGFEFuncAElement{ append: ddeAppend<ddeSVGFEFuncAElement>; }
interface ddeSVGFEFuncBElement extends SVGFEFuncBElement{ append: ddeAppend<ddeSVGFEFuncBElement>; }
interface ddeSVGFEFuncGElement extends SVGFEFuncGElement{ append: ddeAppend<ddeSVGFEFuncGElement>; }
interface ddeSVGFEFuncRElement extends SVGFEFuncRElement{ append: ddeAppend<ddeSVGFEFuncRElement>; }
interface ddeSVGFEGaussianBlurElement extends SVGFEGaussianBlurElement{ append: ddeAppend<ddeSVGFEGaussianBlurElement>; }
interface ddeSVGFEImageElement extends SVGFEImageElement{ append: ddeAppend<ddeSVGFEImageElement>; }
interface ddeSVGFEMergeElement extends SVGFEMergeElement{ append: ddeAppend<ddeSVGFEMergeElement>; }
interface ddeSVGFEMergeNodeElement extends SVGFEMergeNodeElement{ append: ddeAppend<ddeSVGFEMergeNodeElement>; }
interface ddeSVGFEMorphologyElement extends SVGFEMorphologyElement{ append: ddeAppend<ddeSVGFEMorphologyElement>; }
interface ddeSVGFEOffsetElement extends SVGFEOffsetElement{ append: ddeAppend<ddeSVGFEOffsetElement>; }
interface ddeSVGFEPointLightElement extends SVGFEPointLightElement{ append: ddeAppend<ddeSVGFEPointLightElement>; }
interface ddeSVGFESpecularLightingElement extends SVGFESpecularLightingElement{ append: ddeAppend<ddeSVGFESpecularLightingElement>; }
interface ddeSVGFESpotLightElement extends SVGFESpotLightElement{ append: ddeAppend<ddeSVGFESpotLightElement>; }
interface ddeSVGFETileElement extends SVGFETileElement{ append: ddeAppend<ddeSVGFETileElement>; }
interface ddeSVGFETurbulenceElement extends SVGFETurbulenceElement{ append: ddeAppend<ddeSVGFETurbulenceElement>; }
interface ddeSVGFilterElement extends SVGFilterElement{ append: ddeAppend<ddeSVGFilterElement>; }
interface ddeSVGForeignObjectElement extends SVGForeignObjectElement{ append: ddeAppend<ddeSVGForeignObjectElement>; }
interface ddeSVGGElement extends SVGGElement{ append: ddeAppend<ddeSVGGElement>; }
interface ddeSVGImageElement extends SVGImageElement{ append: ddeAppend<ddeSVGImageElement>; }
interface ddeSVGLineElement extends SVGLineElement{ append: ddeAppend<ddeSVGLineElement>; }
interface ddeSVGLinearGradientElement extends SVGLinearGradientElement{ append: ddeAppend<ddeSVGLinearGradientElement>; }
interface ddeSVGMarkerElement extends SVGMarkerElement{ append: ddeAppend<ddeSVGMarkerElement>; }
interface ddeSVGMaskElement extends SVGMaskElement{ append: ddeAppend<ddeSVGMaskElement>; }
interface ddeSVGMetadataElement extends SVGMetadataElement{ append: ddeAppend<ddeSVGMetadataElement>; }
interface ddeSVGMPathElement extends SVGMPathElement{ append: ddeAppend<ddeSVGMPathElement>; }
interface ddeSVGPathElement extends SVGPathElement{ append: ddeAppend<ddeSVGPathElement>; }
interface ddeSVGPatternElement extends SVGPatternElement{ append: ddeAppend<ddeSVGPatternElement>; }
interface ddeSVGPolygonElement extends SVGPolygonElement{ append: ddeAppend<ddeSVGPolygonElement>; }
interface ddeSVGPolylineElement extends SVGPolylineElement{ append: ddeAppend<ddeSVGPolylineElement>; }
interface ddeSVGRadialGradientElement extends SVGRadialGradientElement{ append: ddeAppend<ddeSVGRadialGradientElement>; }
interface ddeSVGRectElement extends SVGRectElement{ append: ddeAppend<ddeSVGRectElement>; }
interface ddeSVGScriptElement extends SVGScriptElement{ append: ddeAppend<ddeSVGScriptElement>; }
interface ddeSVGSetElement extends SVGSetElement{ append: ddeAppend<ddeSVGSetElement>; }
interface ddeSVGStopElement extends SVGStopElement{ append: ddeAppend<ddeSVGStopElement>; }
interface ddeSVGStyleElement extends SVGStyleElement{ append: ddeAppend<ddeSVGStyleElement>; }
interface ddeSVGSVGElement extends SVGSVGElement{ append: ddeAppend<ddeSVGSVGElement>; }
interface ddeSVGSwitchElement extends SVGSwitchElement{ append: ddeAppend<ddeSVGSwitchElement>; }
interface ddeSVGSymbolElement extends SVGSymbolElement{ append: ddeAppend<ddeSVGSymbolElement>; }
interface ddeSVGTextElement extends SVGTextElement{ append: ddeAppend<ddeSVGTextElement>; }
interface ddeSVGTextPathElement extends SVGTextPathElement{ append: ddeAppend<ddeSVGTextPathElement>; }
interface ddeSVGTitleElement extends SVGTitleElement{ append: ddeAppend<ddeSVGTitleElement>; }
interface ddeSVGTSpanElement extends SVGTSpanElement{ append: ddeAppend<ddeSVGTSpanElement>; }
interface ddeSVGUseElement extends SVGUseElement{ append: ddeAppend<ddeSVGUseElement>; }
interface ddeSVGViewElement extends SVGViewElement{ append: ddeAppend<ddeSVGViewElement>; }
// editorconfig-checker-enable
export interface Signal<V, A> {
	/** The current value of the signal */
	get(): V;
	/** Set new value of the signal */
	set(value: V): V;
	toJSON(): V;
	valueOf(): V;
}
type Action<V>= (this: { value: V, stopPropagation(): void }, ...a: any[])=> typeof signal._ | void;
//type SymbolSignal= Symbol;
type SymbolOnclear= symbol;
type Actions<V>= Record<string | SymbolOnclear, Action<V>>;
type OnListenerOptions= Pick<AddEventListenerOptions, "signal"> & { first_time?: boolean };
interface signal{
	_: Symbol
	/**
	 * Computations signal. This creates a signal which is computed from other signals.
	 * */
	<V extends ()=> any>(computation: V): Signal<ReturnType<V>, {}>
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
	 * const fullname= S(()=> name.get()+" "+surname.get());
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
	on<T>(signal: Signal<T, any>, onchange: (a: T)=> void, options?: OnListenerOptions): void;
	symbols: {
		//signal: SymbolSignal;
		onclear: SymbolOnclear;
	}
	/**
	 * Reactive element, which is rendered based on the given signal.
	 * ```js
	 * S.el(signal, value=> value ? el("b", "True") : el("i", "False"));
	 * S.el(listS, list=> list.map(li=> el("li", li)));
	 * ```
	 * */
	el<S extends any>(signal: Signal<S, any>, el: (v: S)=> Element | Element[] | DocumentFragment): DocumentFragment;

	observedAttributes(custom_element: HTMLElement): Record<string, Signal<string, {}>>;
}
export const signal: signal;
export const S: signal;
declare global {
	type ddeSignal<T, A= {}>= Signal<T, A>;
	type ddeAction<V>= Action<V>
	type ddeActions<V>= Actions<V>
}