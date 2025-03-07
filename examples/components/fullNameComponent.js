import { style, el, elNS, on, S, scope } from '../exports.js';
const className= style.host(fullNameComponent).css`
	:host form{
		display: flex;
		flex-flow: column nowrap;
	}
`;
export function fullNameComponent(){
	const labels= [ "Name", "Surname" ];
	const name= labels.map(_=> S(""));
	const full_name= S(()=>
		name.map(l=> l.get()).filter(Boolean).join(" ") || "-");
	scope.host(
		on.connected(()=> console.log(fullNameComponent)),
		on.disconnected(()=> console.log(fullNameComponent))
	);

	const count= S(0);
	setInterval(()=> count.set(count.get()+1), 5000);
	const style= { height: "80px", display: "block", fill: "currentColor" };
	const elSVG= elNS("http://www.w3.org/2000/svg");
	return el("div", { className }).append(
		el("h2", "Simple form:"),
		el("p", { textContent: S(()=> "Count: "+count.get()),
			dataset: { count }, classList: { count: S(() => count.get()%2 === 0) } }),
		el("form", { onsubmit: ev=> ev.preventDefault() }).append(
			...name.map((v, i)=>
				el("label", labels[i]).append(
					el("input", { type: "text", name: labels[i], value: v.get() }, on("change", ev=> v.set(ev.target.value)))
				))
		),
		el("p").append(
			el("strong", "Full name"),
			": ",
			el("#text", full_name)
		),
		elSVG("svg", { viewBox: "0 0 240 80", style }).append(
			//elSVG("style", {  })
			elSVG("text", { x: 20, y: 35, textContent: "Text" }),
		)
	);
}
