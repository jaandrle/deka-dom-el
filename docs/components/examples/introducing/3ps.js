// pseudocode
// 1. Create state
const count = S(0);

// 2. React to state changes
S.on(count, value => {
  updateUI(value);
  if (value > 10) disableButton();
});

// 3. Update state on events
button.addEventListener('click', () => {
  count.set(count.get() + 1);
});
