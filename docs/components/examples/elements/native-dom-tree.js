// Verbose, needs temp variables
const div = document.createElement('div');
const h1 = document.createElement('h1');
h1.textContent = 'Title';
div.append(h1);

const p = document.createElement('p');
p.textContent = 'Paragraph';
div.append(p);

// append doesn't return parent
// so chaining is not possible

// Add to DOM
document.body.append(div);
