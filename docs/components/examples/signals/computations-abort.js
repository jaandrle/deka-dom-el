import { S } from "deka-dom-el/signals";
const signal= S(0);
// computation pattern
const double= S(()=> 2*signal());

const ac= new AbortController();
S.on(signal, v=> console.log("signal", v), { signal: ac.signal });
S.on(double, v=> console.log("double", v), { signal: ac.signal });

signal(signal()+1);
const interval= 5 * 1000;
const id= setInterval(()=> signal(signal()+1), interval);
ac.signal.addEventListener("abort",
	()=> setTimeout(()=> clearInterval(id), 2*interval));

setTimeout(()=> ac.abort(), 3*interval)
