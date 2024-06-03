const onchage=
	event=>
		console.log("Reacting to the:", event); // A
input.addEventListener("change", onchange); // B
input.dispatchEvent(new Event("change")); // C
