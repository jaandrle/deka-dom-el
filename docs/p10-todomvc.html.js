import { T, t } from "./utils/index.js";
export const info= {
	title: t`TodoMVC Implementation`,
	fullTitle: t`TodoMVC with dd<el>`,
	description: t`A complete TodoMVC implementation using dd<el> and signals, demonstrating real-world application
	development.`,
};

import { el } from "deka-dom-el";
import { simplePage } from "./layout/simplePage.html.js";
import { example } from "./components/example.html.js";
import { h3 } from "./components/pageUtils.html.js";
import { code } from "./components/code.html.js";
/** @param {string} url */
const fileURL= url=> new URL(url, import.meta.url);
const references= {
	/** TodoMVC */
	todomvc: {
		title: t`TodoMVC Project`,
		href: "https://todomvc.com/",
	},
	/** Demo source */
	github_example: {
		title: t`Full TodoMVC source code on GitHub`,
		href: "https://github.com/jaandrle/deka-dom-el/blob/main/docs/components/examples/reallife/todomvc.js",
	},
	/** localStorage */
	mdn_storage: {
		title: t`MDN documentation for Web Storage API`,
		href: "https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API",
	},
	/** Custom Events */
	mdn_events: {
		title: t`MDN documentation for Custom Events`,
		href: "https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent"
	},
	/** requestAnimationFrame */
	mdn_raf: {
		title: t`MDN documentation for requestAnimationFrame`,
		href: "https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame"
	}
};

