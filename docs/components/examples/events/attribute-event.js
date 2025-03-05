import { el } from "deka-dom-el";

// Using events with HTML attribute style
el("button", {
  textContent: "click me",
  "=onclick": "console.log(event)"
});