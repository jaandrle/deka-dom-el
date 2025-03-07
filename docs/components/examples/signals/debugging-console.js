import { S } from "deka-dom-el/signals";

// Debugging a derived signal
const name = S('Alice');
const greeting = S(() => {
	console.log('Computing greeting...');
	return 'Hello, ' + name.get();
});

// Monitor the derived signal
S.on(greeting, value => console.log('Greeting changed to:', value));

// Later update the dependency
name.set('Bob'); // Should trigger computation and listener

// Console output:
// Computing greeting...
// Greeting changed to: Hello, Alice
// Computing greeting...
// Greeting changed to: Hello, Bob
