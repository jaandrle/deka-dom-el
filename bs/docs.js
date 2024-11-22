#!/usr/bin/env nodejsscript
/* jshint esversion: 11,-W097, -W040, module: true, node: true, expr: true, undef: true *//* global echo, $, pipe, s, fetch, cyclicLoop */
echo("Building static documentation files…");
echo("Preparing…");
import { path_target, pages as pages_registered, styles, dispatchEvent, t } from "../docs/ssr.js";
import { createHTMl } from "./docs/jsdom.js";
import { register } from "../jsdom.js";
const pkg= s.cat("package.json").xargs(JSON.parse);

echo("Collecting list of pages…");
const pages= s.ls($.xdg.main`../docs/*.html.js`).map(addPage);
for(const { id, info } of pages){
	echo(`Generating ${id}.html…`);
	const serverDOM= createHTMl("");
	serverDOM.registerGlobally(
		"HTMLScriptElement"
	);
	const { el }= await register(serverDOM.dom);
	const { page }= await import(`../docs/${id}.html.js`);
	serverDOM.document.body.append(
		el(page, { pkg, info }),
	);

	echo.use("-R", `Writing ${id}.html…`);
	dispatchEvent("oneachrender", document);
	s.echo(serverDOM.serialize()).to(path_target.root+id+".html");
}
s.echo(styles.content).to(path_target.css+styles.name);
dispatchEvent("onssrend");
echo("Done");

/** @param {`${string}/${string}.html.js`} path */
function addPage(path){
	const id= idFromPath(path);
	const [ info_pre ]= s.cat(path).match(/(?<=\s*export\s+const\s+info\s*=\s*)\{(.|\s)*?\}(?=;)/gm);
	const info= { id, href: id, ...eval(`(${info_pre})`) };
	pages_registered.push(info);
	return { id, info };
}
/** @param {`${string}/${string}.html.js`} path */
function idFromPath(path){
	const file_start= path.lastIndexOf("/");
	return path.slice(file_start+1, path.indexOf(".", file_start));
}
