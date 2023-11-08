import { style, el } from './exports.js';
document.head.append(style.element);
import { fullNameComponent } from './components/fullNameComponent.js';
import { todosComponent } from './components/todosComponent.js';
import { CustomHTMLTestElement } from "./components/webComponent.js";

document.body.append(
	el("h1", "Experiments:"),
	el(fullNameComponent),
	el(todosComponent),
	el(CustomHTMLTestElement.tagName, { name: "attr" })
);
