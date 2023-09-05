export type Signal<V, A>= (set?: V)=> V & A;
type Action<V>= (this: { value: V }, ...a: any[])=> typeof S._ | void;
type Actions<V>= Record<string, Action<V>>;
interface S {
	_: Symbol
	<V, A extends Actions<V>>(value: V, actions?: A): Signal<V, A>;
	action<S extends Signal<any, Actions<any>>, A extends (S extends Signal<any, infer A> ? A : never), N extends keyof A>(
		signal: S,
		name: N,
		...params: A[N] extends (...args: infer P)=> any ? P : never
	): void;
	clear(...signals: Signal<any, any>): void;
	on<T>(signal: Signal<T, any>, onchange: (a: T)=> void, options?: AddEventListenerOptions): void
}
export const S: S;
