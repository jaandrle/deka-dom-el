import { O } from "deka-dom-el/observables";
const observable= O(0, {
	increaseOnlyOdd(add){
		console.info(add);
		if(add%2 === 0) return this.stopPropagation();
		this.value+= add;
	}
});
O.on(observable, console.log);
const oninterval= ()=>
	O.action(observable, "increaseOnlyOdd", Math.floor(Math.random()*100));

const interval= 5*1000;
setTimeout(
	clearInterval,
	10*interval,
	setInterval(oninterval, interval)
);
