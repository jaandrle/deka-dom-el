import { el, on } from "deka-dom-el";
const abort_controller= new AbortController();
const { signal }= abort_controller;
/** @type {ddeElementModifier<HTMLButtonElement>} */
const onclickOff= on("click", ()=> abort_controller.abort(), { signal });
/** @type {(ref?: HTMLOutputElement)=> HTMLOutputElement | null} */
const ref= (store=> ref=> ref ? (store= ref) : store)(null);

document.body.append(
	el("button", "Test `on`",
		on("click", console.log, { signal }),
		on("click", update, { signal }),
		on("mouseup", update, { signal })),
	" ",
	el("button", "Off", onclickOff),
	el("output", { style: { display: "block", whiteSpace: "pre" } }, ref)
);
/** @param {MouseEvent} event @this {HTMLButtonElement} */
function update(event){
	ref().append(
		event.type,
		"\n"
	);
}
