export type Observable<V, A>= (set?: V)=> V & A;
type Action<V>= (this: { value: V }, ...a: any[])=> typeof observable._ | void;
type SymbolOnclear= Symbol;
type SymbolObservable= Symbol;
type Actions<V>= Record<string, Action<V>>;
interface observable{
	_: Symbol
	/**
	 * Simple example:
	 * ```js
	 * const hello= S("Hello Observable");
	 * ```
	 * …simple todo observable:
	 * ```js
	 * const todos= S([], {
	 * 	add(v){ this.value.push(S(v)); },
	 * 	remove(i){ this.value.splice(i, 1); },
	 * 	[S.symbols.onclear](){ S.clear(...this.value); },
	 * });
	 * ```
	 * …computed observable:
	 * ```js
	 * const name= S("Jan");
	 * const surname= S("Andrle");
	 * const fullname= S(()=> name()+" "+surname());
	 * ```
	 * @param value Initial observable value. Or function computing value from other observables.
	 * @param actions Use to define actions on the observable. Such as add item to the array.
	 *		There is also a reserved function `S.symbol.onclear` which is called when the observable is cleared
	 *		by `S.clear`.
	 * */
	<V, A extends Actions<V>>(value: V, actions?: A): Observable<V, A>;
	/**
	 * Computations observable. This creates a observable which is computed from other observables.
	 * */
	<V>(computation: ()=> V): Observable<V, {}>
	action<S extends Observable<any, Actions<any>>, A extends (S extends Observable<any, infer A> ? A : never), N extends keyof A>(
		observable: S,
		name: N,
		...params: A[N] extends (...args: infer P)=> any ? P : never
	): void;
	clear(...observables: Observable<any, any>[]): void;
	on<T>(observable: Observable<T, any>, onchange: (a: T)=> void, options?: AddEventListenerOptions): void;
	symbols: {
		observable: SymbolObservable;
		onclear: SymbolOnclear;
	}
	/**
	 * Reactive element, which is rendered based on the given observable.
	 * ```js
	 * S.el(observable, value=> value ? el("b", "True") : el("i", "False"));
	 * S.el(listS, list=> list.map(li=> el("li", li)));
	 * ```
	 * */
	el<S extends any>(observable: Observable<S, any>, el: (v: S)=> Element | Element[]): DocumentFragment;

    attribute(name: string, initial?: string): Observable<string, {}>;
}
export const observable: observable;
export const O: observable;
declare global {
	type ddeObservable<T, A= {}>= Observable<T, A>;
	type ddeActions<V>= Actions<V>
}
