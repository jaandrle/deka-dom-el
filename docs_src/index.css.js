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
	:root {
		--accent: #f06292;
		--code: #62c1f0;
	}
}
body {
	grid-template-columns: 100%;
	grid-template-areas: "header" "sidebar" "content";
}
@media (min-width:768px) {
	body{
		grid-template-rows: auto auto;
		grid-template-columns: calc(var(--body-max-width) / 3) auto;
		grid-template-areas:
			"header header"
			"sidebar content"
	}
}
body > *{
	grid-column: unset;
}
body > header{
	grid-area: header;
	padding: 0;
}
body > nav{
	grid-area: sidebar;
	background-color: var(--accent-bg);
	display: flex;
	flex-flow: column nowrap;
}
body > nav {
	font-size:1rem;
	line-height:2;
	padding:1rem 0 0 0
}
body > nav ol,
body > nav ul {
	align-content:space-around;
	align-items:center;
	display:flex;
	flex-direction:row;
	flex-wrap:wrap;
	justify-content:center;
	list-style-type:none;
	margin:0;
	padding:0
}
body > nav ol li,
body > nav ul li {
	display:inline-block
}
body > nav a,
body > nav a:visited {
	margin: 0 .5rem 1rem .5rem;
	border: 1px solid currentColor;
	border-radius: var(--standard-border-radius);
	color: var(--text-light);
	display: inline-block;
	padding: .1rem 1rem;
	text-decoration: none;
	cursor: pointer;
	transition: all .15s;
}
body > nav a.current,
body > nav a[aria-current=page] {
	background-color: var(--bg);
	color: var(--text);
}
body > nav a:hover{
	background-color: var(--bg);
	color: var(--accent);
}
@media only screen and (max-width:720px) {
	body > nav{
		flex-flow: row wrap;
		padding-block: .5rem;
	}
	body > nav a {
		border:none;
		text-decoration:underline;
		margin-block: .1rem;
		padding-block:.1rem;
		line-height: 1rem;
		font-size: .9rem;
	}
}
main{
	grid-area: content;
	display: grid;
	grid-template-columns: 1fr min(var(--body-max-width), 90%) 1fr;
}
main > *{
	grid-column: 2;
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
