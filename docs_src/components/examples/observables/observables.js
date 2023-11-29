import { O } from "deka-dom-el/observables";
// α — `observable` represents a reactive value
const observable= O(0);
// β — just reacts on observable changes
O.on(observable, console.log);
// γ — just updates the value
const update= ()=> observable(observable()+1);

update();
const interval= 5*1000;
setTimeout(clearInterval, 10*interval,
	setInterval(update, interval));
