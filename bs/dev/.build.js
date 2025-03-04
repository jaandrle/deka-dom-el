#!/usr/bin/env -S npx nodejsscript
import { bundle as bundleDTS } from "dts-bundler";
const css= echo.css`
	.info{ color: gray; }
`;

export async function build({ files, filesOut, minify= "partiala", dde= true }){
	for(const file_root of files){
		const file= file_root+".js";
		echo(`Processing ${file} (minified: ${minify})`);
		const out= filesOut(file);
		const esbuild_output= s.$().run([
			"npx esbuild '::file::'",
			"--platform=neutral",
			"--bundle",
			minifyOption(minify),
			"--legal-comments=inline",
			"--packages=external",
			"--outfile='::out::'"
		].filter(Boolean).join(" "), { file, out });
		if(esbuild_output.code)
			return $.exit(esbuild_output.code, echo(esbuild_output.stderr));
		echoVariant(esbuild_output.stderr.split("\n")[1].trim()+ " (esbuild)");
		pipe(
			f=> f.replace(/^ +/gm, m=> "\t".repeat(m.length/2)),
			f=> s.echo(f).to(out)
		)(s.cat(out));

		const file_dts= file_root+".d.ts";
		const file_dts_out= filesOut(file_dts);
		echoVariant(file_dts_out);
		s.echo(bundleDTS(file_dts)).to(file_dts_out);

		if(dde) await toDDE(out, file_root);
	}
	return 0;

	async function toDDE(file, file_root){
		const name= "dde";
		const out= filesOut(file_root+".js", name);
		echoVariant(`${out} (${file} → globalThis.${name})`)

		let content= s.cat(file).toString().split(/export ?{/);
		content.splice(1, 0, `\nglobalThis.${name}= {`);
		content[2]= content[2]
			.replace(/,(?!\n)/g, ",\n")
			.replace(/(?<!\n)}/, "\n}")
			.replace(/^(\t*)(.*) as ([^,\n]*)(,?)$/mg, "$1$3: $2$4");
		s.echo([
			`//deka-dom-el library is available via global namespace \`${name}\``,
			"(()=> {",
			content.join(""),
			"})();"
		].join("\n")).to(out);
	}
}
/** @param {"no"|"full"|"partial"} level */
function minifyOption(level= "partial"){
	if("no"===level) return undefined;
	if("full"===level) return "--minify";
	return "--minify-syntax --minify-identifiers";
}
function echoVariant(name){
	return echo("%c✓ "+name, css.info+css);
}
