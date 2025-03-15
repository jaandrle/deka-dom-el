#!/usr/bin/env -S npx nodejsscript
import { build } from "./dev/.build.js"
const files= [ "index", "index-with-signals" ];

$.api("")
.command("main", "Build main files", { default: true })
.option("--no-types", "Also generate d.ts files", false)
.action(function main({ types }){
	const regular = build({
		files,
		filesOut,
		minify: "no",
		types,
	});
	const min = build({
		files,
		filesOut(file, mark= "esm"){
			const out= filesOut(file, mark);
			const idx= out.indexOf(".");
			return out.slice(0, idx)+".min"+out.slice(idx);
		},
		minify: "full",
		types,
	});
	return $.exit(regular + min);
})
.command("signals", "Build only signals (for example for analysis)")
.action(function signals(){
	const regular = build({
		files: [ "signals" ],
		filesOut(file){ return "dist/."+file; },
		minify: "no",
		iife: false,
	});
	return $.exit(regular);
})
.parse();


function filesOut(file, mark= "esm"){ return "dist/"+file.replace("index", mark); }
