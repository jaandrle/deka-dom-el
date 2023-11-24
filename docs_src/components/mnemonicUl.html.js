import { styles } from "../ssr.js";
import { h3 } from "./pageUtils.html.js";
const host= ".notice";
styles.css`
${host} h3{
	margin-top: 0;
}
`;
import { el, simulateSlots } from "deka-dom-el";
/** @param {Object} props @param {string} props.textContent */
export function mnemonicUl({ textContent= "" }){
	if(textContent) textContent= " – "+textContent
	return simulateSlots(el("div", { className: "notice" }).append(
		el(h3, "Mnemonic"+textContent),
		el("ul").append(
			el("slot")
		)
	));
}
