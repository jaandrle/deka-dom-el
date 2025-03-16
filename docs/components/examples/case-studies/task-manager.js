/**
 * Case Study: Task Manager Application
 *
 * This example demonstrates:
 * - Complex state management with signals
 * - Drag and drop functionality
 * - Local storage persistence
 * - Responsive design for different devices
 */

import { el, on, dispatchEvent, scope } from "deka-dom-el";
import { S } from "deka-dom-el/signals";

/** @typedef {{ id: number, title: string, description: string, priority: string, status: string }} Task */
/**
 * Task Manager Component
 * @returns {HTMLElement} Task manager UI
 */
export function TaskManager() {
	// <Tasks store>
	const STORAGE_KEY = 'dde-task-manager';
	const STATUSES = {
		TODO: 'todo',
		IN_PROGRESS: 'in-progress',
		DONE: 'done'
	};
	/** @type {Task[]} */
	let initialTasks = [];
	try {
		const saved = localStorage.getItem(STORAGE_KEY);
		if (saved) {
			initialTasks = JSON.parse(saved);
		}
	} catch (e) {
		console.error('Failed to load tasks from localStorage', e);
	}
	if (!initialTasks.length) {
		initialTasks = [
			{ id: 1, title: 'Create project structure', description: 'Set up folders and initial files',
				status: STATUSES.DONE, priority: 'high' },
			{ id: 2, title: 'Design UI components', description: 'Create mockups for main views',
				status: STATUSES.IN_PROGRESS, priority: 'medium' },
			{ id: 3, title: 'Implement authentication', description: 'Set up user login and registration',
				status: STATUSES.TODO, priority: 'high' },
			{ id: 4, title: 'Write documentation', description: 'Document API endpoints and usage examples',
				status: STATUSES.TODO, priority: 'low' },
		];
	}
	const tasks = S(initialTasks, {
		add(task) { this.value.push(task); },
		remove(id) { this.value = this.value.filter(task => task.id !== id); },
		update(id, task) {
			const current= this.value.find(t => t.id === id);
			if (current) Object.assign(current, task);
		}
	});
	S.on(tasks, value => {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
		} catch (e) {
			console.error('Failed to save tasks to localStorage', e);
		}
	});
	// </Tasks store>

	const filterPriority = S('all');
	const searchQuery = S('');
	// Filtered tasks based on priority and search query
	const filteredTasks = S(() => {
		let filtered = tasks.get();

		// Filter by priority
		if (filterPriority.get() !== 'all') {
			filtered = filtered.filter(task => task.priority === filterPriority.get());
		}

		// Filter by search query
		const query = searchQuery.get().toLowerCase();
		if (query) {
			filtered = filtered.filter(task =>
				task.title.toLowerCase().includes(query) ||
				task.description.toLowerCase().includes(query)
			);
		}

		return filtered;
	});
	/** Tasks grouped by status for display in columns */
	const tasksByStatus = S(() => {
		const filtered = filteredTasks.get();
		return {
			[STATUSES.TODO]: filtered.filter(t => t.status === STATUSES.TODO),
			[STATUSES.IN_PROGRESS]: filtered.filter(t => t.status === STATUSES.IN_PROGRESS),
			[STATUSES.DONE]: filtered.filter(t => t.status === STATUSES.DONE)
		};
	});

	// <Add> signals and handlers for adding new tasks
	const newTask = { title: '', description: '', priority: 'medium' };
	const onAddTask = e => {
		e.preventDefault();
		if (!newTask.title) return;

		S.action(tasks, "add", {
			id: Date.now(),
			status: STATUSES.TODO,
			...newTask
		});
		e.target.reset();
	};
	// </Add>
	const onCardEdit= on("card:edit", /** @param {CardEditEvent} ev */({ detail: [ id, task ] })=>
		S.action(tasks, "update", id, task));
	const onCardDelete= on("card:delete", /** @param {CardDeleteEvent} ev */({ detail: id })=>
		S.action(tasks, "remove", id));

	const { onDragable, onDragArea }= moveElementAddon(
		(id, status) => S.action(tasks, "update", id, { status })
	);

	// Build the task manager UI
	return el("div", { className: "task-manager" }).append(
		el("header", { className: "app-header" }).append(
			el("h1", "DDE Task Manager"),
			el("div", { className: "app-controls" }).append(
				el("input", {
					type: "text",
					placeholder: "Search tasks...",
					value: searchQuery.get()
				}, on("input", e => searchQuery.set(e.target.value))),
				el("select", null,
					on.defer(el=> el.value= filterPriority.get()),
					on("change", e => filterPriority.set(e.target.value))
				).append(
					el("option", { value: "all", textContent: "All Priorities" }),
					el("option", { value: "low", textContent: "Low Priority" }),
					el("option", { value: "medium", textContent: "Medium Priority" }),
					el("option", { value: "high", textContent: "High Priority" })
				)
			)
		),

		// Add new task form
		el("form", { className: "new-task-form" }, on("submit", onAddTask)).append(
			el("div", { className: "form-row" }).append(
				el("input", {
					type: "text",
					placeholder: "New task title",
					value: newTask.title,
					required: true
				}, on("input", e => newTask.title= e.target.value.trim())),
				el("select", null,
					on.defer(el=> el.value= newTask.priority),
					on("change", e => newTask.priority= e.target.value)
				).append(
					el("option", { value: "low", textContent: "Low" }),
					el("option", { value: "medium", textContent: "Medium" }),
					el("option", { value: "high", textContent: "High" })
				),
				el("button", { type: "submit", className: "add-btn" }).append("Add Task")
			),
			el("textarea", {
				placeholder: "Task description (optional)",
				value: newTask.description
			}, on("input", e => newTask.description= e.target.value.trim()))
		),

		// Task board with columns
		el("div", { className: "task-board" }).append(
			// Todo column
			el("div", {
				id: `column-${STATUSES.TODO}`,
				className: "task-column"
			}, onDragArea(STATUSES.TODO)).append(
				el("h2", { className: "column-header" }).append(
					"To Do ",
					el("span", {
						textContent: S(() => tasksByStatus.get()[STATUSES.TODO].length),
						className: "task-count"
					}),
				),
				S.el(S(() => tasksByStatus.get()[STATUSES.TODO]), tasks =>
					el("div", { className: "column-tasks" }).append(
						...tasks.map(task=> el(TaskCard, { task, onDragable }, onCardEdit, onCardDelete))
					)
				)
			),

			// In Progress column
			el("div", {
				id: `column-${STATUSES.IN_PROGRESS}`,
				className: "task-column"
			}, onDragArea(STATUSES.IN_PROGRESS)).append(
				el("h2", { className: "column-header" }).append(
					"In Progress ",
					el("span", {
						textContent: S(() => tasksByStatus.get()[STATUSES.IN_PROGRESS].length),
						className: "task-count",
					}),
				),
				S.el(S(() => tasksByStatus.get()[STATUSES.IN_PROGRESS]), tasks =>
					el("div", { className: "column-tasks" }).append(
						...tasks.map(task=> el(TaskCard, { task, onDragable }, onCardEdit, onCardDelete))
					)
				)
			),

			// Done column
			el("div", {
				id: `column-${STATUSES.DONE}`,
				className: "task-column"
			}, onDragArea(STATUSES.DONE)).append(
				el("h2", { className: "column-header" }).append(
					"Done ",
					el("span", {
						textContent: S(() => tasksByStatus.get()[STATUSES.DONE].length),
						className: "task-count",
					}),
				),
				S.el(S(() => tasksByStatus.get()[STATUSES.DONE]), tasks =>
					el("div", { className: "column-tasks" }).append(
						...tasks.map(task=> el(TaskCard, { task, onDragable }, onCardEdit, onCardDelete))
					)
				)
			)
		),
	);
}
/** @typedef {CustomEvent<[ string, Task ]>} CardEditEvent */
/** @typedef {CustomEvent<string>} CardDeleteEvent */
/**
 * Task Card Component
 * @type {(props: { task: Task, onDragable: (id: number) => ddeElementAddon<HTMLDivElement> }) => HTMLElement}
 * @fires {CardEditEvent} card:edit
 * @fires {CardDeleteEvent} card:delete
 * */
