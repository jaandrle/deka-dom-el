document.body.append(
	document.createElement("div")
);
console.log(
	"Emty div is generated inside <body>:",
	document.body.innerHTML.includes("<div></div>")
);

document.body.append(
	Object.assign(
		document.createElement("p"),
		{ textContent: "Element’s text content.", style: "color: coral;" }
	)
);
