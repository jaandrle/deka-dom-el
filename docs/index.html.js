import { t, T } from "./utils/index.js";
export const info= {
	href: "./",
	title: t`Introduction`,
	description: t`Introducing a library.`,
};

import { el } from "deka-dom-el";
import { simplePage } from "./layout/simplePage.html.js";
import { h3 } from "./components/pageUtils.html.js";
import { example } from "./components/example.html.js";
import { code } from "./components/code.html.js";
/** @param {string} url */
const fileURL= url=> new URL(url, import.meta.url);
const references= {
	w_mvv:{
		title: t`Wikipedia: Model–view–viewmodel`,
		href: "https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93viewmodel",
	},
	w_mvc: {
		title: t`Wikipedia: Model–view–controller`,
		href: "https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller",
	},
};
/** @param {import("./types.d.ts").PageAttrs} attrs */
export function page({ pkg, info }){
	const page_id= info.id;
	return el(simplePage, { info, pkg }).append(
		el("p", t`The library tries to provide pure JavaScript tool(s) to create reactive interfaces using …`),

		el(h3, t`Event-driven programming (3 parts separation ≡ 3PS)`),
		el("p").append(t`
			Let's introduce the basic principle on which the library is built. We'll use the JavaScript listener as
			a starting point.
		`),
		el(code, { src: fileURL("./components/examples/introducing/3ps.js"), page_id }),
		el("p").append(...T`
			As we can see, in the code at location “A” we define ${el("em", t`how to react`)} when the function
			is called with any event as an argument. At that moment, we ${el("em", t`don’t care who/why/how`)}
			the function was called. Similarly, at point “B”, we reference to a function to be called on the event
			${el("em", t`without caring`)} what the function will do at that time. Finally, at point “C”, we tell
			the application that a change has occurred, in the input, and we ${el("em", t`don't care if/how someone`)}
			is listening for the event.
		`),
		el(example, { src: fileURL("./components/examples/introducing/helloWorld.js"), page_id }),
		el("p").append(...T`
			The library introduces a new “type” of variable/constant called ${el("em", t`signal`)} allowing us to
			to use introduced 3PS pattern in our applications. As you can see it in the example above.
		`),
		el("p").append(...T`
			Also please notice that there is very similar 3PS pattern used for separate creation of UI and
			business logic.
		`),
		el("p").append(...T`
			The 3PS is very simplified definition of the pattern. There are more deep/academic definitions more precisely
			describe usage in specific situations, see for example ${el("a", { textContent: t`MVVM`, ...references.w_mvv })}
			or ${el("a", { textContent: t`MVC`, ...references.w_mvc })}.
		`),

		el(h3, t`Organization of the documentation`),
	);
}
