#!/usr/bin/env -S npx nodejsscript
import { bundle as bundleDTS } from "dts-bundler";
const files= [ "index", "index-with-signals" ];
const filesOut= (file, mark= "esm")=> "dist/"+file.replace("index", mark);
const css= echo.css`
	.info{ color: gray; }
`;

$.api("", true)
.option("--minify", "Level of minification [ full, partial (default) ]")
.action(async function main({ minify= "partial" }){
	for(const file_root of files){
		const file= file_root+".js";
		echo("Processing: "+ file);
		const out= filesOut(file);
		const esbuild_output= s.$().run([
			"npx esbuild '::file::'",
			"--platform=neutral",
			"--bundle",
			//minify==="full" ? "--minify" : "--minify-syntax --minify-identifiers",
			"--legal-comments=inline",
			"--packages=external",
			"--outfile='::out::'"
		].join(" "), { file, out });
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
		
		await toDDE(out, file_root);
	}
	$.exit(0);

	async function toDDE(file, file_root){
		const name= "dde";
		const out= filesOut(file_root+".js", name);
		echoVariant(`${out} (${file} → globalThis.${name})`)
		
		let content= s.cat(file).toString().split(/export ?{/);
		content.splice(1, 0, `\nglobalThis.${name}= {`);
		content[2]= content[2].replace(/,(?!\n)/g, ",\n").replace(/(?<!\n)}/, "\n}").replace(/^(\t*)(.*) as ([^,\n]*)(,?)$/mg, "$1$3: $2$4");
		s.echo([
			`//deka-dom-el library is available via global namespace \`${name}\``,
			"(()=> {",
			content.join(""),
			"})();"
		].join("\n")).to(out);
	}
})
.parse();

function echoVariant(name){
	return echo("%c✓ "+name, css.info+css);
}