/** @param {import("./types.d.ts").PageAttrs} attrs */
export function page({ pkg, info }){
	const page_id= info.id;
	return el(simplePage, { info, pkg }).append(
		el("p").append(T`
			${el("a", references.todomvc).append("TodoMVC")} is a project that helps developers compare different
			frameworks by implementing the same todo application. This implementation showcases how dd<el>
			can be used to build a complete, real-world application with all the expected features of a modern
			web app.
		`),
		el("div", { className: "callout" }).append(
			el("h4", t`TodoMVC with dd<el>: Key Features`),
			el("ul").append(
				el("li", t`Reactive UI with signals for state management`),
				el("li", t`Component-based architecture with composable functions`),
				el("li", t`Event handling with the 'on' and 'dispatchEvent' utilities`),
				el("li", t`Performance optimization with memoization`),
				el("li", t`Persistent storage with localStorage`),
				el("li", t`Client-side routing with URL hash-based filtering`),
				el("li", t`Component scopes for proper encapsulation`)
			)
		),
		el("p").append(T`
			Below is a fully working TodoMVC implementation. You can interact with it directly in this
			documentation page. The example demonstrates how dd<el> handles common app development
			challenges in a clean, maintainable way.
		`),

		el(example, { src: fileURL("./components/examples/reallife/todomvc.js"), variant: "big", page_id }),

		el(h3, t`Application Architecture Overview`),
		el("p").append(T`
			The TodoMVC implementation is structured around several key components:
		`),
		el("div", { className: "function-table" }).append(
			el("dl").append(
				el("dt", t`Main Todos Component`),
				el("dd", t`The core component that orchestrates the entire application, handling routing, state, and
					rendering the UI`),

				el("dt", t`TodoItem Component`),
				el("dd", t`A reusable component for rendering individual todo items with editing capabilities`),

				el("dt", t`Signal-based State`),
				el("dd", t`Custom signals for managing todos and routing state with reactive updates`),

				el("dt", t`Performance Optimization`),
				el("dd", t`Memoization of components and reactive elements to minimize DOM updates`),

				el("dt", t`Custom Events`),
				el("dd", t`Communication between components using custom events for cleaner architecture`)
			)
		),

		el(h3, t`Reactive State Management with Signals`),
		el("p").append(T`
			The application uses three primary signals to manage state:
		`),
		el(code, { content: `
			// Signal for current route (all/active/completed)
			const pageS = routerSignal(S);

			// Signal for the todos collection with custom actions
			const todosS = todosSignal();

			// Derived signal that filters todos based on current route
			const filteredTodosS = S(()=> {
				const todos = todosS.get();
				const filter = pageS.get();
				return todos.filter(todo => {
					if (filter === "active") return !todo.completed;
					if (filter === "completed") return todo.completed;
					return true; // "all"
				});
			});
		`, page_id }),

		el("p").append(T`
			The ${el("code", "todosSignal")} function creates a custom signal with actions for manipulating the todos:
		`),
		el(code, { content: `
			/**
			 * Creates a signal for managing todos with persistence
			 *
			 * Features:
			 * - Loads todos from localStorage on initialization
			 * - Automatically saves todos to localStorage on changes
			 * - Provides actions for adding, editing, deleting todos
			 */
			function todosSignal(){
				const store_key = "dde-todos";
				// Try to load todos from localStorage
				let savedTodos = [];
				try {
					const stored = localStorage.getItem(store_key);
					if (stored) {
						savedTodos = JSON.parse(stored);
					}
				} catch (_) {}

				const out= S(/** @type {Todo[]} */(savedTodos || []), {
					/**
					 * Add a new todo
					 * @param {string} value - The title of the new todo
					 */
					add(value){
						this.value.push({
							completed: false,
							title: value,
							id: uuid(),
						});
					},
					/**
					 * Edit an existing todo
					 * @param {{ id: string, [key: string]: any }} data - Object containing id and fields to update
					 */
					edit({ id, ...update }){
						const index = this.value.findIndex(t => t.id === id);
						if (index === -1) return this.stopPropagation();
						Object.assign(this.value[index], update);
					},
					/**
					 * Delete a todo by id
					 * @param {string} id - The id of the todo to delete
					 */
					delete(id){
						const index = this.value.findIndex(t => t.id === id);
						if (index === -1) return this.stopPropagation();
						this.value.splice(index, 1);
					},
					/**
					 * Remove all completed todos
					 */
					clearCompleted() {
						this.value = this.value.filter(todo => !todo.completed);
					},
					/**
					 * Mark all todos as completed or active
					 * @param {boolean} state - Whether to mark todos as completed or active
					 */
					completeAll(state = true) {
						this.value.forEach(todo => todo.completed = state);
					},
					/**
					 * Handle cleanup when signal is cleared
					 */
					[S.symbols.onclear](){
					}
				});

				/**
				 * Save todos to localStorage whenever the signal changes
				 * @param {Todo[]} value - Current todos array
				 */
				S.on(out, /** @param {Todo[]} value */ function saveTodos(value) {
					try {
						localStorage.setItem(store_key, JSON.stringify(value));
					} catch (e) {
						console.error("Failed to save todos to localStorage", e);
					}
				});
				return out;
			}
		`, page_id }),

		el("div", { className: "note" }).append(
			el("p").append(T`
				Using ${el("a", references.mdn_storage).append("localStorage")} allows the application to persist todos
				even when the page is refreshed. The ${el("code", "S.on")} listener ensures todos are saved
				after every state change, providing automatic persistence without explicit calls.
			`)
		),

		el(h3, t`Integration of Signals and Reactive UI`),
		el("p").append(T`
			The implementation demonstrates a clean integration between signal state and reactive UI:
		`),

		el("h4", t`1. Derived Signals for Filtering`),
		el(code, { content: `
			/** Derived signal that filters todos based on current route */
			const filteredTodosS = S(()=> {
				const todos = todosS.get();
				const filter = pageS.get();
				return todos.filter(todo => {
					if (filter === "active") return !todo.completed;
					if (filter === "completed") return todo.completed;
					return true; // "all"
				});
			});

			// Using the derived signal in the UI
			el("ul", { className: "todo-list" }).append(
				S.el(filteredTodosS, filteredTodos => filteredTodos.map(todo =>
					memo(todo.id, ()=> el(TodoItem, todo, onDelete, onEdit)))
				)
			)
		`, page_id }),

		el("p").append(T`
			The derived signal automatically recalculates whenever either the todos list or the current filter changes,
			ensuring the UI always shows the correct filtered todos.
		`),
		
		el("h4", t`2. Toggle All Functionality`),
		el(code, { content: `
			/** @type {ddeElementAddon<HTMLInputElement>} */
			const onToggleAll = on("change", event => {
				const checked = /** @type {HTMLInputElement} */ (event.target).checked;
				S.action(todosS, "completeAll", checked);
			});
			
			// Using the toggle-all functionality in the UI
			el("input", {
				id: "toggle-all",
				className: "toggle-all",
				type: "checkbox"
			}, onToggleAll),
			el("label", { htmlFor: "toggle-all", title: "Mark all as complete" }),
		`, page_id }),
		
		el("p").append(T`
			The "toggle all" checkbox allows users to mark all todos as completed or active. When the checkbox 
			is toggled, it calls the ${el("code", "completeAll")} action on the todos signal, passing the current
			checked state. This is a good example of how signals and actions can be used to manage application
			state in a clean, declarative way.
		`),

		el("h4", t`3. Local Component State`),
		el(code, { content: `
			function TodoItem({ id, title, completed }) {
				const { host }= scope;
				// Local UI state signals
				const isEditing = S(false);
				const isCompleted = S(completed);

				/** @type {(id: string) => void} Dispatch function for deleting todo */
				const dispatchDelete= dispatchEvent("todo:delete", host);
				/** @type {(data: {id: string, [key: string]: any}) => void} Dispatch function for editing todo */
				const dispatchEdit = dispatchEvent("todo:edit", host);

				// Event handlers that update local state
				/** @type {ddeElementAddon<HTMLInputElement>} */
				const onToggleCompleted = on("change", (ev) => {
					const completed= /** @type {HTMLInputElement} */(ev.target).checked;
					isCompleted.set(completed);
					dispatchEdit({ id, completed });
				});

				// UI that responds to local state
				return el("li", {
					classList: { completed: isCompleted, editing: isEditing }
				}).append(
					// Component content...
				);
			}
		`, page_id }),

		el("p").append(T`
			The TodoItem component maintains its own local UI state with signals, providing immediate
			UI feedback while still communicating changes to the parent via events.
		`),

		el("h4", t`4. Reactive Properties`),
		el(code, { content: `
			// Dynamic class attributes
			el("a", {
				textContent: "All",
				className: S(()=> pageS.get() === "all" ? "selected" : ""),
				href: "#"
			})

			// Reactive classList
			el("li", {
				classList: { completed: isCompleted, editing: isEditing }
			})
		`, page_id }),

		el("div", { className: "tip" }).append(
			el("p").append(T`
				Binding signals directly to element properties creates a reactive UI that automatically updates
				when state changes, without the need for explicit DOM manipulation or virtual DOM diffing.
			`)
		),

		el(h3, t`Performance Optimization with Memoization`),
		el("p").append(T`
			The implementation uses ${el("code", "memo")} to optimize performance in several key areas:
		`),

		el("h4", t`Memoizing Todo Items`),
		el(code, { content: `
			el("ul", { className: "todo-list" }).append(
				S.el(filteredTodosS, filteredTodos => filteredTodos.map(todo =>
					memo(todo.id, ()=> el(TodoItem, todo, onDelete, onEdit)))
				)
			)
		`, page_id }),

		el("p").append(T`
			This approach ensures that:
		`),
		el("ul").append(
			el("li", t`Todo items are only re-rendered when their data changes`),
			el("li", t`The same DOM elements are reused, even as todos are filtered`),
			el("li", t`Each todo is memoized independently using its unique ID`),
			el("li", t`The UI remains responsive even with a large number of todos`)
		),

		el("h4", t`Memoizing UI Sections`),
		el(code, { content: `
			S.el(todosS, todos => memo(todos.length, length=> length
				? el("footer", { className: "footer" }).append(
					// Footer content...
				)
				: el()
			))
		`, page_id }),

		el("p").append(T`
			By memoizing based on the todos length, the entire footer component is only re-rendered
			when todos are added or removed, not when their properties change. This improves performance
			by avoiding unnecessary DOM operations.
		`),

		el("div", { className: "tip" }).append(
			el("p").append(T`
				Memoization is especially important for UI elements that are expensive to render or that contain
				many child elements. The ${el("code", "memo")} function allows precise control over when components
				should re-render, avoiding the overhead of virtual DOM diffing algorithms.
			`)
		),

		el(h3, t`Component-Based Architecture with Events`),
		el("p").append(T`
			The TodoMVC implementation demonstrates a clean component architecture with custom events
			for communication between components:
		`),

		el("h4", t`1. Main Component Event Handling`),
		el("p").append(T`
			The main Todos component sets up event listeners to handle actions from child components:
		`),
		el(code, { content: `
			// Event handlers in the main component
			const onDelete = on("todo:delete", ev => S.action(todosS, "delete", ev.detail));
			const onEdit = on("todo:edit", ev => S.action(todosS, "edit", ev.detail));
		`, page_id }),

		el("h4", t`2. The TodoItem Component with Scopes and Local State`),
		el("p").append(T`
			Each todo item is rendered by the TodoItem component that uses scopes, local signals, and custom events:
		`),
		el(code, { content: `
			/**
			 * Component for rendering an individual todo item
			 *
			 * Features:
			 * - Display todo with completed state
			 * - Toggle completion status
			 * - Delete todo
			 * - Edit todo with double-click
			 * - Cancel edit with Escape key
			 *
			 * @param {Todo} todo - The todo item data
			 * @fires {void} todo:delete - todo deletion event
			 * @fires {Partial<Todo>} todo:edit - todo edits event
			 */
			function TodoItem({ id, title, completed }) {
				const { host }= scope;
				const isEditing = S(false);
				const isCompleted = S(completed);

				/** @type {(id: string) => void} Dispatch function for deleting todo */
				const dispatchDelete= dispatchEvent("todo:delete", host);
				/** @type {(data: {id: string, [key: string]: any}) => void} Dispatch function for editing todo */
				const dispatchEdit = dispatchEvent("todo:edit", host);

				// Event handlers that dispatch to parent
				/** @type {ddeElementAddon<HTMLInputElement>} */
				const onToggleCompleted = on("change", (ev) => {
					const completed= /** @type {HTMLInputElement} */(ev.target).checked;
					isCompleted.set(completed);
					dispatchEdit({ id, completed });
				});
				/** @type {ddeElementAddon<HTMLButtonElement>} */
				const onDelete = on("click", () => dispatchDelete(id));

				// Component implementation...
			}
		`, page_id }),

		el("div", { className: "tip" }).append(
			el("p").append(T`
				Using ${el("code", "scope")} and ${el("a", references.mdn_events).append("custom events")}
				creates a clean separation of concerns. Each TodoItem component dispatches events up to the parent
				without directly manipulating the application state, following a unidirectional data flow pattern.
			`)
		),

		el(h3, t`Improved DOM Updates with classList`),
		el("p").append(T`
			The implementation uses the reactive ${el("code", "classList")} property for efficient class updates:
		`),
		el(code, { content: `
			// Using classList with signals
			return el("li", {
				classList: { completed: isCompleted, editing: isEditing }
			}).append(
				// Component content...
			);
		`, page_id }),

		el("p").append(T`
			Benefits of using ${el("code", "classList")}:
		`),
		el("ul").append(
			el("li", t`More declarative code that clearly shows which classes are conditional`),
			el("li", t`Direct binding to signal values for automatic updates`),
			el("li", t`Fewer string manipulations and array operations`),
			el("li", t`Optimized DOM updates that only change the specific classes that need to change`)
		),

		el(h3, t`Improved Focus Management`),
		el("p").append(T`
			The implementation uses a dedicated function for managing focus in edit inputs:
		`),
		el(code, { content: `
			/**
			 * Utility function to set focus on an input element
			 * Uses requestAnimationFrame to ensure the element is rendered
			 * before trying to focus it
			 *
			 * @param {HTMLInputElement} editInput - The input element to focus
			 * @returns {number} The requestAnimationFrame ID
			 */
			function addFocus(editInput){
				return requestAnimationFrame(()=> {
					editInput.focus();
					editInput.selectionStart = editInput.selectionEnd = editInput.value.length;
				});
			}

			// Used as an addon to the edit input
			el("input", {
				className: "edit",
				name: "edit",
				value: title,
				"data-id": id
			}, onBlurEdit, onKeyDown, addFocus)
		`, page_id }),

		el("p").append(T`
			This approach offers several advantages:
		`),
		el("ul").append(
			el("li", t`Uses requestAnimationFrame for reliable focus timing after DOM updates`),
			el("li", t`Encapsulates focus logic in a reusable function`),
			el("li", t`Attaches directly to the element as an addon function`),
			el("li", t`Automatically positions the cursor at the end of the input`)
		),

		el("div", { className: "note" }).append(
			el("p").append(T`
				Using ${el("a", references.mdn_raf).append("requestAnimationFrame")} ensures that the focus operation
				happens after the browser has finished rendering the DOM changes, which is more reliable than
				using setTimeout.
			`)
		),

		el(h3, t`Efficient Conditional Rendering`),
		el("p").append(T`
			The implementation uses signals for efficient conditional rendering:
		`),

		el("h4", t`Conditional Todo List`),
		el(code, { content: `
			S.el(todosS, todos => todos.length
				? el("main", { className: "main" }).append(
					// Main content with toggle all and todo list
				)
				: el()
			)
		`, page_id }),

		el("h4", t`Conditional Edit Form`),
		el(code, { content: `
			S.el(isEditing, editing => editing
				? el("form", null, onSubmitEdit).append(
					el("input", {
						className: "edit",
						name: "edit",
						value: title,
						"data-id": id
					}, onBlurEdit, onKeyDown, addFocus)
				)
				: el()
			)
		`, page_id }),

		el("h4", t`Conditional Clear Completed Button`),
		el(code, { content: `
			S.el(S(() => todosS.get().some(todo => todo.completed)),
				hasTodosCompleted=> hasTodosCompleted
				? el("button", { textContent: "Clear completed", className: "clear-completed" }, onClearCompleted)
				: el()
			)
		`, page_id }),

		el("div", { className: "note" }).append(
			el("p").append(T`
				Unlike frameworks that use a virtual DOM, dd<el> directly updates only the specific DOM elements
				that need to change. This approach is often more efficient for small to medium-sized applications,
				especially when combined with strategic memoization.
			`)
		),

		el(h3, t`Type Safety with JSDoc Comments`),
		el("p").append(T`
			The implementation uses comprehensive JSDoc comments to provide type safety without requiring TypeScript:
		`),
		el(code, { content: `
			/**
			 * Todo item data structure
			 * @typedef {{ title: string, id: string, completed: boolean }} Todo
			 */

			/**
			 * Component for rendering an individual todo item
			 *
			 * Features:
			 * - Display todo with completed state
			 * - Toggle completion status
			 * - Delete todo
			 * - Edit todo with double-click
			 * - Cancel edit with Escape key
			 *
			 * @param {Todo} todo - The todo item data
			 * @fires {void} todo:delete - todo deletion event
			 * @fires {Partial<Todo>} todo:edit - todo edits event
			 */
			function TodoItem({ id, title, completed }) {
				// Implementation...
			}

			/**
			 * Event handler for keyboard events in edit mode
			 * @type {ddeElementAddon<HTMLInputElement>}
			 */
			const onKeyDown = on("keydown", event => {
				if (event.key !== "Escape") return;
				isEditing.set(false);
			});
		`, page_id }),

		el("div", { className: "tip" }).append(
			el("p").append(T`
				Using JSDoc comments provides many of the benefits of TypeScript (autocomplete, type checking,
				documentation) while maintaining pure JavaScript code. This approach works well with modern
				IDEs that support JSDoc type inference.
			`)
		),

		el(h3, t`Best Practices Demonstrated`),
		el("ol").append(
			el("li").append(T`
				${el("strong", "Component Composition:")} Breaking the UI into focused, reusable components
			`),
			el("li").append(T`
				${el("strong", "Performance Optimization:")} Strategic memoization to minimize DOM operations
			`),
			el("li").append(T`
				${el("strong", "Reactive State Management:")} Using signals with derived computations
			`),
			el("li").append(T`
				${el("strong", "Event-Based Communication:")} Using custom events for component communication
			`),
			el("li").append(T`
				${el("strong", "Local Component State:")} Maintaining UI state within components for better encapsulation
			`),
			el("li").append(T`
				${el("strong", "Declarative Class Management:")} Using the classList property for cleaner class handling
			`),
			el("li").append(T`
				${el("strong", "Focus Management:")} Reliable input focus with requestAnimationFrame
			`),
			el("li").append(T`
				${el("strong", "Persistent Storage:")} Automatically saving application state with signal listeners
			`),
			el("li").append(T`
				${el("strong", "Type Safety:")} Using comprehensive JSDoc comments for type checking and documentation
			`),
			el("li").append(T`
				${el("strong", "Composable Event Handlers:")} Attaching multiple event handlers to elements
			`)
		),

		el("div", { className: "callout" }).append(
			el("h4", t`Key Takeaways`),
			el("p").append(T`
				This TodoMVC implementation showcases the strengths of dd<el> for building real-world applications:
			`),
			el("ul").append(
				el("li", t`Clean composition of components with clear responsibilities`),
				el("li", t`Precise, targeted DOM updates without virtual DOM overhead`),
				el("li", t`Strategic memoization for optimal performance`),
				el("li", t`Reactive data flow with signals and derived computations`),
				el("li", t`Local component state for better encapsulation`),
				el("li", t`Lightweight event system for component communication`)
			)
		),

		el("p").append(T`
			You can find the ${el("a", references.github_example).append("complete source code")} for this example on GitHub.
			Feel free to use it as a reference for your own projects or as a starting point for more complex applications.
		`),
	);
}
