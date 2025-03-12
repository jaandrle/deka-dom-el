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

/** @param {import("./types.d.ts").PageAttrs} attrs */
export function page({ pkg, info }){
	const page_id= info.id;
	return el(simplePage, { info, pkg }).append(
		el("p").append(...T`
			As your applications grow, performance becomes increasingly important. dd<el> provides several
			techniques to optimize rendering performance, especially when dealing with large lists or frequently
			updating components. This guide focuses on memoization and other optimization strategies.
		`),
		el(code, { src: fileURL("./components/examples/optimization/intro.js"), page_id }),

		el(h3, t`Memoization with memo`),
		el("p").append(...T`
			dd<el> includes a powerful memoization system through the ${el("code", "memo")} function. Memoization
			allows you to cache and reuse DOM elements instead of recreating them on every render, which can
			significantly improve performance for components that render frequently.
		`),

		el("p").append(...T`
			The memo system is particularly useful for:
		`),
		el("ul").append(
			el("li", t`Lists that update frequently but where most items remain the same`),
			el("li", t`Components with expensive rendering operations`),
			el("li", t`Optimizing signal-driven UI updates`)
		),

		el("h4", t`Basic usage with S.el`),
		el("p").append(...T`
			The most common use case for memoization is within ${el("code", "S.el()")} when rendering lists:
		`),
		el(code, { content: `
			S.el(todosSignal, todos =>
				el("ul").append(
					...todos.map(todo =>
						// Use a unique ID as the key
						memo(todo.id, () =>
							el(TodoItem, todo)
						)
					)
				)
			)
		`, page_id }),

		el("p").append(...T`
			The ${el("code", "memo")} function in this context:
		`),
		el("ol").append(
			el("li", t`Takes a unique key (todo.id) to identify this item`),
			el("li", t`Caches the element created by the generator function`),
			el("li", t`Returns the cached element on subsequent renders if the key remains the same`),
			el("li", t`Only calls the generator function when rendering an item with a new key`)
		),

		el(example, { src: fileURL("./components/examples/optimization/memo.js"), page_id }),

		el("h4", t`Direct memo function usage`),
		el("p").append(...T`
			The ${el("code", "memo")} function can also be used directly, outside of ${el("code", "S.el")}:
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

		el("h4", t`Advanced memo options`),
		el("p").append(...T`
			The ${el("code", "memo.scope")} function accepts options to customize its behavior:
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

		el("p").append(...T`
			Key options include:
		`),
		el("ul").append(
			el("li").append(...T`
				${el("code", "onlyLast: true")} - Only keeps the cache from the most recent function call,
				which is useful when the entire collection is replaced. ${el("strong", "This is default behavior of ")
				.append(el("code", "S.el"))}!
			`),
			el("li").append(...T`
				${el("code", "signal")} - An AbortSignal that will clear the cache when aborted, helping with memory management
			`)
		),

		el(h3, t`Other optimization techniques`),

		el("h4", t`Minimizing signal updates`),
		el("p").append(...T`
			Signals are efficient, but unnecessary updates can impact performance:
		`),
		el("ul").append(
			el("li", t`Avoid setting signal values that haven’t actually changed`),
			el("li", t`For frequently updating values (like scroll position), consider debouncing`),
			el("li", t`Keep signal computations small and focused`),
			el("li", t`Use derived signals to compute values only when dependencies change`)
		),

		el("h4", t`Optimizing list rendering`),
		el("p").append(...T`
			Beyond memoization, consider these approaches for optimizing list rendering:
		`),
		el("ul").append(
			el("li", t`Virtualize long lists to only render visible items`),
			el("li", t`Use stable, unique keys for list items`),
			el("li", t`Batch updates to signals that drive large lists`),
			el("li", t`Consider using a memo scope for the entire list component`)
		),

		el("h4", t`Reducing memory usage`),
		el("p").append(...T`
			To prevent memory leaks and reduce memory consumption:
		`),
		el("ul").append(
			el("li", t`Clear memo caches when components are removed`),
			el("li", t`Use AbortSignals to manage memo lifetimes`),
			el("li", t`Call S.clear() on signals that are no longer needed`),
			el("li", t`Remove event listeners when elements are removed from the DOM`)
		),

		el("h4", t`When to use memo vs. other approaches`),
		el("p").append(...T`
			While memo is powerful, it’s not always the best solution:
		`),
		el("table").append(
			el("thead").append(
				el("tr").append(
					el("th", "Approach"),
					el("th", "When to use")
				)
			),
			el("tbody").append(
				el("tr").append(
					el("td", "memo"),
					el("td", "Lists with stable items that infrequently change position")
				),
				el("tr").append(
					el("td", "Signal computations"),
					el("td", "Derived values that depend on other signals")
				),
				el("tr").append(
					el("td", "Debouncing"),
					el("td", "High-frequency events like scroll or resize")
				),
				el("tr").append(
					el("td", "Stateful components"),
					el("td", "Complex components with internal state")
				)
			)
		),

		el(h3, t`Performance debugging`),
		el("p").append(...T`
			To identify performance bottlenecks in your dd<el> applications:
		`),
		el("ol").append(
			el("li", t`Use browser performance tools to profile rendering times`),
			el("li", t`Check for excessive signal updates using S.on() listeners with console.log`),
			el("li", t`Verify memo usage by inspecting cache hit rates`),
			el("li", t`Look for components that render more frequently than necessary`)
		),

		el("p").append(...T`
			For more details on debugging, see the ${el("a", { href: "p07-debugging.html", textContent: "Debugging" })} page.
		`),

		el(mnemonic),
	);
}
