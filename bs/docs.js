#!/usr/bin/env -S npx nodejsscript
/* jshint esversion: 11,-W097, -W040, module: true, node: true, expr: true, undef: true *//* global echo, $, pipe, s, fetch, cyclicLoop */// editorconfig-checker-disable-line
echo("Building static documentation files…");
echo("Preparing…");
import { path_target, pages as pages_registered, styles, currentPageId, dispatchEvent, t } from "../docs/ssr.js";
import { createHTMl } from "./docs/jsdom.js";
import { register, queue } from "../jsdom.js";
const pkg= s.cat("package.json").xargs(JSON.parse);

if(s.test("-d", path_target.root)){
	echo("Removing old files…");
	s.rm("-rf", path_target.root+"*");
} else {
	echo("Creating directory…");
	s.mkdir("-p", path_target.root);
}

// Create assets directory in target
echo("Creating assets directory…");
s.mkdir("-p", path_target.root+"assets");
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
	currentPageId(id)
	serverDOM.document.body.append(
		el(page, { pkg, info }),
	);
	await queue();

	echo.use("-R", `Writing ${id}.html…`);
	dispatchEvent("oneachrender", document);
	s.echo(serverDOM.serialize()).to(path_target.root+id+".html");
}
s.echo(styles.content).to(path_target.css+styles.name);

// Copy assets
echo("Copying assets…");
if(s.test("-d", "docs/assets")) {
	s.cp("-r", "docs/assets/*", path_target.assets);
}

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
