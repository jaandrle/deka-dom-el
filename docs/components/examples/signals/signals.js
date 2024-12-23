import { S } from "deka-dom-el/signals";
// α — `signal` represents a reactive value
const signal= S(0);
// β — just reacts on signal changes
S.on(signal, console.log);
// γ — just updates the value
const update= ()=> signal(signal()+1);

update();
const interval= 5*1000;
setTimeout(clearInterval, 10*interval,
	setInterval(update, interval));
