import { S } from "deka-dom-el/signals";
const signal= S(0, {
	increaseOnlyOdd(add){
		console.info(add);
		if(add%2 === 0) return this.stopPropagation();
		this.value+= add;
	}
});
S.on(signal, console.log);
const oninterval= ()=>
	S.action(signal, "increaseOnlyOdd", Math.floor(Math.random()*100));

const interval= 5*1000;
setTimeout(
	clearInterval,
	10*interval,
	setInterval(oninterval, interval)
);