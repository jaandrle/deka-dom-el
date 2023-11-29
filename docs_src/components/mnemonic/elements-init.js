import { el } from "deka-dom-el";
import { mnemonicUl } from "../mnemonicUl.html.js";

export function mnemonic(){
	return mnemonicUl().append(
		el("li").append(
			el("code", "assign(<element>, ...<idl-objects>): <element>"), " — assign properties to the element",
		),
		el("li").append(
			el("code", "el(<tag-name>, <primitive>)[.append(...)]: <element-from-tag-name>"), " — simple element containing only text",
		),
		el("li").append(
			el("code", "el(<tag-name>, <idl-object>)[.append(...)]: <element-from-tag-name>"), " — element with more properties",
		),
		el("li").append(
			el("code", "el(<function>, <function-argument(s)>)[.append(...)]: <element-returned-by-function>"), " — using component represented by function",
		),
		el("li").append(
			el("code", "el(<...>, <...>, ...<addons>)"), " — see following page"
		),
		el("li").append(
			el("code", "elNS(<namespace>)(<as-el-see-above>)[.append(...)]: <element-based-on-arguments>"), " — typically SVG elements",
		)
	);
}
