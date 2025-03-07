import { S } from "deka-dom-el/signals";

// Create base signals
const firstName = S("John");
const lastName = S("Doe");

// Create a derived signal
const fullName = S(() => firstName.get() + " " + lastName.get());

// The fullName signal updates automatically when either dependency changes
S.on(fullName, name => console.log("Name changed to:", name));

firstName.set("Jane"); // logs: "Name changed to: Jane Doe"
