#!/usr/bin/env -S npx nodejsscript
import { bundle as bundleDTS } from "dts-bundler";
import compressing from "compressing";
const files= [ "index", "index-with-signals" ];
const filesOut= (file, mark= "esm")=> "dist/"+file.replace("index", mark);

$.api("", true)
.option("--minify", "Level of minification [ full (default), partial ]")
.action(async function main({ minify= "full" }){
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

		const file_gzip_out= filesOut(file_root+".gzip.js");
		echo(`  ${file_gzip_out}`)
		await compressing.gzip.compressFile(out, file_gzip_out);

		const file_dts= file_root+".d.ts";
		const file_dts_out= filesOut(file_dts);
		echo(`  ${file_dts_out}`)
		s.echo(bundleDTS(file_dts)).to(file_dts_out);
		
		await toDDE(out, file_root);
	}
	$.exit(0);

	async function toDDE(file, file_root){
		const name= "dde";
		const out= filesOut(file_root+".js", name);
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

		const out_gzip= filesOut(file_root+".gzip.js", name);
		echo(`  ${out_gzip}`);
		await compressing.gzip.compressFile(out, out_gzip);
	}
})
.parse();
