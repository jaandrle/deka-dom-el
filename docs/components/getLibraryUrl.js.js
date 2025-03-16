import { el, on } from "deka-dom-el";
import { S } from "deka-dom-el/signals";

const url_base= {
	jsdeka: "https://cdn.jsdelivr.net/gh/jaandrle/deka-dom-el/dist/",
};

export function getLibraryUrl(){
	const lib= S([ "esm", "-with-signals", ".min" ]);
	const url= S(()=> url_base.jsdeka+lib.get().join(""));
	const urlLabel= S(() => {
		const [format, signalsPart, minified] = lib.get();
		const formatText = format === "esm" ? "ES Module" : "IIFE";
		const signalsText = signalsPart ? " with signals" : "";
		const minText = minified ? " (minified)" : "";
		return `${formatText}${signalsText}${minText}`;
	})
	const onSubmit= on("submit", ev => {
		ev.preventDefault();
		const form= new FormData(/** @type {HTMLFormElement} */ (ev.target));
		lib.set([
			"module",
			"what",
			"minified",
		].map(name => /** @type {string} */(form.get(name))));
	});
	const onChangeSubmit= on("change",
		ev=> /** @type {HTMLSelectElement} */(ev.target).form.requestSubmit()
	);

	return el("form", { id: "library-url-form" }, onSubmit).append(
		el("h4", "Select your preferred library format:"),
		el("div", { className: "selectors" }).append(
			el("select", { name: "module" }, onChangeSubmit,
				on.defer(select => select.value = lib.get()[0]),
			).append(
				el("option", { value: "esm", textContent: "ESM — modern JavaScript module" }),
				el("option", { value: "iife", textContent: "IIFE — legacy JavaScript with DDE global variable" }),
			),
			el("select", { name: "what" }, onChangeSubmit,
				on.defer(select => select.value = lib.get()[1]),
			).append(
				el("option", { value: "", textContent: "DOM part only" }),
				el("option", { value: "-with-signals", textContent: "DOM + signals" }),
			),
			el("select", { name: "minified" }, onChangeSubmit,
				on.defer(select => select.value = lib.get()[2]),
			).append(
				el("option", { value: "", textContent: "Unminified" }),
				el("option", { value: ".min", textContent: "Minified" }),
			),
		),
		el("output").append(
			el("div", { className: "url-title" }).append(
				el("strong", "JavaScript:"),
				el("span", urlLabel),
			),
			el(code, { value: S(()=> url.get()+".js") }),
			el("div", { className: "url-title" }).append(
				el("strong", "TypeScript definition:")
			),
			el(code, { value: S(()=> url.get()+".d.ts") }),
			el("p", { className: "info-text",
				textContent: "Use the CDN URL in your HTML or import it in your JavaScript files."
			})
		)
	)
}
/** @param {{ value: ddeSignal<string> }} props */
function code({ value }){
	/** @type {ddeSignal<"Copy"|"Copied!">} */
	const textContent= S("Copy");
	const onCopy= on("click", () => {
		navigator.clipboard.writeText(value.get());

		textContent.set("Copied!");
		setTimeout(() => {
			textContent.set("Copy");
		}, 1500);
	});
	return el("div", { className: "code", dataJs: "done", tabIndex: 0 }).append(
		el("code").append(
			el("pre", value),
		),
		el("button", {
			className: "copy-button",
			textContent,
			ariaLabel: "Copy code to clipboard",
		}, onCopy)
	)
	;
}
