import { el, on } from "deka-dom-el";
import { S } from "deka-dom-el/signals";

const url_base= {
	jsdeka: "https://cdn.jsdelivr.net/gh/jaandrle/deka-dom-el/dist/",
};

export function getLibraryUrl(){
	const lib= S([ "esm", "-with-signals", ".min" ]);
	const url= S(()=> url_base.jsdeka+lib.get().join(""));
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
	const onCopy= on("click", ev => {
		const code= /** @type {HTMLDivElement} */ (ev.target).previousElementSibling;
		navigator.clipboard.writeText(code.textContent);
	});

	return el("form", { id: "library-url-form" }, onSubmit).append(
		el("select", { name: "module" }, onChangeSubmit).append(
			el("option", { value: "esm", textContent: "ESM — modern JavaScript module" },
				isSelected(lib.get()[0])),
			el("option", { value: "iife", textContent: "IIFE — legacy JavaScript with DDE global variable" },
				isSelected(lib.get()[0])),
		),
		el("select", { name: "what" }, onChangeSubmit).append(
			el("option", { value: "", textContent: "only DOM part" },
				isSelected(lib.get()[1])),
			el("option", { value: "-with-signals", textContent: "DOM part and signals library" },
				isSelected(lib.get()[1])),
		),
		el("select", { name: "minified" }, onChangeSubmit).append(
			el("option", { value: "", textContent: "unminified" },
				isSelected(lib.get()[2])),
			el("option", { value: ".min", textContent: "minified" },
				isSelected(lib.get()[2])),
		),
		el("output").append(
			el("p", "Library URL:"),
			el("div", { className: "code", dataJs: "done", tabIndex: 0 }).append(
				el("code").append(
					el("pre", S(()=> url.get()+".js")),
				),
				el("button", {
					className: "copy-button",
					textContent: "Copy",
					ariaLabel: "Copy code to clipboard",
				}, onCopy),
			),
			el("p", "Library type definition:"),
			el("div", { className: "code", dataJs: "done", tabIndex: 0 }).append(
				el("code").append(
					el("pre", S(()=> url.get()+".d.ts")),
				),
				el("button", {
					className: "copy-button",
					textContent: "Copy",
					ariaLabel: "Copy code to clipboard",
				}, onCopy),
			),
		)
	)
}
function isSelected(value){
	return element=> element.selected= element.value===value;
}
