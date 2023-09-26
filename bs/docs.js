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
import { head, body, css } from "../docs_src/index.html.js";
document.head.append(head(pkg, path_target));
document.body.append(body(pkg));
document.body.append(
	el("script", { src: "https://cdn.jsdelivr.net/npm/shiki" }),
	el("script", { src: "index.js", type: "module" })
);

s.echo(ssr.serialize()).to(path_target.html);
s.echo(css.content).to(path_target.css+"index.css");
