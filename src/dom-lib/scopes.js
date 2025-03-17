import { enviroment as env } from './common.js';
import { oAssign } from "../helpers.js";
import { on } from "./events.js";

/**
 * Array of scope contexts for tracking component hierarchies
 * @type {{ scope: object, prevent: boolean, host: function }[]}
 */
const scopes= [ {
	get scope(){ return  env.D.body; },
	host: c=> c ? c(env.D.body) : env.D.body,
	prevent: true,
} ];
/** Store for disconnect abort controllers */
const store_abort= new WeakMap();
/**
 * Scope management utility for tracking component hierarchies
 */
export const scope= {
	/**
	 * Gets the current scope
	 * @returns {typeof scopes[number]} Current scope context
	 */
	get current(){ return scopes[scopes.length-1]; },

	/**
	 * Gets the host element of the current scope
	 * @returns {Function} Host accessor function
	 */
	get host(){ return this.current.host; },

	/**
	 * Creates/gets an AbortController that triggers when the element disconnects
	 * */
	get signal(){
		const { host }= this;
		if(store_abort.has(host)) return store_abort.get(host);

		const a= new AbortController();
		store_abort.set(host, a);
		host(on.disconnected(()=> a.abort()));
		return a.signal;
	},

	/**
	 * Prevents default behavior in the current scope
	 * @returns {Object} Current scope context
	 */
	preventDefault(){
		const { current }= this;
		current.prevent= true;
		return current;
	},

	/**
	 * Gets a copy of the current scope stack
	 * @returns {Array} Copy of scope stack
	 */
	get state(){ return [ ...scopes ]; },

	/**
	 * Pushes a new scope to the stack
	 * @param {Object} [s={}] - Scope object to push
	 * @returns {number} New length of the scope stack
	 */
	push(s= {}){ return scopes.push(oAssign({}, this.current, { prevent: false }, s)); },

	/**
	 * Pushes the root scope to the stack
	 * @returns {number} New length of the scope stack
	 */
	pushRoot(){ return scopes.push(scopes[0]); },

	/**
	 * Pops the current scope from the stack
	 * @returns {Object|undefined} Popped scope or undefined if only one scope remains
	 */
	pop(){
		if(scopes.length===1) return;
		return scopes.pop();
	},
};
