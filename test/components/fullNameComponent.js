import { style, el, on, S } from '../exports.js';
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
		name.map(l=> l()).filter(Boolean).join(" ") || "-");

	return el("div", { className }).append(
		el("h2", "Simple form:"),
		el("form", { onsubmit: ev=> ev.preventDefault() }).append(
			...name.map((v, i)=>
				el("label", labels[i]).append(
					el("input", { type: "text", name: labels[i], value: v() }, on("change", ev=> v(ev.target.value)))
				))
		),
		el("p").append(
			el("strong", "Full name"),
			": ",
			el("#text", full_name)
		)
	);
}
