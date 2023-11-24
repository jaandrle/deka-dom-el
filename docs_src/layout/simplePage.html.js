import "../global.css.js";
import { el, simulateSlots } from "deka-dom-el";

import { header } from "./head.html.js";
import { prevNext } from "../components/pageUtils.html.js";

/** @param {import("../types.d.ts").PageAttrs} attrs */
export function simplePage({ pkg, info }){
	return simulateSlots(el().append(
		el(header, { info, pkg }),
		el("main").append(
			el("slot"),
			el(prevNext, info)
		)
	));
}
