#!/usr/bin/env nodejsscript
/* jshint esversion: 11,-W097, -W040, module: true, node: true, expr: true, undef: true *//* global echo, $, pipe, s, fetch, cyclicLoop */
echo("Building static documentation files…");
echo("Preparing…");
import { path_target, pages, styles, dispatchEvent } from "../docs_src/ssr.js";
import { createHTMl } from "./docs/jsdom.js";
import { register } from "../jsdom.js";
const pkg= s.cat("package.json").xargs(JSON.parse);

for(const info of pages){
	const { id }= info;
	echo(`Generating ${id}.html…`);
	const ssr= createHTMl("");
	const { el }= await register(ssr.dom);
	const { page }= await import(`../docs_src/${id}.html.js`); //→											TODO: important to mention in docs!!!
	document.body.append(
		el(page, { pkg, info }),
	);

	echo.use("-R", `Writing ${id}.html…`);
	dispatchEvent("oneachrender", document);
	s.echo(ssr.serialize()).to(path_target.root+id+".html");
}
s.echo(styles.content).to(path_target.css+styles.name);
dispatchEvent("onssrend");
echo("Done");