function TaskCard({ task, onDragable }){
	const { host }= scope;
	const isEditing = S(false);
	const onEditStart = () => isEditing.set(true);

	const dispatchEdit= dispatchEvent("card:edit", host);
	const dispatchDelete= dispatchEvent("card:delete", host).bind(null, task.id);

	return el("div", {
		id: `task-${task.id}`,
		className: `task-card priority-${task.priority}`,
		draggable: true
	}, onDragable(task.id)).append(
		S.el(isEditing, editing => editing
			? el(EditMode)
			: el().append(
				el("div", { className: "task-header" }).append(
					el("h3", { className: "task-title", textContent: task.title }),
					el("div", { className: "task-actions" }).append(
						el("button", {
							textContent: "✎",
							className: "edit-btn",
							ariaLabel: "Edit task"
						}, on("click", onEditStart)),
						el("button", {
							textContent: "✕",
							className: "delete-btn",
							ariaLabel: "Delete task"
						}, on("click", dispatchDelete))
					)
				),
				!task.description
				? el()
				: el("p", { className: "task-description", textContent: task.description }),
				el("div", { className: "task-meta" }).append(
					el("span", {
						className: `priority-badge priority-${task.priority}`,
						textContent: task.priority.charAt(0).toUpperCase() + task.priority.slice(1)
					})
				)
			)
		)
	);
	function EditMode(){
		const onSubmit = on("submit", e => {
			e.preventDefault();
			const formData = new FormData(/** @type {HTMLFormElement} */(e.target));
			const title = formData.get("title");
			const description = formData.get("description");
			const priority = formData.get("priority");
			isEditing.set(false);
			dispatchEdit([ task.id, { title, description, priority } ]);
		})
		const onEditCancel = () => isEditing.set(false);

		return el("form", { className: "task-edit-form" }, onSubmit).append(
			el("input", {
				name: "title",
				className: "task-title-input",
				defaultValue: task.title,
				placeholder: "Task title",
				required: true,
				autoFocus: true
			}),
			el("textarea", {
				name: "description",
				className: "task-desc-input",
				defaultValue: task.description,
				placeholder: "Description (optional)"
			}),
			el("select", {
				name: "priority",
			}, on.defer(el=> el.value = task.priority)).append(
				el("option", { value: "low", textContent: "Low Priority" }),
				el("option", { value: "medium", textContent: "Medium Priority" }),
				el("option", { value: "high", textContent: "High Priority" })
			),
			el("div", { className: "task-edit-actions" }).append(
				el("button", {
					textContent: "Cancel",
					type: "button",
					className: "cancel-btn"
				}, on("click", onEditCancel)),
				el("button", {
					textContent: "Save",
					type: "submit",
					className: "save-btn"
				})
			)
		);
	}
}

