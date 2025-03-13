/**
 * This is helper to write texts in code more readable
 * and doesn’t inpact the finally generated text in HTML.
 *
 * ```js
 * t`
 *		Hello ${el("b", "world")}!
 *		How are you?
 * ` === "Hello <b>world</b>! How are you?"
 * ```
 *
 * In future, this can be expanded to allow translations.
 *
 * ```js
 * t(key)`text`; // for example
 * ```
 *
 * @param {TemplateStringsArray} strings
 * @param {...(string|Node)} values
 * @returns {DocumentFragment}
 * */
export function T(strings, ...values){
	const out= [];
	tT(s=> out.push(s), strings, ...values);
	const fragment= document.createDocumentFragment();
	fragment.append(...out);
	return fragment;
}
/**
 * Similarly to {@link T}, but for only strings.
 * @param {TemplateStringsArray} strings
 * @param {...string} values
 * @returns {string}
 * */
export function t(strings, ...values){
	let out= "";
	tT(s=> out+= s, strings, ...values);
	return out;
}

/**
 * @param {(input: string|Node)=> void} callback
 * @param {TemplateStringsArray} strings
 * @param {...(string|Node)} values
 * */
function tT(callback, strings, ...values){
	const { length }= strings;
	const last= length-1;
	for(let i= 0; i<length; i++){
		const out= strings[i].replace(/\n\s+/g, " ");
		callback(!i ? out.trimStart() : i===last ? out.trimEnd() : out);
		if(i<values.length) callback(values[i]);
	}
}
