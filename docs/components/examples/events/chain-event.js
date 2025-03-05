import { el, on } from "deka-dom-el";

// Using events as addons - chainable approach
el("button", {
  textContent: "click me",
}, 
  on("click", (e) => console.log("Clicked!", e))
);