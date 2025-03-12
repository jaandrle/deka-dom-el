// Create element with properties
const button = document.createElement('button');
button.textContent = "Click me";
button.className = "primary";
button.disabled = true;

// Or using Object.assign()
const button2 = Object.assign(
	document.createElement('button'),
	{
		textContent: "Click me",
		className: "primary",
		disabled: true
	}
);

// Add to DOM
document.body.append(button);
document.body.append(button2);
