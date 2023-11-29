import { O } from "deka-dom-el/observables";
const observable= O(0);
// computation pattern
const double= O(()=> 2*observable());

const ac= new AbortController();
O.on(observable, v=> console.log("observable", v), { signal: ac.signal });
O.on(double, v=> console.log("double", v), { signal: ac.signal });

observable(observable()+1);
const interval= 5 * 1000;
const id= setInterval(()=> observable(observable()+1), interval);
ac.signal.addEventListener("abort",
	()=> setTimeout(()=> clearInterval(id), 2*interval));

setTimeout(()=> ac.abort(), 3*interval)
