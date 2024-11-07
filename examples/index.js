import { style, el, S } from './exports.js';
document.head.append(style.element);
import { fullNameComponent } from './components/fullNameComponent.js';
import { todosComponent } from './components/todosComponent.js';
import { CustomHTMLTestElement, CustomSlottingHTMLElement } from "./components/webComponent.js";
import { thirdParty } from "./components/3rd-party.js";

const toggle= S(false);
document.body.append(
	el("h1", "Experiments:"),
	el(fullNameComponent),
	el(todosComponent),
	el(CustomHTMLTestElement.tagName, { name: "attr" }),
	el(thirdParty),
	el(CustomSlottingHTMLElement.tagName, { onclick: ()=> toggle(!toggle()) }).append(
		el("strong", { slot: "name", textContent: "Honzo" }),
		S.el(toggle, is=> is
			? el("span", "…default slot")
			: el("span", "…custom slot")
		)
	)
);
