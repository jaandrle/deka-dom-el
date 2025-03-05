// Verbose, needs temp variables
const div = document.createElement('div');
const h1 = document.createElement('h1');
h1.textContent = 'Title';
div.appendChild(h1);

const p = document.createElement('p');
p.textContent = 'Paragraph';
div.appendChild(p);

// appendChild doesn't return parent
// so chaining is not possible

// Add to DOM
document.body.appendChild(div);