/**
 * Helper function to handle move an element
 * @param {(id: string, status: string) => void} onMoved
 * */
function moveElementAddon(onMoved){
	let draggedTaskId = null;
	function onDragable(id) {
		return element => {
			on("dragstart", e => {
				draggedTaskId= id;
				e.dataTransfer.effectAllowed = 'move';

				// Add some styling to the element being dragged
				setTimeout(() => {
					const el = document.getElementById(`task-${id}`);
					if (el) el.classList.add('dragging');
				}, 0);
			})(element);

			on("dragend", () => {
				draggedTaskId= null;

				// Remove the styling
				const el = document.getElementById(`task-${id}`);
				if (el) el.classList.remove('dragging');
			})(element);
		};
	}
	function onDragArea(status) {
		return element => {
			on("dragover", e => {
				e.preventDefault();
				e.dataTransfer.dropEffect = 'move';

				// Add a visual indicator for the drop target
				const column = document.getElementById(`column-${status}`);
				if (column) column.classList.add('drag-over');
			})(element);

			on("dragleave", () => {
				// Remove the visual indicator
				const column = document.getElementById(`column-${status}`);
				if (column) column.classList.remove('drag-over');
			})(element);

			on("drop", e => {
				e.preventDefault();
				const id = draggedTaskId;
				if (id) onMoved(id, status);
				// Remove the visual indicator
				const column = document.getElementById(`column-${status}`);
				if (column) column.classList.remove('drag-over');
			})(element);
		};
	}
	return { onDragable, onDragArea };
}

