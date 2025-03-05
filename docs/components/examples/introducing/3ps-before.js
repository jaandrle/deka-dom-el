// pseudocode
// Mixed concerns make code hard to maintain
const button = document.querySelector('button');
let count = 0;

button.addEventListener('click', () => {
  count++;
  document.querySelector('p').textContent =
    'Clicked ' + count + ' times';

  if (count > 10) {
    button.disabled = true;
  }
});
