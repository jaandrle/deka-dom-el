#!/usr/bin/env -S npx nodejsscript
const css= echo.css`
	.info{ color: gray; }
`;

export function build({ files, filesOut, minify= "partial", iife= true, types= true }){
	for(const file_root of files){
		const file= file_root+".js";
		echo(`Processing ${file} (minified: ${minify})`);
		const out= filesOut(file);
		const esbuild_output= buildEsbuild({ file, out, minify });
		echoVariant(esbuild_output.stderr.split("\n")[1].trim());

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

		const params= [
			"--format=iife",
			"--global-name="+name,
		];
		const dde_output= buildEsbuild({ file, out, minify, params });
		echoVariant(`${out} (${name})`)

		if(!types) return dde_output;
		const file_dts= file_root+".d.ts";
		const file_dts_out= filesOut(file_dts, fileMark);
		echoVariant(file_dts_out, true);
		buildDts({
			name: fileMark,
			bundle: out,
			entry: file_dts,
		})
		echoVariant(file_dts_out);

		return dde_output;
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
class ErrorEsbuild extends Error{
	constructor({ code, stderr }){
		super(stderr);
		this.code= code;
		this.stderr= stderr;
	}
}
function buildEsbuild({ file, out, minify= "partial", params= [] }){
	try {
		return esbuild({ file, out, minify, params });
	} catch(e){
		if(e instanceof ErrorEsbuild)
			return $.exit(e.code, echo(e.stderr));
		throw e;
	}
}
export function esbuild({ file, out, minify= "partial", params= [] }){
	const esbuild_output= s.$().run([
		"npx esbuild '::file::'",
		"--platform=neutral",
		"--bundle",
		minifyOption(minify),
		"--legal-comments=inline",
		"--packages=external",
		...params,
		"--outfile='::out::'"
	].filter(Boolean).join(" "), { file, out });
	if(esbuild_output.code)
		throw new ErrorEsbuild(esbuild_output);
	pipe(
		f=> f.replace(/^ +/gm, m=> "\t".repeat(m.length/2)),
		f=> s.echo(f).to(out)
	)(s.cat(out));
	return esbuild_output;
}
/** @param {"no"|"full"|"partial"} level */
function minifyOption(level= "partial"){
	if("no"===level) return undefined;
	if("full"===level) return "--minify";
	return "--minify-syntax --minify-identifiers";
}
function echoVariant(name, todo= false){
	if(todo) return echo.use("-R", "~ "+name);
	return echo("%c✓ "+name, css.info);
}
