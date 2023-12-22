import { style, el } from './exports.js';
document.head.append(style.element);
import { fullNameComponent } from './components/fullNameComponent.js';
import { todosComponent } from './components/todosComponent.js';
import { CustomHTMLTestElement, CustomSlottingHTMLElement } from "./components/webComponent.js";
import { thirdParty } from "./components/3rd-party.js";

document.body.append(
	el("h1", "Experiments:"),
	el(fullNameComponent),
	el(todosComponent),
	el(CustomHTMLTestElement.tagName, { name: "attr" }),
	el(thirdParty),
	el(CustomSlottingHTMLElement.tagName).append(
		el("strong", { slot: "name", textContent: "Honzo" }),
		el("span", "…default slot")
	)
);
