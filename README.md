**WIP** (the experimentation phase)
| [source code on GitHub](https://github.com/jaandrle/deka-dom-el)
| [*mirrored* on Gitea](https://gitea.jaandrle.cz/jaandrle/deka-dom-el)

***Vanilla for flavouring — a full-fledged feast for large projects***

*…use simple DOM API by default and library tools and logic when you need them*

```javascript
document.body.append(
	el(HelloWorldComponent)
);
function HelloWorldComponent(){
	const clicks= S(0);
	const emoji= S("🚀");
	const isSelected= el=> (el.selected= el.value===emoji());

	return el().append(
		el("p", {
			textContent: S(() => `Hello World ${emoji().repeat(clicks())}`),
			className: "example",
			ariaLive: "polite", //OR ariaset: { live: "polite" },
			dataset: { example: "Example" }, //OR dataExample: "Example",
		}),
		el("button",
			{ textContent: "Fire", type: "button" },
			on("click", ()=> clicks(clicks() + 1)),
			on("keyup", ()=> clicks(clicks() - 2)),
		),
		el("select", {
			onchange: event=> emoji(event.target.value),
		}).append(
			el(OptionComponent, "🎉", isSelected),
			el(OptionComponent, "🚀", isSelected),
		)
	);
}
function OptionComponent({ textContent }){
	return el("option", { value: textContent, textContent })
}
```
# Deka DOM Elements
Creating reactive elements, components and Web components using [IDL](https://developer.mozilla.org/en-US/docs/
Glossary/IDL)/JavaScript DOM API and [**signals/observables**](#signals).

## Inspiration and suggested alternatives
- my previous library (mostly used internaly): [jaandrle/dollar_dom_component: Functional DOM components without
JSX and virtual DOM.](https://github.com/jaandrle/dollar_dom_component)
- [vanjs-org/van: 🍦 VanJS: World's smallest reactive UI framework. Incredibly Powerful, Insanely Small -
Everyone can build a useful UI app in an hour.](https://github.com/vanjs-org/van)
- [hyperhype/hyperscript: Create HyperText with JavaScript.](https://github.com/hyperhype/hyperscript)
- [adamhaile/S: S.js - Simple, Clean, Fast Reactive Programming in Javascript](https://github.com/adamhaile/S)
([adamhaile/surplus: High performance JSX web views for S.js applications](https://github.com/adamhaile/surplus))
- [potch/signals: a small reactive signals library](https://github.com/potch/signals)

## Why an another one?
This library falls somewhere between van/hyperscript and [solid-js](https://github.com/solidjs/solid) in terms of size,
complexity, and usability.

Another goal is to proceed in the best spirit of functional programming. This involves starting with
pure JavaScript (DOM API) and gradually adding auxiliary functions, ranging from “minor” improvements
to the capability of writing complete declarative reactive UI templates.

As a result, any “internal” function (`assign`, `classListDeclarative`, `on`, `dispatchEvent`, …, `S`, …)
can be used independently, although they are primarily designed for use in combination.  This can also,
hopefully, help in integrating the library into existing projects.

To balance these requirements, numerous compromises have been made. To summarize:
- [ ] Library size: 10–15kB minified (the original goal was a maximum of 10kB)
- [x] Optional use of *signals* with the ability to register *your own signals/observables implementation*
- [x] *No build step required*
- [x] Preference for a *declarative/functional* approach
- [x] Focus on zero/minimal dependencies
- [ ] Support for/enhancement of custom elements (web components)
- [x] Support for SSR ([jsdom](https://github.com/jsdom/jsdom))
- [ ] WIP providing types

## First steps
- [**Guide**](https://jaandrle.github.io/deka-dom-el)
- Documentation
- Installation
	- npm
	- [dist/](dist/) (`https://cdn.jsdelivr.net/gh/jaandrle/deka-dom-el/dist/`…)

## Signals
- [Signals — whats going on behind the scenes | by Ryan Hoffnan | ITNEXT](https://itnext.io/
signals-whats-going-on-behind-the-scenes-ec858589ea63)
- [The Evolution of Signals in JavaScript - DEV Community](https://dev.to/this-is-learning/the-evolution-of-signals-in-
javascript-8ob)
- there is also [tc39/proposal-signals: A proposal to add signals to JavaScript.](https://github.com/tc39/proposal-
signals)
- [Observer pattern - Wikipedia](https://en.wikipedia.org/wiki/Observer_pattern)
