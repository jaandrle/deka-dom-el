import { el } from "deka-dom-el";
import { mnemonicUl } from "../mnemonicUl.html.js";

export function mnemonic(){
	return mnemonicUl().append(
		el("li").append(
			el("code", "el(<function>, <function-argument(s)>)[.append(...)]: <element-returned-by-function>"),
			" — using component represented by function",
		),
		el("li").append(
			el("code", "scope.host()"),
			" — get current component reference"
		),
		el("li").append(
			el("code", "scope.host(...<addons>)"),
			" — use addons to current component",
		)
	);
}
