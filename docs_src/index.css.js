const scopes= new WeakSet();
const s= {
	scope(s){
		if(!scopes.has(s)){
			scopes.add(s);
			this.host= s.name;
		}
		return this;
	},
	css(...a){
		let c= css(...a);
		if(this.host){
			c= c.replaceAll(":host", "."+this.host);
			this.host= "";
		}
		if(this.content) this.content+= "\n";
		this.content+= c;
		return this;
	},
	include(...i){
		if(this.content) this.content+= "\n";
		this.content+= i.map(i=> typeof i === "string" ? i : i.content).join("\n");
		return this;
	}
};
export function css(...a){
	return String.raw(...a).trim();
}
export function styles(){ return Object.assign(Object.create(s), { content: "" }); }
export const common= css`
@import url(https://cdn.simplecss.org/simple.min.css);
:root{
	--body-max-width: 45rem;
	--marked: #fb3779;
	--code: #0d47a1;
	--accent: #d81b60;
}
@media (prefers-color-scheme:dark) {
    ::backdrop, :root {
		--accent: #f06292;
		--code: #62c1f0;
	}
}
body {
	grid-template-columns: 1fr min(var(--body-max-width), 90%) 1fr;
}
h1{
	text-align: center;
	text-wrap: balanc;
	grid-column: 1 / 4;
}
`;
