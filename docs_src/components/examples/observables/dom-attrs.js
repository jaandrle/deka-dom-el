import { O } from "deka-dom-el/observables";
const count= O(0);

import { el } from "deka-dom-el";
document.body.append(
	el("p", O(()=> "Currently: "+count())),
	el("p", { classList: { red: O(()=> count()%2) }, dataset: { count }, textContent: "Attributes example" })
);
document.head.append(
	el("style", ".red { color: red; }")
);

const interval= 5 * 1000;
setTimeout(clearInterval, 10*interval,
	setInterval(()=> count(count()+1), interval));
