import { el, on } from "deka-dom-el";
import { S } from "deka-dom-el/signals";

// A HelloWorld component using the 3PS pattern
function HelloWorld({ emoji = "🚀" }) {
  // PART 1: Create reactive state
  const clicks = S(0);
  
  return el().append(
    // PART 2: Bind state to UI elements
    el("p", {
      className: "greeting",
      // This paragraph automatically updates when clicks changes
      textContent: S(() => `Hello World ${emoji.repeat(clicks.get())}`)
    }),
    
    // PART 3: Update state in response to events
    el("button", {
      type: "button",
      textContent: "Add emoji",
      // When clicked, update the state
      onclick: () => clicks.set(clicks.get() + 1)
    })
  );
}

// Use the component in your app
document.body.append(
  el(HelloWorld, { emoji: "🎉" })
);