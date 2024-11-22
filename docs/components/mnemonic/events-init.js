import { el } from "deka-dom-el";
import { mnemonicUl } from "../mnemonicUl.html.js";

export function mnemonic(){
	return mnemonicUl().append(
		el("li").append(
			el("code", "on(<event>, <listener>[, <options>])(<element>)"),
			" — just ", el("code", "<element>.addEventListener(<event>, <listener>[, <options>])")
		),
		el("li").append(
			el("code", "on.<live-cycle>(<event>, <listener>[, <options>])(<element>)"),
			" — corresponds to custom elemnets callbacks ", el("code", "<live-cycle>Callback(...){...}"),
			". To connect to custom element see following page, else it is simulated by MutationObserver."
		),
		el("li").append(
			el("code", "dispatchEvent(<event>[, <options>])(element)"),
			" — just ", el("code", "<element>.dispatchEvent(new Event(<event>[, <options>]))")
		),
		el("li").append(
			el("code", "dispatchEvent(<event>[, <options>])(element, detail)"),
			" — just ", el("code", "<element>.dispatchEvent(new CustomEvent(<event>, { detail, ...<options> }))")
		),
	);
}
