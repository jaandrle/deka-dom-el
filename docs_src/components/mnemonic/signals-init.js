import { el } from "deka-dom-el";
import { mnemonicUl } from "../mnemonicUl.html.js";

export function mnemonic(){
	return mnemonicUl().append(
		el("li").append(
			el("code", "S(<value>)"), " — signal: reactive value",
		),
		el("li").append(
			el("code", "S(()=> <computation>)"), " — read-only signal: reactive value dependent on calculation using other signals",
		),
		el("li").append(
			el("code", "S.on(<signal>, <listener>[, <options>])"), " — listen to the signal value changes",
		),
		el("li").append(
			el("code", "S.clear(...<signals>)"), " — off and clear signals",
		),
		el("li").append(
			el("code", "S(<value>, <actions>)"), " — signal: pattern to create complex reactive objects/arrays",
		),
		el("li").append(
			el("code", "S.action(<signal>, <action-name>, ...<action-arguments>)"), " — invoke an action for given signal"
		),
		el("li").append(
			el("code", "S.el(<signal>, <function-returning-dom>)"), " — render partial dom structure (template) based on the current signal value",
		)
	);
}
