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
:root {
	color-scheme: dark light;
	--body-max-width: 40rem;
}
*, ::before, ::after { box-sizing: border-box; }
body > * {
	margin-inline: max(.5rem, calc(50% - var(--body-max-width) / 2));
	font-family: Tahoma, Verdana, Arial, sans-serif;
}
h1{
	text-align: center;
	text-wrap: balanc;
}
`;
