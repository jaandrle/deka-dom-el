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
			el("code", "on.defer(<identity>=> <identity>)(<identity>)"),
			" — calls callback later",
		),
		el("li").append(
			el("code", "dispatchEvent(<event>[, <options>])(element)"),
			" — just ", el("code", "<element>.dispatchEvent(new Event(<event>[, <options>]))")
		),
		el("li").append(
			el("code", "dispatchEvent(<event>[, <options>])(<element>[, <detail>])"),
			" — just ", el("code", "<element>.dispatchEvent(new Event(<event>[, <options>] ))"), " or ",
			el("code", "<element>.dispatchEvent(new CustomEvent(<event>, { detail: <detail> }))")
		),
		el("li").append(
			el("code", "dispatchEvent(<event>[, <options>], <host>)([<detail>])"),
			" — just ", el("code", "<host>().dispatchEvent(new Event(<event>[, <options>]))"), " or ",
			el("code", "<host>().dispatchEvent(new CustomEvent(<event>, { detail: <detail> }[, <options>] ))"),
			" (see scopes section of docs)"
		),
	);
}
