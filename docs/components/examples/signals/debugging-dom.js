import { el, assign } from "deka-dom-el";
import { S } from "deka-dom-el/signals";

// Create a component with reactive elements
function ReactiveCounter() {
  const count = S(0);
  
  // Elements created with el() have data-dde attribute
  const counter = el('div', { 
    id: 'counter',
    // This element will have __dde_reactive property
    textContent: count 
  });
  
  const incrementBtn = el('button', {
    textContent: 'Increment',
    onclick: () => count.set(count.get() + 1)
  });
  
  // Dynamic section with __dde_signal property
  const counterInfo = S.el(count, value => 
    el('p', `Current count is ${value}`)
  );
  
  return el('div').append(
    counter,
    incrementBtn,
    counterInfo
  );
}

// In DevTools console:
// document.querySelectorAll('[data-dde]'); // Find all elements created with deka-dom-el
// const counter = document.querySelector('#counter');
// console.log(counter.__dde_reactive); // See reactive bindings