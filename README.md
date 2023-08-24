**WIP** (the experimentation phase) | [source code on Gitea](https://gitea.jaandrle.cz/jaandrle/deka-dom-el) | [*mirrored* on GitHub](https://github.com/jaandrle/deka-dom-el)

# Deka DOM Elements
This is reimplementation of [jaandrle/dollar_dom_component: Functional DOM components without JSX and virtual DOM.](https://github.com/jaandrle/dollar_dom_component).

The goal is to be even more close to the native JavaScript.

# Native JavaScript DOM elements creations
Let’s go through all patterns we would like to use and what needs to be improved for better experience.

## Creating element and DOM templates natively
```js
document.body.append(
	document.createElement("div"),
	document.createElement("span"),
	document.createElement("main")
);
//=> HTML output: <div></div><span></span><main></main>
const template= document.createElement("main").append(
	document.createElement("div"),
	document.createElement("span"),
);
//=> ★:: typeof template==="undefined"
```
**Pitfalls**:
- there is lots of text
- `.append` methdo returns `void`⇒ it cannot be chained (see ★)

## Set properties of created element
```js
const element= Object.assign(document.createElement("p"), { className: "red", textContent: "paragraph" });
document.body.append(element);
//=> HTML output: <p class="red">paragraph</p>
```
**Pitfalls**:
- there is lots of text
- `Object.assign` isn’t ideal as it can set only (some) [IDL](https://developer.mozilla.org/en-US/docs/Glossary/IDL)

# Events and dynamic parts
```js
const input= document.createElement("input");
const output= document.createElement("output");
input.addEventListener("change", function(event){
	output.value= event.target.value;
});
document.body.append(
	output,
	input
);
//=> HTML output: <output></output><input>
```
**Pitfalls**:
- there is lots of text
- very hard to organize code

# Helpers and modifications
Now, let's introduce library helpers and modifications.

## `.append`
The `.append` is owerwrote to always returns element. This seem to be the best way to do it as it is very hard
to create Proxy around `HTMLElement`, ….
```js
document.body.append(
	document.createElement("main").append(
		document.createElement("div"),
		document.createElement("span"),
	)
);
//=> HTML output: <main><div></div><span></span></main>
```

## `el` and `assign` functions
```js
const element= assign(document.createElement("a"), {
	className: "red",
	dataTest: "test",
	href: "www.seznam.cz",
	textContent: "Link",
	style: { color: "blue" }
});
document.body.append(element);
assign(element, { style: undefined });
//=> HTML output: <a href="www.seznam.cz" data-test="test" class="red">Link</a>
```
…but for elements/template creations `el` is even better:
```js
document.body.append(
	el("div").append(
		el("p").append(
			el("#text", { textContent: "Link: " }),
			el("a", {
				href: "www.seznam.cz",
				textContent: "example",
			})
		)
	)
);
```

## Events and signals for reactivity
*investigation*:
```js
const value= S("");
document.body.append(
	el("span", { style: { fontWeight: "bold" }, textContent: value }),
	el("input", { type: "text" },
		listen("change", event=> value(event.target.value)))
);
```
