import { el } from "deka-dom-el";
import { mnemonicUl } from "../mnemonicUl.html.js";

export function mnemonic(){
	return mnemonicUl().append(
		el("li").append(
			el("code", "assign(<element>, ...<objects>): <element>"),
			" — assign properties (prefered, or attributes) to the element",
		),
		el("li").append(
			el("code", "el(<tag-name>, <primitive>)[.append(...)]: <element-from-tag-name>"),
			" — simple element containing only text (accepts string, number or signal)",
		),
		el("li").append(
			el("code", "el(<tag-name>, <object>)[.append(...)]: <element-from-tag-name>"),
			" — element with more properties (prefered, or attributes)",
		),
		el("li").append(
			el("code", "el(<function>, <function-argument(s)>)[.append(...)]: <element-returned-by-function>"),
			" — using component represented by function (must accept object like for <tag-name>)",
		),
		el("li").append(
			el("code", "el(<...>, <...>, ...<addons>)"),
			" — see following section of documentation",
		),
		el("li").append(
			el("code", "elNS(<namespace>)(<as-el-see-above>)[.append(...)]: <element-based-on-arguments>"),
			" — typically SVG elements",
		),
	);
}
