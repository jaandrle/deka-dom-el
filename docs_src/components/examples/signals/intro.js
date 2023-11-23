import { S } from "deka-dom-el/signals";
// α — `signal` represents a reactive value
const signal= S(0);
// β — just reacts on signal changes
S.on(signal, console.log);
// γ — just updates the value
signal(signal()+1);
setInterval(()=> signal(signal()+1), 5000);
