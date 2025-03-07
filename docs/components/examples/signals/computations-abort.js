import { S } from "deka-dom-el/signals";
const signal= S(0);
// computation pattern
const double= S(()=> 2*signal.get());

const ac= new AbortController();
S.on(signal, v=> console.log("signal", v), { signal: ac.signal });
S.on(double, v=> console.log("double", v), { signal: ac.signal });

signal.set(signal.get()+1);
const interval= 5 * 1000;
const id= setInterval(()=> signal.set(signal.get()+1), interval);
ac.signal.addEventListener("abort",
	()=> setTimeout(()=> clearInterval(id), 2*interval));

setTimeout(()=> ac.abort(), 3*interval)