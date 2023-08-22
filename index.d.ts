/**
 * @private
 */
type T_DOM_HETNM= HTMLElementTagNameMap & SVGElementTagNameMap & {
	'<>': DocumentFragment,
	'': HTMLElement,
	'zzz_text': Text
}
/**
 * @private
 */
type T_DOM_ATTRS_MODIFIED= {
	/**
	 * In fact argumen for `*.setAttribute("style", *)`.
	 */
	style: string
	/**
	 * Provide option to add/remove/toggle CSS clasess (index of object) using 1/0/-1. In fact `el.classList.toggle(class_name)` for `-1` and `el.classList.toggle(class_name, Boolean(...))` for others.
	 */
	classList: Record<string,-1|0|1>
}
/**
 * Just element attributtes
 *
 * In most cases, you can use native propertie such as [MDN WEB/API/Element](https://developer.mozilla.org/en-US/docs/Web/API/Element) and so on (e.g. [`Text`](https://developer.mozilla.org/en-US/docs/Web/API/Text)).
 *
 * There is added support for `data[A-Z].*`/`aria[A-Z].*` to be converted to the kebab-case alternatives.
 * @private
 */
type T_DOM_ATTRS<T extends keyof T_DOM_HETNM | T_DOM_HETNM[keyof T_DOM_HETNM]>=
	T extends keyof T_DOM_HETNM ?
	Omit<T_DOM_HETNM[T],"classList"> & T_DOM_ATTRS_MODIFIED :
	Omit<T,"classList"> & T_DOM_ATTRS_MODIFIED;
/**
 * Procedure for merging object into the element properties.
 * Very simple example: `$dom.assign(document.body, { className: "test" });` is equivalent to `document.body.className= "test";`.
 * It is not deep copy in general, but it supports `style`, `style_vars` and `dataset` objects (see below).
 *
 * **#1: All together**
 * ```javascript
 * const el= document.body;
 * const onclick= function(){ console.log(this.dataset.js_param); };
 * $dom.assign(el, { textContent: "BODY", style: "color: red;", dataset: { js_param: "CLICKED" }, onclick });
 * //result HTML: <body style="color: red;" data-js_param="CLICKED">BODY</body>
 * //console output on click: "CLICKED"
 * $dom.assign(el, { style: { color: "green" } });
 * //result HTML: <body style="color: green;" data-js_param="CLICKED">BODY</body>
 * //console output on click: "CLICKED"
 * ```
 *
 * **`\*.classList.toggle`**
 * ```javascript
 * const el= document.body;
 * $dom.assign(el, { classList: { testClass: -1 } });
 * //result HTML: <body class="testClass">…</body>
 * $dom.assign(el, { classList: { testClass: -1 } });
 * //result HTML: <body class="">…</body>
 *
 * $dom.assign(el, { classList: { testClass: true } });//or 1
 * //result HTML: <body class="testClass">…</body>
 * $dom.assign(el, { classList: { testClass: false } });//or 0
 * //result HTML: <body class="">…</body>
 * //...
 * ```
 *
 * **#3 Links and images**
 * ```javascript
 * $dom.assign(A_ELEMENT, { href: "www.google.com" });//=> <a href="www.google.com" …
 * $dom.assign(IMG_ELEMENT, { src: "image.png" });//=> <img src="image.png" …
 *
 * **#4 data\* and aria\***
 * $dom.assign(el, { ariaLabel: "The aria-label", dataExample: "data-example" });//=> <body aria-label="The aria-label" data-example="data-example">
 * ```
 * @category Public
 * @version 2.0.0
 */
export function assign<EL extends HTMLElement>(element: EL, ...attrs_array: T_DOM_ATTRS<EL>[]): EL

export function el<TAG extends keyof T_DOM_HETNM>(tag_name: TAG, attrs: T_DOM_ATTRS<T_DOM_HETNM[TAG]>): T_DOM_HETNM[TAG]
