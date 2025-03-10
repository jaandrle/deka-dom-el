// use NPM or for example https://cdn.jsdelivr.net/gh/jaandrle/deka-dom-el/dist/esm-with-signals.js
import {
	customElementRender,
	customElementWithDDE,
} from "deka-dom-el";
/** @type {ddePublicElementTagNameMap} */
import { S } from "deka-dom-el/signals";
S.observedAttributes;

// “internal” utils
import { lifecyclesToEvents } from "deka-dom-el";
