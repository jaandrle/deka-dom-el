export const mark= "__dde_signal";

export class SignalDefined extends Error{
	constructor(){
		super();
		const [ curr, ...rest ]= this.stack.split("\n");
		const curr_file= curr.slice(curr.indexOf("@"), curr.indexOf(".js:")+4);
		this.stack= rest.find(l=> !l.includes(curr_file));
	}
}
export const queueSignalWrite= (()=> {
	let pendingSignals= new Set();
	let scheduled= false;

	function flushSignals() {
		scheduled = false;
		for(const signal of pendingSignals){
			const M = signal[mark];
			if(M) M.listeners.forEach(l => l(M.value));
		}
		pendingSignals.clear();
	}
	return function(s){
		pendingSignals.add(s);
		if(scheduled) return;
		scheduled = true;
		queueMicrotask(flushSignals);
	}
})();
