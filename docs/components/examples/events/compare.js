import { el, on } from "deka-dom-el";
const log= mark=> console.log.bind(console, mark);

const button= el("button", "Test click");
button.addEventListener("click", log("`addEventListener`"), { once: true });
on("click", log("`on`"), { once: true })(button);

document.body.append(
	button
);
