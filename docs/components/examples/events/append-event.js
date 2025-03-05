import { el, on } from "deka-dom-el";

// Third approach - append with on addon
el("button", {
  textContent: "click me"
}).append(
  on("click", (e) => console.log("Clicked!", e))
);