import { style, el } from './exports.js';
document.head.append(style.element);
import { fullNameComponent } from './components/fullNameComponent.js';
import { todosComponent } from './components/todosComponent.js';
import "./components/webComponent.js";

document.body.append(
	el("h1", "Experiments:"),
	el(fullNameComponent),
	el(todosComponent),
	el("custom-test", { name: "attr" })
);
