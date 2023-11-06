document.body.append(
	document.createElement("div"),
	document.createElement("span"),
	document.createElement("main")
);
console.log(document.body.innerHTML.includes("<div></div><span></span><main></main>"));
const template= document.createElement("main").append(
	document.createElement("div"),
	document.createElement("span"),
);
console.log(typeof template==="undefined");
