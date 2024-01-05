import { el } from "deka-dom-el";
import { mnemonicUl } from "../mnemonicUl.html.js";

export function mnemonic(){
	return mnemonicUl().append(
		el("li").append(
			el("code", "O(<value>)"), " — observable: reactive value",
		),
		el("li").append(
			el("code", "O(()=> <computation>)"), " — read-only observable: reactive value dependent on calculation using other observables",
		),
		el("li").append(
			el("code", "O.on(<observable>, <listener>[, <options>])"), " — listen to the observable value changes",
		),
		el("li").append(
			el("code", "O.clear(...<observables>)"), " — off and clear observables",
		),
		el("li").append(
			el("code", "O(<value>, <actions>)"), " — observable: pattern to create complex reactive objects/arrays",
		),
		el("li").append(
			el("code", "O.action(<observable>, <action-name>, ...<action-arguments>)"), " — invoke an action for given observable"
		),
		el("li").append(
			el("code", "O.el(<observable>, <function-returning-dom>)"), " — render partial dom structure (template) based on the current observable value",
		)
	);
}
