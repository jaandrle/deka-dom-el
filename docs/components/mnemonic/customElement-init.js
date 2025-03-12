import { el } from "deka-dom-el";
import { mnemonicUl } from "../mnemonicUl.html.js";

export function mnemonic(){
	return mnemonicUl().append(
		el("li").append(
			el("code", "customElementRender(<connect-target>, <render-function>[, <properties>])"),
			" — use function to render DOM structure for given custom element (or its Shadow DOM)",
		),
		el("li").append(
			el("code", "customElementWithDDE(<custom-element>)"),
			" — register <custom-element> to DDE library, see also `lifecyclesToEvents`, can be also used as decorator",
		),
		el("li").append(
			el("code", "S.observedAttributes(<custom-element>)"),
			" — returns record of observed attributes (keys uses camelCase and values are signals)",
		),
		el("li").append(
			el("code", "lifecyclesToEvents(<class-declaration>)"),
			" — convert lifecycle methods to events, can be also used as decorator",
		),
		el("li").append(
			el("code", "simulateSlots(<class-instance>, <body>)"),
			" — simulate slots for Custom Elements without shadow DOM",
		),
		el("li").append(
			el("code", "simulateSlots(<dde-component>[, <mapper>])"),
			" — simulate slots for “dde”/functional components",
		),
	);
}