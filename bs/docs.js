#!/usr/bin/env nodejsscript
/* jshint esversion: 11,-W097, -W040, module: true, node: true, expr: true, undef: true *//* global echo, $, pipe, s, fetch, cyclicLoop */
const path_target= {
	root: "docs/",
	html: "docs/index.html",
	css: "docs/"
};
import { createHTMl } from "./docs/jsdom.js";
const ssr= createHTMl("");
import { register } from "../jsdom.js";
const { el }= await register(ssr.dom);

echo("Loading components…");
const pkg= s.cat("package.json").xargs(JSON.parse);
const { page, css }= await import("../docs_src/index.html.js"); //→											TODO: important to mention in docs!!!
document.body.append(
	el(page, { pkg, path_target }),
	el("script", { src: "https://cdn.jsdelivr.net/npm/shiki" }),
	el("script", { src: "index.js", type: "module" })
);

s.echo(ssr.serialize()).to(path_target.html);
s.echo(css.content).to(path_target.css+"index.css");
