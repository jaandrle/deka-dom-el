/**
 * Symbol used to identify signals in objects
 * @type {string}
 */
export const mark= "__dde_signal";

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
		const todo= pendingSignals;
		pendingSignals= new Set();
		for(const signal of todo){
			const M = signal[mark];
			if(M) M.listeners.forEach(l => l(M.value));
		}
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
	};
})();
