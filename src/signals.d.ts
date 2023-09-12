export type Signal<V, A>= (set?: V)=> V & A;
type Action<V>= (this: { value: V }, ...a: any[])=> typeof S._ | void;
type SymbolOnclear= Symbol;
type SymbolSignal= Symbol;
type Actions<V>= Record<string, Action<V>>;
interface S {
	_: Symbol
	/**
	 * Simple example:
	 * ```js
	 * const hello= S("Hello Signal");
	 * ```
	 * …simple todo signal:
	 * ```js
	 * const todos= S([], {
	 * 	add(v){ this.value.push(S(v)); },
	 * 	remove(i){ this.value.splice(i, 1); },
	 * 	[S.symbols.onclear](){ S.clear(...this.value); },
	 * });
	 * ```
	 * …computed signal:
	 * ```js
	 * const name= S("Jan");
	 * const surname= S("Andrle");
	 * const fullname= S(()=> name()+" "+surname());
	 * ```
	 * @param value Initial signal value. Or function computing value from other signals.
	 * @param actions Use to define actions on the signal. Such as add item to the array.
	 *		There is also a reserved function `S.symbol.onclear` which is called when the signal is cleared
	 *		by `S.clear`.
	 * */
	<V, A extends Actions<V>>(value: V, actions?: A): Signal<V, A>;
	action<S extends Signal<any, Actions<any>>, A extends (S extends Signal<any, infer A> ? A : never), N extends keyof A>(
		signal: S,
		name: N,
		...params: A[N] extends (...args: infer P)=> any ? P : never
	): void;
	clear(...signals: Signal<any, any>): void;
	on<T>(signal: Signal<T, any>, onchange: (a: T)=> void, options?: AddEventListenerOptions): void;
	symbols: {
		signal: SymbolSignal;
		onclear: SymbolOnclear;
	}
	el<S extends any, T extends HTMLElement>(signal: Signal<S, any>, el: (v: S)=> T): T;
}
export const S: S;
declare global {
	type ddeSignal<T, A= {}>= Signal<T, A>;
	type ddeActions<V>= Actions<V>
}
