export interface Signal<V, A> {
	/** The current value of the signal */
	get(): V;
	/** Set new value of the signal */
	set(value: V, force?: boolean): V;
	toJSON(): V;
	valueOf(): V;
}

type Action<V>= (this: { value: V, stopPropagation(): void }, ...a: any[])=> typeof signal._ | void;
//type SymbolSignal= Symbol;
type SymbolOnclear= symbol;
type Actions<V>= Record<string | SymbolOnclear, Action<V>>;
type OnListenerOptions= Pick<AddEventListenerOptions, "signal"> & { first_time?: boolean };
type SElement= Node | Element | DocumentFragment | ddeHTMLElement | ddeSVGElement | ddeDocumentFragment;
interface signal{
	_: Symbol
	/**
	 * Computations signal. This creates a signal which is computed from other signals.
	 * */
	<V extends ()=> any>(computation: V): Signal<ReturnType<V>, {}>
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
	 * const fullname= S(()=> name.get()+" "+surname.get());
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
	clear(...signals: Signal<any, any>[]): void;
	on<T>(signal: Signal<T, any>, onchange: (a: T)=> void, options?: OnListenerOptions): void;
	symbols: {
		//signal: SymbolSignal;
		onclear: SymbolOnclear;
	}
	/**
	 * Reactive element, which is rendered based on the given signal.
	 * ```js
	 * S.el(signal, value=> value ? el("b", "True") : el("i", "False"));
	 * S.el(listS, list=> list.map(li=> el("li", li)));
	 * ```
	 * */
	el<S extends any>(signal: Signal<S, any>, el: (v: S)=> SElement | SElement[]): DocumentFragment;

	observedAttributes(custom_element: HTMLElement): Record<string, Signal<string, {}>>;
}
export const signal: signal;
export const S: signal;
declare global {
	type ddeSignal<T, A= {}>= Signal<T, A>;
	type ddeAction<V>= Action<V>
	type ddeActions<V>= Actions<V>
}
