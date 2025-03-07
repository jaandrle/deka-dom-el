#!/usr/bin/env -S npx nodejsscript
import { build } from "./dev/.build.js"
const files= [ "index", "index-with-signals" ];

$.api("")
.command("main", "Build main files", { default: true })
.action(async function main(){
	const regular = await build({
		files,
		filesOut,
		minify: "no",
	});
	const min = await build({
		files,
		filesOut(file, mark= "esm"){
			const out= filesOut(file, mark);
			const idx= out.lastIndexOf(".");
			return out.slice(0, idx)+".min"+out.slice(idx);
		},
		minify: "full",
	});
	return $.exit(regular + min);
})
.command("signals", "Build only signals (for example for analysis)")
.action(async function signals(){
	const regular = await build({
		files: [ "signals" ],
		filesOut(file){ return "dist/."+file; },
		minify: "no",
		iife: false,
	});
	return $.exit(regular);
})
.parse();


function filesOut(file, mark= "esm"){ return "dist/"+file.replace("index", mark); }
