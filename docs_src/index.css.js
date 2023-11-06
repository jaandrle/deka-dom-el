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
nav a.current {
  color: var(--accent) !important;
  border-color: var(--accent) !important;
}
.icon {
	vertical-align: sub;
	padding-right: .25rem;
	display: inline-block;
	width: 1em;
	height: 1.3em;
	margin-right: 0.2rem;
	stroke-width: 0;
	stroke: currentColor;
	fill: currentColor;
}
`;
