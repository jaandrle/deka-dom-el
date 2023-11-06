import { assignAttribute, classListDeclarative } from "../../../index-with-signals.js";
const paragraph= document.createElement("p");

assignAttribute(paragraph, "textContent", "Hello, world!");
assignAttribute(paragraph, "style", { color: "navy" });

assignAttribute(paragraph, "dataTest1", "v1");
assignAttribute(paragraph, "dataset", { test2: "v2" });

assignAttribute(paragraph, "ariaLabel", "v1");
assignAttribute(paragraph, "ariaset", { role: "none" });


classListDeclarative(paragraph, {
	classAdd: true,
	classRemove: false,
	classAdd1: 1,
	classRemove1: 0,
	classToggle: -1
});

console.log(paragraph.outerHTML);
document.body.append(
	paragraph
);
