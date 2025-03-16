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
	/** @type {Map<ddeSignal, boolean>} */
	let pendingSignals= new Map();
	let scheduled= false;

	/**
	 * Processes all pending signal updates
	 * @private
	 */
	function flushSignals() {
		scheduled = false;
		const todo= pendingSignals;
		pendingSignals= new Map();
		for(const [ signal, force ] of todo){
			const M = signal[mark];
			if(M) M.listeners.forEach(l => l(M.value, force));
		}
	}

	/**
	 * Queues a signal for update
	 * @param {ddeSignal} s - Signal to queue
	 * @param {boolean} force - Forced update
	 */
	return function(s, force= false){
		pendingSignals.set(s, pendingSignals.get(s) || force);
		if(scheduled) return;
		scheduled = true;
		queueMicrotask(flushSignals);
	};
})();
