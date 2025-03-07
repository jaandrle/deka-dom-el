import { style, el, S } from './exports.js';
style.css`
:root{
	color-scheme: dark light;
}
`;
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
	el(CustomHTMLTestElement.tagName, { name: "attr" }).append(
		el("span", { textContent: "test", slot: "test" }),
		el("span", { textContent: "test", slot: "test" }),
	),
	el(thirdParty),
	el(CustomSlottingHTMLElement.tagName, { onclick: ()=> toggle.set(!toggle.get()) }).append(
		el("strong", { slot: "name", textContent: "Honzo" }),
		S.el(toggle, is=> is
			? el("span", "…default slot")
			: el("span", "…custom slot")
		)
	)
);
