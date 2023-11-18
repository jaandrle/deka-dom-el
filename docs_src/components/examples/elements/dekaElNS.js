import { elNS, assign } from "deka-dom-el";
const elSVG= elNS("http://www.w3.org/2000/svg");
const elMath= elNS("http://www.w3.org/1998/Math/MathML");
document.body.append(
	elSVG("svg"), // see https://developer.mozilla.org/en-US/docs/Web/SVG and https://developer.mozilla.org/en-US/docs/Web/API/SVGElement
	elMath("math") // see https://developer.mozilla.org/en-US/docs/Web/MathML and https://developer.mozilla.org/en-US/docs/Web/MathML/Global_attributes
);

console.log(
	document.body.innerHTML.includes("<svg></svg><math></math>")
)
