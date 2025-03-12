import { el } from "deka-dom-el";
import { mnemonicUl } from "../mnemonicUl.html.js";

export function mnemonic(){
	return mnemonicUl().append(
		el("li").append(
			el("code", "memo.scope(<function>, <argument(s)>)"),
			" — Scope for memo",
		),
		el("li").append(
			el("code", "memo(<key>, <generator>)"),
			" — returns value from memo and/or generates it (and caches it)",
		),
	);
}
