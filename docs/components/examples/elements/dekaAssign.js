import { assign, assignAttribute, classListDeclarative } from "deka-dom-el";
const paragraph= document.createElement("p");

assignAttribute(paragraph, "textContent", "Hello, world!");

assignAttribute(paragraph, "style", "color: red; font-weight: bold;");
assignAttribute(paragraph, "style", { color: "navy" });

assignAttribute(paragraph, "dataTest1", "v1");
assignAttribute(paragraph, "dataset", { test2: "v2" });

assign(paragraph, { //textContent and style see above
	ariaLabel: "v1", //data* see above
	ariaset: { role: "none" }, // dataset see above
	"=onclick": "console.log(event)",
	onmouseout: console.info,
	".something": "something",
	classList: {} //see below
});

classListDeclarative(paragraph, {
	classAdd: true,
	classRemove: false,
	classAdd1: 1,
	classRemove1: 0,
	classToggle: -1
});

console.log(paragraph.outerHTML);
console.log("paragraph.something=", paragraph.something);
document.body.append(
	paragraph
);
