import { S } from "deka-dom-el/signals";
const count= S(0, {
	add(){ this.value= this.value + Math.round(Math.random()*10); }
});
const numbers= S([ count() ], {
	push(next){ this.value.push(next); }
});

import { el } from "deka-dom-el";
document.body.append(
	S.el(count, count=> count%2
		? el("p", "Last number is odd.")
		: el()
	),
	el("p", "Lucky numbers:"),
	el("ul").append(
		S.el(numbers, numbers=> numbers.toReversed()
			.map(n=> el("li", n)))
	)
);

const interval= 5*1000;
setTimeout(clearInterval, 10*interval, setInterval(function(){
	S.action(count, "add");
	S.action(numbers, "push", count());
}, interval));
