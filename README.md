**WIP** (the experimentation phase) | [source code on GitHub](https://github.com/jaandrle/deka-dom-el) | [*mirrored* on Gitea](https://gitea.jaandrle.cz/jaandrle/deka-dom-el)

***Vanilla by default — steroids if needed***
*…use simple DOM API by default and library tools and logic when you need them*

```js
const value= S("");
document.body.append(
	el("span", { style: { fontWeight: "bold" }, textContent: value }),
	el("input", { type: "text" },
		on("change", event=> value(event.target.value)))
);
```
# Deka DOM Elements
Creating reactive elements, components and Web components using [IDL](https://developer.mozilla.org/en-US/docs/Glossary/IDL)/JavaScript DOM API and signals ([Signals — whats going on behind the scenes | by Ryan Hoffnan |
ITNEXT](https://itnext.io/signals-whats-going-on-behind-the-scenes-ec858589ea63) or [The Evolution of Signals in JavaScript - DEV Community](https://dev.to/this-is-learning/the-evolution-of-signals-in-javascript-8ob)).

## Inspiration and suggested alternatives
- my previous (mostly internal) library: [jaandrle/dollar_dom_component: Functional DOM components without JSX and virtual DOM.](https://github.com/jaandrle/dollar_dom_component)
- [vanjs-org/van: 🍦 VanJS: World's smallest reactive UI framework. Incredibly Powerful, Insanely Small - Everyone can build a useful UI app in an hour.](https://github.com/vanjs-org/van)
- [hyperhype/hyperscript: Create HyperText with JavaScript.](https://github.com/hyperhype/hyperscript)
- [adamhaile/S: S.js - Simple, Clean, Fast Reactive Programming in Javascript](https://github.com/adamhaile/S) ([adamhaile/surplus: High performance JSX web views for S.js applications](https://github.com/adamhaile/surplus))
- [potch/signals: a small reactive signals library](https://github.com/potch/signals)

## Why an another one?
This library should lies somewhere between van/hyperscript and [solid-js](https://github.com/solidjs/solid) (S).
In the meaning of size, complexity and usability.

An another goal is making clear library logic. Starting from pure native JavaScript (DOM API),
then using small utils (`assign`, `S`, …, `el`, …) and end up with way to write complex code.
Therefore, you can use any „internal” function to make live with native JavaScript easier
(`assign`, `classListDeclarative`, `on`, `dispatchEvent`, …, `S`, …) regarding if you don’t
need complex library/framework.

As consequence of that, it shouldn’t be hard to incorporate the library into existing projects.
That can make potecial migration easier.

To balance all requirements above, lots of compromises have been made. To sumarize:
- [x] library size 10–15kB minified (10kB originaly)
- [x] allow using *signals optionaly* and allow registering *own signals implementation*
- [x] *no build step required*
- [x] prefer a *declarative/functional* approach
- [x] prefer zero/minimal dependencies
- [ ] support/enhance custom elements (web components)
- [x] support SSR ([jsdom](https://github.com/jsdom/jsdom))
- [ ] WIP provide types

## First steps
- [**Guide**](https://jaandrle.github.io/deka-dom-el)
- Documentation
- Instalation
	- npm
	- [dist/](dist/) (`https://cdn.jsdelivr.net/gh/jaandrle/deka-dom-el/dist/`…)
