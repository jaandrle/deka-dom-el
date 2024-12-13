import { el, on } from "deka-dom-el";
import { S } from "deka-dom-el/signals";
document.body.append(
	el(HelloWorldComponent, { initial: "🚀" })
);
/** @typedef {"🎉" | "🚀"} Emoji */
/** @param {{ initial: Emoji }} attrs */
function HelloWorldComponent({ initial }){
	const clicks= S(0);
	const emoji= S(initial);
	/** @param {HTMLOptionElement} el */
	const isSelected= el=> (el.selected= el.value===initial);
	// @ts-expect-error 2339: The <select> has only two options with {@link Emoji}
	const onChange= on("change", event=> emoji(event.target.value));

	return el().append(
		el("p", {
			textContent: S(() => `Hello World ${emoji().repeat(clicks())}`),
			className: "example",
			ariaLive: "polite", //OR ariaset: { live: "polite" },
			dataset: { example: "Example" }, //OR dataExample: "Example",
		}),
		el("button",
			{ textContent: "Fire", type: "button" },
			on("click", ()=> clicks(clicks() + 1)),
			on("keyup", ()=> clicks(clicks() - 2)),
		),
		el("select", null, onChange).append(
			el(OptionComponent, "🎉", isSelected),//OR { textContent: "🎉" }
			el(OptionComponent, "🚀", isSelected),//OR { textContent: "🚀" }
		)
	);
}
function OptionComponent({ textContent }){
	return el("option", { value: textContent, textContent })
}
