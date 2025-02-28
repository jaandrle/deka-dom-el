/**
 * Symbol used to identify signals in objects
 * @type {string}
 */
export const mark= "__dde_signal";

/**
 * Error class for signal definition tracking
 * Shows the correct stack trace for debugging signal creation
 */
export class SignalDefined extends Error{
	constructor(){
		super();
		const [ curr, ...rest ]= this.stack.split("\n");
		const curr_file= curr.slice(curr.indexOf("@"), curr.indexOf(".js:")+4);
		this.stack= rest.find(l=> !l.includes(curr_file));
	}
}

/**
 * Batches signal updates to improve performance
 * @type {Function}
 */
export const queueSignalWrite= (()=> {
	let pendingSignals= new Set();
	let scheduled= false;

	/**
	 * Processes all pending signal updates
	 * @private
	 */
	function flushSignals() {
		scheduled = false;
		for(const signal of pendingSignals){
			const M = signal[mark];
			if(M) M.listeners.forEach(l => l(M.value));
		}
		pendingSignals.clear();
	}

	/**
	 * Queues a signal for update
	 * @param {Object} s - Signal to queue
	 */
	return function(s){
		pendingSignals.add(s);
		if(scheduled) return;
		scheduled = true;
		queueMicrotask(flushSignals);
	}
})();
