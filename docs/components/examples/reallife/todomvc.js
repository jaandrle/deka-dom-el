import { dispatchEvent, el, memo, on, scope } from "deka-dom-el";
import { S } from "deka-dom-el/signals";

/**
 * Main TodoMVC application component
 *
 * Creates and manages the TodoMVC application with the following features:
 * - Todo items management (add, edit, delete)
 * - Filtering by status (all, active, completed)
 * - Client-side routing via URL hash
 * - Persistent storage with localStorage
 *
 * @returns {HTMLElement} The root TodoMVC application element
 */
function Todos(){
	const pageS = routerSignal(S);
	const todosS = todosSignal();
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

	// Setup hash change listener
	window.addEventListener("hashchange", () => {
		const hash = location.hash.replace("#", "") || "all";
		S.action(pageS, "set", /** @type {"all"|"active"|"completed"} */(hash));
	});

	/** @type {ddeElementAddon<HTMLInputElement>} */
	const onToggleAll = on("change", event => {
		const checked = /** @type {HTMLInputElement} */ (event.target).checked;
		const todos = todosS.get();
		todos.forEach(todo => {
			todo.completed = checked;
		});
		todosS.set([...todos]); // Trigger update
	});
	/** @type {ddeElementAddon<HTMLFormElement>} */
	const onSubmitNewTodo = on("submit", event => {
		event.preventDefault();
		const input = /** @type {HTMLInputElement} */(
			/** @type {HTMLFormElement} */(event.target).elements.namedItem("newTodo")
		);
		const title = input.value.trim();
		if (title) {
			S.action(todosS, "add", title);
			input.value = "";
		}
	});
	const onClearCompleted = on("click", () => S.action(todosS, "clearCompleted"));
	const onDelete = on("todo:delete", ev => S.action(todosS, "delete", ev.detail));
	const onEdit = on("todo:edit", ev => S.action(todosS, "edit", ev.detail));

	return el("section", { className: "todoapp" }).append(
		el("header", { className: "header" }).append(
			el("h1", "todos"),
			el("form", null, onSubmitNewTodo).append(
				el("input", {
					className: "new-todo",
					name: "newTodo",
					placeholder: "What needs to be done?",
					autocomplete: "off",
					autofocus: true
				})
			)
		),
		S.el(todosS, todos => todos.length
			? el("main", { className: "main" }).append(
				el("input", {
					id: "toggle-all",
					className: "toggle-all",
					type: "checkbox"
				}, onToggleAll),
				el("label", { htmlFor: "toggle-all", title: "Mark all as complete" }),
				el("ul", { className: "todo-list" }).append(
					S.el(filteredTodosS, filteredTodos => filteredTodos.map(todo =>
						memo(todo.id, ()=> el(TodoItem, todo, onDelete, onEdit)))
					)
				)
			)
			: el()
		),
		S.el(todosS, todos => memo(todos.length, length=> length
			? el("footer", { className: "footer" }).append(
				el("span", { className: "todo-count" }).append(
					S.el(S(() => todosS.get().filter(todo => !todo.completed).length),
						length=> el("strong").append(
							length + " ",
							length === 1 ? "item left" : "items left"
						)
					)
				),
				el("ul", { className: "filters" }).append(
					el("li").append(
						el("a", {
							textContent: "All",
							className: S(()=> pageS.get() === "all" ? "selected" : ""),
							href: "#"
						}),
					),
					el("li").append(
						el("a", {
							textContent: "Active",
							className: S(()=> pageS.get() === "active" ? "selected" : ""),
							href: "#active"
						}),
					),
					el("li").append(
						el("a", {
							textContent: "Completed",
							className: S(()=> pageS.get() === "completed" ? "selected" : ""),
							href: "#completed"
						}),
					)
				),
				S.el(S(() => todosS.get().some(todo => todo.completed)),
					hasTodosCompleted=> hasTodosCompleted
					? el("button", { textContent: "Clear completed", className: "clear-completed" }, onClearCompleted)
					: el()
				)
			)
			: el()
		))
	);
}

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
	const { host }= scope;
	const isEditing = S(false);
	const isCompleted = S(completed);

	/** @type {(id: string) => void} Dispatch function for deleting todo */
	const dispatchDelete= dispatchEvent("todo:delete", host);
	/** @type {(data: {id: string, [key: string]: any}) => void} Dispatch function for editing todo */
	const dispatchEdit = dispatchEvent("todo:edit", host);

	/** @type {ddeElementAddon<HTMLInputElement>} */
	const onToggleCompleted = on("change", (ev) => {
		const completed= /** @type {HTMLInputElement} */(ev.target).checked;
		isCompleted.set(completed);
		dispatchEdit({ id, completed });
	});
	/** @type {ddeElementAddon<HTMLButtonElement>} */
	const onDelete = on("click", () => dispatchDelete(id));
	/** @type {ddeElementAddon<HTMLLabelElement>} */
	const onStartEdit = on("dblclick", () => isEditing.set(true));
	/** @type {ddeElementAddon<HTMLInputElement>} */
	const onBlurEdit = on("blur", event => {
		const value = /** @type {HTMLInputElement} */(event.target).value.trim();
		if (value) {
			dispatchEdit({ id, title: value });
		} else {
			dispatchDelete(id);
		}
		isEditing.set(false);
	});
	/** @type {ddeElementAddon<HTMLFormElement>} */
	const onSubmitEdit = on("submit", event => {
		event.preventDefault();
		const input = /** @type {HTMLFormElement} */(event.target).elements.namedItem("edit");
		const value = /** @type {HTMLInputElement} */(input).value.trim();
		if (value) {
			dispatchEdit({ id, title: value });
		} else {
			dispatchDelete(id);
		}
		isEditing.set(false);
	});

	/**
	 * Event handler for keyboard events in edit mode
	 * @type {ddeElementAddon<HTMLInputElement>}
	 */
	const onKeyDown = on("keydown", event => {
		if (event.key !== "Escape") return;
		isEditing.set(false);
	});

	return el("li", { classList: { completed: isCompleted, editing: isEditing } }).append(
		el("div", { className: "view" }).append(
			el("input", {
				className: "toggle",
				type: "checkbox",
				checked: completed
			}, onToggleCompleted),
			el("label", { textContent: title }, onStartEdit),
			el("button", { className: "destroy" }, onDelete)
		),
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
	);
}

