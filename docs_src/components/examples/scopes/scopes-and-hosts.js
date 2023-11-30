import { el, on, scope } from "deka-dom-el";
const { host }= scope;
host(
	element=> console.log(
		"This represents Addon/oninit for root",
		element.outerHTML
	)
);
console.log(
	"This represents the reference to the host element of root",
	host().outerHTML
);
document.body.append(
	el(component)
);
function component(){
	const { host }= scope;
	host(
		element=> console.log(
			"This represents Addon/oninit for the component",
			element.outerHTML
		)
	);
	const onclick= on("click", function(ev){
		console.log(
			"This represents the reference to the host element of the component",
			host().outerHTML
		);
	})
	return el("div", null, onclick).append(
		el("strong", "Component")
	);
}
