import { S } from "deka-dom-el/signals";
const count= S(0);

import { el } from "deka-dom-el";
document.body.append(
	el("p", S(()=> "Currently: "+count.get())),
	el("p", { classList: { red: S(()=> count.get()%2 === 0) }, dataset: { count }, textContent: "Attributes example" }),
);
document.head.append(
	el("style", ".red { color: red; }")
);

const interval= 5 * 1000;
setTimeout(clearInterval, 10*interval,
	setInterval(()=> count.set(count.get()+1), interval));