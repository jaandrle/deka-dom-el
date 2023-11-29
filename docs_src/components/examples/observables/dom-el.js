import { O } from "deka-dom-el/observables";
const count= O(0, {
	add(){ this.value= this.value + Math.round(Math.random()*10); }
});
const numbers= O([ count() ], {
	push(next){ this.value.push(next); }
});

import { el } from "deka-dom-el";
document.body.append(
	O.el(count, count=> count%2
		? el("p", "Last number is odd.")
		: el()
	),
	el("p", "Lucky numbers:"),
	el("ul").append(
		O.el(numbers, numbers=> numbers.toReversed()
			.map(n=> el("li", n)))
	)
);

const interval= 5*1000;
setTimeout(clearInterval, 10*interval, setInterval(function(){
	O.action(count, "add");
	O.action(numbers, "push", count());
}, interval));
