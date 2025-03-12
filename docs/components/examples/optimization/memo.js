// Example of how memoization improves performance with list rendering
import { el, on, memo } from "deka-dom-el";
import { S } from "deka-dom-el/signals";

// A utility to log element creation
function logCreation(name) {
	console.log(`Creating ${name} element`);
	return name;
}

// Create a signal with our items
const itemsSignal = S([
	{ id: 1, name: "Item 1" },
	{ id: 2, name: "Item 2" },
	{ id: 3, name: "Item 3" }
], {
		add() {
				const { length }= this.value;
				this.value.push({
						id: length + 1,
						name: `Item ${length + 1}`
				});
		},
		force(){},
});

// Without memoization - creates new elements on every render
function withoutMemo() {
	return el("div").append(
		el("h3", "Without Memoization (check console for element creation)"),
		el("p", "Elements are recreated on every render"),
		S.el(itemsSignal, items =>
			el("ul").append(
				...items.map(item =>
					el("li").append(
						el("span", logCreation(item.name))
					)
				)
			)
		),
	);
}

// With memoization - reuses elements when possible
function withMemo() {
	return el("div").append(
		el("h3", "With Memoization (check console for element creation)"),
		el("p", "Elements are reused when the key (item.id) stays the same"),
		S.el(itemsSignal, items =>
			el("ul").append(
				...items.map(item =>
					// Use item.id as a stable key for memoization
					memo(item.id, () =>
						el("li").append(
							el("span", logCreation(item.name))
						)
					)
				)
			)
		),
	);
}

// Using memo.scope for a custom memoized function
const renderMemoList = memo.scope(function(items) {
	return el("ul").append(
		...items.map(item =>
			memo(item.id, () =>
				el("li").append(
					el("span", logCreation(`Custom memo: ${item.name}`))
				)
			)
		)
	);
});

function withCustomMemo() {
	return el("div").append(
		el("h3", "With Custom Memo Function"),
		el("p", "Using memo.scope to create a memoized rendering function"),
		S.el(itemsSignal, items =>
			renderMemoList(items)
		),
		el("button", "Clear Cache",
			on("click", () => {
				renderMemoList.clear();
				S.action(itemsSignal, "force");
			}
			)
		)
	);
}

// Demo component showing the difference
export function MemoDemo() {
	return el("div", { style: "padding: 1em; border: 1px solid #ccc;" }).append(
		el("h2", "Memoization Demo"),
		el("p", "See in the console when elements are created."),
		el("p").append(`
			Notice that without memoization, elements are recreated on every render. With memoization,
			only new elements are created.
		`),
		el("button", "Add Item",
			on("click", () => S.action(itemsSignal, "add"))
		),

		el("div", { style: "display: flex; gap: 2em; margin-top: 1em;" }).append(
			withoutMemo(),
			withMemo(),
			withCustomMemo()
		)
	);
}

document.body.append(el(MemoDemo));