// Set up the document head
document.head.append(
	el("title", "TodoMVC: dd<el>"),
	el("meta", { name: "description", content: "A TodoMVC implementation using dd<el>." }),
	el("link", {
		rel: "stylesheet",
		href: "https://cdn.jsdelivr.net/npm/todomvc-common@1.0.5/base.css"
	}),
	el("link", {
		rel: "stylesheet",
		href: "https://cdn.jsdelivr.net/npm/todomvc-app-css@2.4.2/index.css"
	})
);

// Set up the document body
document.body.append(
	el(Todos),
	el("footer", { className: "info" }).append(
		el("p", "Double-click to edit a todo"),
		el("p").append(
			"Created with ",
			el("a", { textContent: "deka-dom-el", href: "https://github.com/jaandrle/deka-dom-el" })
		),
		el("p").append(
			"Part of ",
			el("a", { textContent: "TodoMVC", href: "http://todomvc.com" })
		)
	)
);

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

/**
 * Creates a signal for managing route state
 *
 * @param {typeof S} signal - The signal constructor
 */
function routerSignal(signal){
	const initial = location.hash.replace("#", "") || "all";
	return signal(initial, {
		/**
		 * Set the current route
		 * @param {"all"|"active"|"completed"} hash - The route to set
		 */
		set(hash){
			location.hash = hash;
			this.value = hash;
		}
	});
}

/**
 * Generates a RFC4122 version 4 compliant UUID
 * Used to create unique identifiers for todo items
 *
 * @returns {string} A randomly generated UUID
 */
function uuid() {
	let uuid = "";
	for (let i = 0; i < 32; i++) {
		let random = (Math.random() * 16) | 0;

		if (i === 8 || i === 12 || i === 16 || i === 20)
			uuid += "-";

		uuid += (i === 12 ? 4 : i === 16 ? (random & 3) | 8 : random).toString(16);
	}
	return uuid;
}
