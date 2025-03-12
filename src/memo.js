import { hasOwn, oCreate } from "./helpers.js";
const memoMark= "__dde_memo";
const memo_scope= [];
/**
 * ```js
 * const fun= memo.scope(function (list){
 *	return list.map(item=> memo(item.key, ()=> el(heavy, item.title)));
 * }, { onlyLast: true });
 * ```
 * …this is internally used in `S.el`:
 * ```
 * S.el(listSignal, list=>
 *	list.map(item=> memo(item.key, ()=>
 *		el(heavy, item.title))));
 * ```
 * */
export function memo(key, generator){
	if(!memo_scope.length) return generator(key);
	const k= typeof key === "object" ? JSON.stringify(key) : key;
	const [ { cache, after } ]= memo_scope;
	return after(k, hasOwn(cache, k) ? cache[k] : generator(key));
}
memo.isScope= function(obj){ return obj[memoMark]; };
/**
 * @param {Function} fun
 * @param {Object} [options={}]
 * @param {AbortSignal} options.signal
 * @param {boolean} [options.onlyLast=false]
 * */
memo.scope= function memoScope(fun, { signal, onlyLast }= {}){
	let cache= oCreate();
	function memoScope(...args){
		if(signal && signal.aborted)
			return fun.apply(this, args);

		let cache_local= onlyLast ? cache : oCreate();
		memo_scope.unshift({
			cache,
			after(key, val){ return (cache_local[key]= val); }
		});
		const out= fun.apply(this, args);
		memo_scope.shift();
		cache= cache_local;
		return out;
	}
	memoScope[memoMark]= true;
	memoScope.clear= ()=> cache= oCreate();
	if(signal) signal.addEventListener("abort", memoScope.clear);
	return memoScope;
};
