import { el, scope, on, dispatchEvent } from "deka-dom-el";
document.body.append(
	el(component)
);
function component(){
	const { host }= scope; // good practise!

	host(
		console.log,
		on("click", function redispatch(){
			// this `host` ↘ still corresponds to the host ↖ of the component
			dispatchEvent("redispatch")(host());
		})
	);
	// this `host` ↘ still corresponds to the host ↖ of the component
	setTimeout(()=> dispatchEvent("timeout")(host()), 750)
	return el("p", "Clickable paragraph!");
}
