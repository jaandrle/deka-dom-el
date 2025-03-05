/** See `package.json` */
export type Pkg= Record<string, string>
export type Info= {
	id: string,
	href: string,
	title: string,
	fullTitle: string,
	description: string,
}
export type Pages=Info[];
export type PathTarget= {
	root: string,
	css: string
}
export type registerClientFile= import("../bs/docs.js").registerClientFile;
export type PageAttrs= {
	pkg: Pkg,
	info: Info,
	pages: Pages,
	path_target: PathTarget,
	registerClientFile: registerClientFile
}

import type { CustomHTMLTestElement } from "../examples/components/webComponent.js";
declare global{
	interface ddePublicElementTagNameMap{
		["custom-test"]: CustomHTMLTestElement;
	}
	function test(): ddeHTMLParagraphElement
}
