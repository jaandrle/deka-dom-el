#!/usr/bin/env -S npx nodejsscript
import { analyzeMetafileSync, buildSync as esbuildSync } from "esbuild";
const css= echo.css`
	.info{ color: gray; }
`;

export function build({ files, filesOut, minify= "partial", iife= true, types= true }){
	for(const file_root of files){
		const file= file_root+".js";
		echo(`Processing ${file} (minified: ${minify})`);
		const out= filesOut(file);
		esbuild({ file, out, minify });

		if(types){
			const file_dts= file_root+".d.ts";
			const file_dts_out= filesOut(file_dts);
			echoVariant(file_dts_out, true);
			buildDts({
				bundle: out,
				entry: file_dts,
			});
			echoVariant(file_dts_out);
		}

		if(iife) toIIFE(file, file_root, types);
	}
	return 0;

	function toIIFE(file, file_root, types){
		const fileMark= "iife";
		const name= "DDE";
		const out= filesOut(file_root+".js", fileMark);

		const params= {
			format: "iife",
			globalName: name
		};
		esbuild({ file, out, minify, params });

		if(!types) return;
		const file_dts= file_root+".d.ts";
		const file_dts_out= filesOut(file_dts, fileMark);
		echoVariant(file_dts_out, true);
		buildDts({
			name: fileMark,
			bundle: out,
			entry: file_dts,
		})
		echoVariant(file_dts_out);
	}
}
export function buildDts({ bundle, entry, name }){
	const out= bundle.slice(0, bundle.lastIndexOf("."))+".d.ts";
	const dts_b_g_output= s.run([
		"npx dts-bundle-generator",
		"--silent",
		"-o ::out::",
		!name ? false : ("--umd-module-name "+name),
		"--inline-declare-global",
		"::entry::"
	].filter(Boolean).join(" "), { out, entry });
	return dts_b_g_output;
}
export function esbuild({ file, out, minify= "partial", params= {} }){
	const esbuild_output= esbuildSync({
		entryPoints: [file],
		outfile: out,
		platform: "neutral",
		bundle: true,
		legalComments: "inline",
		packages: "external",
		metafile: true,
		...minifyOption(minify),
		...params
	});
	pipe(
		f=> f.replace(/^ +/gm, m=> "\t".repeat(m.length/2)),
		f=> s.echo(f).to(out)
	)(s.cat(out));

	echoVariant(metaToLineStatus(esbuild_output.metafile, out));
	return esbuild_output;
}
/** @param {"no"|"full"|"partial"} level */
function minifyOption(level= "partial"){
	if("no"===level) return { minify: false };
	if("full"===level) return { minify: true };
	return { minifySyntax: true, minifyIdentifiers: true };
}
function metaToLineStatus(meta, file){
	const status= meta.outputs[file];
	if(!status) return `? ${file}: unknown`;
	const { bytes }= status;
	const kbytes= bytes/1024;
	const kbytesR= kbytes.toFixed(2);
	return `${file}: ${kbytesR} KiB`;
}
function echoVariant(name, todo= false){
	if(todo) return echo.use("-R", "~ "+name);
	return echo("%c✓ "+name, css.info);
}
