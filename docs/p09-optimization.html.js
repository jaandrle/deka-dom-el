import { T, t } from "./utils/index.js";
export const info= {
	title: t`Performance Optimization`,
	fullTitle: t`Performance Optimization with dd<el>`,
	description: t`Techniques for optimizing your dd<el> applications, focusing on memoization and efficient rendering.`,
};

import { el } from "deka-dom-el";
import { simplePage } from "./layout/simplePage.html.js";
import { example } from "./components/example.html.js";
import { h3 } from "./components/pageUtils.html.js";
import { code } from "./components/code.html.js";
import { mnemonic } from "./components/mnemonic/optimization-init.js";
/** @param {string} url */
const fileURL= url=> new URL(url, import.meta.url);
const references= {
	/** memo documentation */
	memo_docs: {
		title: t`dd<el> memo API documentation`,
		href: "https://github.com/jaandrle/deka-dom-el#memo-api",
	},
	/** AbortController */
	mdn_abort: {
		title: t`MDN documentation for AbortController`,
		href: "https://developer.mozilla.org/en-US/docs/Web/API/AbortController",
	},
	/** Performance API */
	mdn_perf: {
		title: t`MDN documentation for Web Performance API`,
		href: "https://developer.mozilla.org/en-US/docs/Web/API/Performance_API",
	},
	/** Virtual DOM */
	virtual_dom: {
		title: t`Virtual DOM concept explanation`,
		href: "https://reactjs.org/docs/faq-internals.html#what-is-the-virtual-dom",
	},
	/** DocumentFragment */
	mdn_fragment: {
		title: t`MDN documentation for DocumentFragment`,
		href: "https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment",
	}
};

