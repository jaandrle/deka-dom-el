import { S } from "deka-dom-el/signals";
// A — `signal` represents a reactive value
const signal= S(0);
// B — just reacts on signal changes
S.on(signal, console.log);
// C — just updates the value
const update= ()=> signal.set(signal.get()+1);

update();
const interval= 5*1000;
setTimeout(clearInterval, 10*interval,
	setInterval(update, interval));
