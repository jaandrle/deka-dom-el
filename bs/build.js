#!/usr/bin/env -S npx nodejsscript
import { bundle as bundleDTS } from "dts-bundler";
const files= [ "index", "index-with-signals" ];
const filesOut= (file, mark= "esm")=> "dist/"+file.replace("index", mark);

$.api("", true)
.option("--minify", "Level of minification [ full (default), partial ]")
.action(function main({ minify= "full" }){
	for(const file_root of files){
		const file= file_root+".js";
		const out= filesOut(file);
		s.run([
			"npx esbuild '::file::'",
			"--platform=neutral",
			"--bundle",
			minify==="full" ? "--minify" : "--minify-syntax --minify-identifiers",
			"--legal-comments=inline",
			"--packages=external",
			"--outfile='::out::'"
		].join(" "), { file, out });
		pipe(
			f=> f.replace(/^ +/gm, m=> "\t".repeat(m.length/2)),
			f=> s.echo(f).to(out)
		)(s.cat(out));
		const file_dts= file_root+".d.ts";
		const file_dts_out= filesOut(file_dts);
		echo(`  ${file_dts_out}`)
		s.echo(bundleDTS(file_dts)).to(file_dts_out);
		echo("⚡ Done");
		toDDE(out, filesOut(file, "dde"));
	}
	$.exit(0);

	function toDDE(file, out){
		const name= "dde";
		echo(`  ${out} (${file} → globalThis.${name})`);
		
		let content= s.cat(file).toString().split(/export ?{/);
		content.splice(1, 0, `\nglobalThis.${name}= {`);
		content[2]= content[2].replace(/,(?!\n)/g, ",\n").replace(/(?<!\n)}/, "\n}").replace(/^(\t*)(.*) as ([^,\n]*)(,?)$/mg, "$1$3: $2$4");
		s.echo([
			`//deka-dom-el library is available via global namespace \`${name}\``,
			"(()=> {",
			content.join(""),
			"})();"
		].join("\n")).to(out);
		
		echo("⚡ Done");
	}
})
.parse();