/** @param {import("./types.d.ts").PageAttrs} attrs */
export function page({ pkg, info }){
	const page_id= info.id;
	return el(simplePage, { info, pkg }).append(
		el("p").append(T`
			As your applications grow, performance becomes increasingly important. dd<el> provides several
			techniques to optimize rendering performance, especially when dealing with large lists or frequently
			updating components. This guide focuses on memoization and other optimization strategies.
		`),
		el("div", { className: "callout" }).append(
			el("h4", t`dd<el> Performance Optimization: Key Benefits`),
			el("ul").append(
				el("li", t`Efficient memoization system for component reuse`),
				el("li", t`Targeted re-rendering without virtual DOM overhead`),
				el("li", t`Memory management through AbortSignal integration`),
				el("li", t`Optimized signal updates for reactive UI patterns`),
				el("li", t`Simple debugging for performance bottlenecks`)
			)
		),
		el(code, { src: fileURL("./components/examples/optimization/intro.js"), page_id }),

		el(h3, t`Memoization with memo: Native vs dd<el>`),
		el("p").append(T`
			In standard JavaScript applications, optimizing list rendering often involves manual caching
			or relying on complex virtual DOM diffing algorithms. dd<el>'s ${el("code", "memo")} function
			provides a simpler, more direct approach:
		`),
		el("div", { className: "illustration" }).append(
			el("div", { className: "comparison" }).append(
				el("div").append(
					el("h5", t`Without Memoization`),
					el(code, { content: `
						// Each update to todosArray recreates all elements
						function renderTodos(todosArray) {
							return el("ul").append(
								S.el(todosArray, todos => todos.map(todo=>
									el("li", {
										textContent: todo.text,
										dataState: todo.completed ? "completed" : "",
									})
								))
							);
						}
					`, page_id })
				),
				el("div").append(
					el("h5", t`With dd<el>'s memo`),
					el(code, { content: `
						// With dd<el>’s memoization
						function renderTodos(todosArray) {
							return el("ul").append(
								S.el(todosArray, todos => todos.map(todo=>
									// Reuses DOM elements when items haven’t changed
									memo(todo.key, () =>
										el("li", {
											textContent: todo.text,
											dataState: todo.completed ? "completed" : "",
										})
								)))
							);
						}
					`, page_id })
				)
			)
		),
		el("p").append(T`
			The ${el("a", references.memo_docs).append(el("code", "memo"))} function in dd<el> allows you to
			cache and reuse DOM elements instead of recreating them on every render, which can
			significantly improve performance for components that render frequently or contain heavy computations.
		`),

		el("p").append(T`
			The memo system is particularly useful for:
		`),
		el("ul").append(
			el("li", t`Lists that update frequently but where most items remain the same`),
			el("li", t`Components with expensive rendering operations`),
			el("li", t`Optimizing signal-driven UI updates`)
		),

		el(h3, t`Using memo with Signal Rendering`),
		el("p").append(T`
			The most common use case for memoization is within ${el("code", "S.el()")} when rendering lists with
			${el("code", "map()")}:
		`),
		el(code, { content: `
			S.el(todosSignal, todos =>
				el("ul").append(
					...todos.map(todo =>
						// Use a unique identifiers
						memo(todo.id, () =>
							el(TodoItem, todo)
			))))
		`, page_id }),

		el("p").append(T`
			The ${el("code", "memo")} function in this context:
		`),
		el("ol").append(
			el("li", t`Takes a unique key (todo.id) to identify this item`),
			el("li", t`Caches the element created by the generator function`),
			el("li", t`Returns the cached element on subsequent renders if the key remains the same`),
			el("li", t`Only calls the generator function when rendering an item with a new key`)
		),

		el(example, { src: fileURL("./components/examples/optimization/memo.js"), page_id }),

		el(h3, t`Creating Memoization Scopes`),
		el("p").append(T`
			The ${el("code", "memo()")} uses cache store defined via the ${el("code", "memo.scope")} function.
			That is actually what the ${el("code", "S.el")} is doing under the hood:
		`),
		el(code, { content: `
			import { memo } from "deka-dom-el";

			// Create a memoization scope
			const renderItem = memo.scope(function(item) {
				return el().append(
					el("h3", item.title),
					el("p", item.description),
					// Expensive rendering operations...
					memo(item, ()=> el("div", { className: "expensive-component" }))
				);
			});

			// Use the memoized function
			const items = [/* array of items */];
			const container = el("div").append(
				...items.map(item => renderItem(item))
			);
		`, page_id }),

		el("p").append(T`
			The scope function accepts options to customize its behavior:
		`),
		el(code, { content: `
			const renderList = memo.scope(function(list) {
				return list.map(item =>
					memo(item.id, () => el(ItemComponent, item))
				);
			}, {
				// Only keep the cache from the most recent render
				onlyLast: true,

				// Clear cache when signal is aborted
				signal: controller.signal
			});
		`, page_id }),
		el("p").append(T`
			You can use custom memo scope as function in (e. g. ${el("code", "S.el(signal, renderList)")}) and as
			(Abort) signal use ${el("code", "scope.signal")}.
		`),

		el("div", { className: "function-table" }).append(
			el("dl").append(
				el("dt", t`onlyLast Option`),
				el("dd").append(T`Only keeps the cache from the most recent function call,
					which is useful when the entire collection is replaced. ${el("strong", "This is default behavior of ")
					.append(el("code", "S.el"))}!`),

				el("dt", t`signal Option`),
				el("dd").append(T`An ${el("a", references.mdn_abort).append(el("code", "AbortSignal"))}
					that will clear the cache when aborted, helping with memory management`)
			)
		),

		el(h3, t`Additional Optimization Techniques`),

		el("h4", t`Minimizing Signal Updates`),
		el("p").append(T`
			Signals are efficient, but unnecessary updates can impact performance:
		`),
		el("ul").append(
			el("li", t`For frequently updating values (like scroll position), consider debouncing`),
			el("li", t`Keep signal computations small and focused`),
		),

		el("h4", t`Optimizing List Rendering`),
		el("p").append(T`
			Beyond memoization, consider these approaches for optimizing list rendering:
		`),
		el("ul").append(
			el("li", t`Virtualize long lists to only render visible items`),
			el("li", t`Use stable, unique keys for list items`),
			el("li", t`Batch updates to signals that drive large lists`),
			el("li", t`Consider using a memo scope for the entire list component`)
		),

		el("div", { className: "tip" }).append(
			el("p").append(T`
				Memoization works best when your keys are stable and unique. Use IDs or other persistent
				identifiers rather than array indices, which can change when items are reordered.
				`),
			el("p").append(T`
				Alternatively you can use any “jsonable” value as key, when the primitive values aren’t enough.
			`)
		),

		el("h4", t`Memory Management`),
		el("p").append(T`
			To prevent memory leaks and reduce memory consumption:
		`),
		el("ul").append(
			el("li", t`Clear memo caches when components are removed`),
			el("li", t`Use AbortSignals to manage memo lifetimes`),
			el("li", t`Call S.clear() on signals that are no longer needed`),
			el("li", t`Remove event listeners when elements are removed from the DOM`)
		),

		el("h4", t`Choosing the Right Optimization Approach`),
		el("p").append(T`
			While ${el("code", "memo")} is powerful, different scenarios call for different optimization techniques:
		`),
		el("div", { className: "function-table" }).append(
			el("dl").append(
				el("dt", t`memo`),
				el("dd").append(T`
					Best for list rendering where items rarely change or only their properties update.
					${el("code", "todos.map(todo => memo(todo.id, () => el(TodoItem, todo)))")}
					Use when you need to cache and reuse DOM elements to avoid recreating them on every render.
				`),

				el("dt", t`Signal computations`),
				el("dd").append(T`
					Ideal for derived values that depend on other signals and need to auto-update.
					${el("code", "const totalPrice = S(() => items.get().reduce((t, i) => t + i.price, 0))")}
					Use when calculated values need to stay in sync with changing source data.
				`),

				el("dt", t`Debouncing/Throttling`),
				el("dd").append(T`
					Essential for high-frequency events (scroll, resize) or rapidly changing input values.
					${el("code", "debounce(e => searchQuery.set(e.target.value), 300)")}
					Use to limit the rate at which expensive operations execute when triggered by fast events.
				`),

				el("dt", t`memo.scope`),
				el("dd").append(T`
					Useful for using memoization inside any function: ${el("code",
						"const renderList = memo.scope(items => items.map(...))")}. Use to create isolated memoization
					contexts that can be cleared or managed independently.
				`),

				el("dt", t`Stateful components`),
				el("dd").append(T`
					For complex UI components with internal state management.
					${el("code", "el(ComplexComponent, { initialState, onChange })")}
					Use when a component needs to encapsulate and manage its own state and lifecycle.
				`)
			)
		),

		el(h3, t`Known Issues and Limitations`),
		el("p").append(T`
			While memoization is a powerful optimization technique, there are some limitations and edge cases to be aware of:
		`),

		el("h4", t`Document Fragments and Memoization`),
		el("p").append(T`
			One important limitation to understand is how memoization interacts with
			${el("a", references.mdn_fragment).append("DocumentFragment")} objects.
			Functions like ${el("code", "S.el")} internally use DocumentFragment to efficiently handle multiple elements,
			but this can lead to unexpected behavior with memoization.
		`),
		el(code, { content: `
			// This pattern can lead to unexpected behavior
			const memoizedFragment = memo("key", () => {
				// Creates a DocumentFragment internally
				return S.el(itemsSignal, items => items.map(item => el("div", item)));
			});

			// After the fragment is appended to the DOM, it becomes empty
			container.append(memoizedFragment);

			// On subsequent renders, the cached fragment is empty!
			container.append(memoizedFragment); // Nothing gets appended
		`, page_id }),

		el("p").append(T`
			This happens because a DocumentFragment is emptied when it's appended to the DOM. When the fragment
			is cached by memo and reused, it's already empty.
		`),

		el("div", { className: "tip" }).append(
			el("h5", t`Solution: Memoize Individual Items`),
			el(code, { content: `
				// Correct approach: memoize the individual items, not the fragment
				S.el(itemsSignal, items => items.map(item =>
					memo(item.id, () => el("div", item))
				));

				// Or use a container element instead of relying on a fragment
				memo("key", () =>
					el("div", { className: "item-container" }).append(
						S.el(itemsSignal, items => items.map(item => el("div", item)))
					)
				);
			`, page_id })
		),

		el("p").append(T`
			Generally, you should either:
		`),
		el("ol").append(
			el("li", t`Memoize individual items within the collection, not the entire collection result`),
			el("li", t`Wrap the result in a container element instead of relying on fragment behavior`),
			el("li", t`Be aware that S.el() and similar functions that return multiple elements are using fragments internally`)
		),

		el("div", { className: "note" }).append(
			el("p").append(T`
				This limitation isn't specific to dd<el> but is related to how DocumentFragment works in the DOM.
				Once a fragment is appended to the DOM, its child nodes are moved from the fragment to the target element,
				leaving the original fragment empty.
			`)
		),

		el(h3, t`Performance Debugging`),
		el("p").append(T`
			To identify performance bottlenecks in your dd<el> applications:
		`),
		el("ol").append(
			el("li").append(T`Use ${el("a", references.mdn_perf).append("browser performance tools")} to profile
				rendering times`),
			el("li", t`Check for excessive signal updates using S.on() listeners with console.log`),
			el("li", t`Verify memo usage by inspecting cache hit rates`),
			el("li", t`Look for components that render more frequently than necessary`)
		),

		el("div", { className: "note" }).append(
			el("p").append(T`
				For more details on debugging, see the ${el("a", { href: "p07-debugging.html", textContent: "Debugging" })} page.
			`)
		),

		el(h3, t`Best Practices for Optimized Rendering`),
		el("ol").append(
			el("li").append(T`
				${el("strong", "Use memo for list items:")} Memoize items in lists, especially when they contain complex components.
			`),
			el("li").append(T`
				${el("strong", "Clean up with AbortSignals:")} Connect memo caches to component lifecycles using AbortSignals.
			`),
			el("li").append(T`
				${el("strong", "Profile before optimizing:")} Identify actual bottlenecks before adding optimization.
			`),
			el("li").append(T`
				${el("strong", "Use derived signals:")} Compute derived values efficiently with signal computations.
			`),
			el("li").append(T`
				${el("strong", "Avoid memoizing fragments:")} Memoize individual elements or use container elements
				instead of DocumentFragments.
			`)
		),

		el(mnemonic),
	);
}
