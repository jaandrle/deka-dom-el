import { S } from "deka-dom-el/signals";
// Wrong - direct mutation doesn't trigger updates
const todos1 = S([{ text: "Learn signals", completed: false }]);
todos1.get().push({ text: "Debug signals", completed: false }); // Won't trigger updates!

// Correct - using .set() with a new array
todos1.set([...todos1.get(), { text: "Debug signals", completed: false }]);

// Better - using actions
const todos2 = S([], {
	add(text) {
		this.value.push({ text, completed: false });
	}
});
S.action(todos2, "add", "Debug signals");
