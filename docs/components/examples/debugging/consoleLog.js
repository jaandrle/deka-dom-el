// Debugging a (derived) signal with `console.log`
import { S } from "deka-dom-el/signals";
const name= S("Alice");
const greeting = S(() => {
	// log derived signals
	const log = "Hello, " + name.get();
	console.log(log);
	console.log(name.valueOf());
	return log;
});

// log signals in general
S.on(greeting, value => console.log("Greeting changed to:", value));

name.set("Bob"); // Should trigger computation and listener`)
