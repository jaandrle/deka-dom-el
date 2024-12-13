import { el } from "deka-dom-el";
document.head.append(
	el("style").append(
		".class1{ font-weight: bold; }",
		".class2{ color: purple; }"
	)
);
document.body.append(
	el(component, { className: "class2", textContent: "Hello World!" }),
	component({ className: "class2", textContent: "Hello World!" })
);

function component({ className, textContent }){
	return el("div", { className: [ "class1", className ].join(" ") }).append(
		el("p", textContent)
	);
}
