import { el, on } from "deka-dom-el";
const log= mark=> console.log.bind(console, mark);

const abort_controller= new AbortController();
const { signal }= abort_controller;

const button= el("button", "Test click");
button.addEventListener("click", log("`addEventListener`"), { signal });
on("click", log("`on`"), { signal })(button);

document.body.append(
	button, " ", el("button", { textContent: "Off", onclick: ()=> abort_controller.abort() })
);
