#!/usr/bin/env -S npx nodejsscript
const files= [ "index.js", "index-with-signals.js" ];
const filesOut= (file, mark= "esm")=> "dist/"+file.replace("index", mark);

for(const file of files){
	const out= filesOut(file);
	s.run([
		"npx esbuild '::file::'",
		"--platform=neutral",
		"--bundle",
		//"--minify",
		"--minify-syntax --minify-identifiers",
		"--legal-comments=inline",
		"--packages=external",
		"--outfile='::out::'"
	].join(" "), { file, out });
	pipe(
		f=> f.replace(/^ +/gm, m=> "\t".repeat(m.length/2)),
		f=> s.echo(f).to(out)
	)(s.cat(out));
	toDDE(out, filesOut(file, "dde"));
}
$.exit(0);

function toDDE(file, out){
	const name= "dde";
	echo(`\n  ${out} (${file} → globalThis.${name})\n`);
	
	let content= s.cat(file).toString().split(/export ?{/);
	content.splice(1, 0, `\nglobalThis.${name}= {`);
	content[2]= content[2].replace(/^(\t*)(.*) as ([^,\n]*)(,?)$/mg, "$1$3: $2$4");
	s.echo([
		`//deka-dom-el library is available via global namespace \`${name}\``,
		"(()=> {",
		"\t"+content.join("").split("\n").join("\n	"),
		"})();"
	].join("\n")).to(out);
	
	echo("⚡ Done\n");
}
