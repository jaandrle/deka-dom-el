#!/usr/bin/env nodejsscript
/* jshint esversion: 11,-W097, -W040, module: true, node: true, expr: true, undef: true *//* global echo, $, pipe, s, fetch, cyclicLoop */
echo("Building static documentation files…");
echo("Preparing…");
const path_target= {
	root: "docs/",
	css: "docs/"
};
import { createHTMl } from "./docs/jsdom.js";
import { register } from "../jsdom.js";
const pkg= s.cat("package.json").xargs(JSON.parse);
const pages= [
	{ id: "index", title: "Introduction", description: "Introducing a library and motivations." },
	{ id: "elements", title: "Elements", description: "Basic concepts of elements modifications and creations." }
];

for(const info of pages){
	const { id }= info;
	echo(`Generating ${id}.html…`);
	const ssr= createHTMl("");
	const { el }= await register(ssr.dom);
	const { page, css }= await import(`../docs_src/${id}.html.js`); //→											TODO: important to mention in docs!!!
	document.body.append(
		el(page, { pkg, info, path_target, pages, registerClientFile }),
	);

	echo.use("-R", `Writing ${id}.html…`);
	s.echo(ssr.serialize()).to(path_target.root+id+".html");
	s.echo(css.content).to(path_target.css+id+".css");
}
echo("Done");


/**
 * @typedef registerClientFile
 * @type {function}
 * @param {URL} url
 * @param {HTMLScriptElement|HTMLLinkElement} [element_head]
 * */
function registerClientFile(url, element_head){
	const file_name= url.pathname.split("/").pop();
	s.cat(url).to(path_target.root+file_name);

	if(!element_head) return;
	element_head[element_head instanceof HTMLScriptElement ? "src" : "href"]= file_name;
	document.head.append(
		element_head
	);
}
