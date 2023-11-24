import { O } from "deka-dom-el/observables";
// α — `observable` represents a reactive value
const observable= O(0);
// β — just reacts on observable changes
O.on(observable, console.log);
// γ — just updates the value
observable(observable()+1);
setInterval(()=> observable(observable()+1), 5000);