// Render the component
document.body.append(
	el("div", { style: "padding: 20px; background: #f5f5f5; min-height: 100vh;" }).append(
		el(TaskManager)
	),
	el("style", `
		.task-manager {
			font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
			max-width: 1200px;
			margin: 0 auto;
			padding: 1rem;
			color: #333;
		}

		.app-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 1.5rem;
			flex-wrap: wrap;
			gap: 1rem;
		}

		.app-header h1 {
			margin: 0;
			color: #2d3748;
		}

		.app-controls {
			display: flex;
			gap: 1rem;
		}

		.app-controls input,
		.app-controls select {
			padding: 0.5rem;
			border: 1px solid #e2e8f0;
			border-radius: 4px;
			font-size: 0.9rem;
		}

		.new-task-form {
			background: white;
			padding: 1.5rem;
			border-radius: 8px;
			box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
			margin-bottom: 2rem;
		}

		.form-row {
			display: flex;
			gap: 1rem;
			margin-bottom: 1rem;
		}

		.form-row input {
			flex-grow: 1;
			padding: 0.75rem;
			border: 1px solid #e2e8f0;
			border-radius: 4px;
			font-size: 1rem;
		}

		.form-row select {
			width: 100px;
			padding: 0.75rem;
			border: 1px solid #e2e8f0;
			border-radius: 4px;
			font-size: 1rem;
		}

		.add-btn {
			background: #4a90e2;
			color: white;
			border: none;
			border-radius: 4px;
			padding: 0.75rem 1.5rem;
			font-size: 1rem;
			cursor: pointer;
			transition: background 0.2s ease;
		}

		.add-btn:hover {
			background: #3a7bc8;
		}

		.new-task-form textarea {
			width: 100%;
			padding: 0.75rem;
			border: 1px solid #e2e8f0;
			border-radius: 4px;
			font-size: 1rem;
			resize: vertical;
			min-height: 80px;
		}

		.task-board {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
			gap: 1.5rem;
		}

		.task-column {
			background: #f7fafc;
			border-radius: 8px;
			padding: 1rem;
			min-height: 400px;
			transition: background 0.2s ease;
		}

		.column-header {
			margin-top: 0;
			padding-bottom: 0.75rem;
			border-bottom: 2px solid #e2e8f0;
			font-size: 1.25rem;
			color: #2d3748;
			display: flex;
			align-items: center;
		}

		.task-count {
			display: inline-flex;
			justify-content: center;
			align-items: center;
			background: #e2e8f0;
			color: #4a5568;
			border-radius: 50%;
			width: 25px;
			height: 25px;
			font-size: 0.875rem;
			margin-left: 0.5rem;
		}

		.column-tasks {
			margin-top: 1rem;
			display: flex;
			flex-direction: column;
			gap: 1rem;
			min-height: 200px;
		}

		.task-card {
			background: white;
			border-radius: 6px;
			padding: 1rem;
			box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
			cursor: grab;
			transition: transform 0.2s ease, box-shadow 0.2s ease;
			position: relative;
			border-left: 4px solid #ccc;
		}

		.task-card:hover {
			transform: translateY(-3px);
			box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
		}

		.task-card.dragging {
			opacity: 0.5;
			cursor: grabbing;
		}

		.task-card.priority-low {
			border-left-color: #38b2ac;
		}

		.task-card.priority-medium {
			border-left-color: #ecc94b;
		}

		.task-card.priority-high {
			border-left-color: #e53e3e;
		}

		.task-header {
			display: flex;
			justify-content: space-between;
			align-items: flex-start;
			margin-bottom: 0.5rem;
		}

		.task-title {
			margin: 0;
			font-size: 1.1rem;
			color: #2d3748;
			word-break: break-word;
		}

		.task-description {
			margin: 0.5rem 0;
			font-size: 0.9rem;
			color: #4a5568;
			word-break: break-word;
		}

		.task-actions {
			display: flex;
			gap: 0.5rem;
		}

		.edit-btn,
		.delete-btn {
			background: none;
			border: none;
			font-size: 1rem;
			cursor: pointer;
			width: 24px;
			height: 24px;
			display: inline-flex;
			justify-content: center;
			align-items: center;
			border-radius: 50%;
			color: #718096;
			transition: background 0.2s ease, color 0.2s ease;
		}

		.edit-btn:hover {
			background: #edf2f7;
			color: #4a5568;
		}

		.delete-btn:hover {
			background: #fed7d7;
			color: #e53e3e;
		}

		.task-meta {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-top: 0.75rem;
		}

		.priority-badge {
			font-size: 0.75rem;
			padding: 0.2rem 0.5rem;
			border-radius: 4px;
			font-weight: 500;
		}

		.priority-badge.priority-low {
			background: #e6fffa;
			color: #2c7a7b;
		}

		.priority-badge.priority-medium {
			background: #fefcbf;
			color: #975a16;
		}

		.priority-badge.priority-high {
			background: #fed7d7;
			color: #c53030;
		}

		.drag-over {
			background: #f0f9ff;
			border: 2px dashed #4a90e2;
		}

		.task-edit-form {
			display: flex;
			flex-direction: column;
			gap: 0.75rem;
		}

		.task-title-input,
		.task-desc-input {
			width: 100%;
			padding: 0.5rem;
			border: 1px solid #e2e8f0;
			border-radius: 4px;
			font-size: 0.9rem;
		}

		.task-desc-input {
			min-height: 60px;
			resize: vertical;
		}

		.task-edit-actions {
			display: flex;
			justify-content: flex-end;
			gap: 0.5rem;
			margin-top: 0.5rem;
		}

		.cancel-btn,
		.save-btn {
			padding: 0.4rem 0.75rem;
			border-radius: 4px;
			font-size: 0.9rem;
			cursor: pointer;
		}

		.cancel-btn {
			background: #edf2f7;
			color: #4a5568;
			border: 1px solid #e2e8f0;
		}

		.save-btn {
			background: #4a90e2;
			color: white;
			border: none;
		}

		@media (max-width: 768px) {
			.app-header {
				flex-direction: column;
				align-items: flex-start;
			}

			.app-controls {
				width: 100%;
				flex-direction: column;
			}

			.form-row {
				flex-direction: column;
			}

			.task-board {
				grid-template-columns: 1fr;
			}
		}
	`)
);
