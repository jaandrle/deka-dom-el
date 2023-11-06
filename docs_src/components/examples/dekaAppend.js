import { el } from "../../../index-with-signals.js";
document.head.append(
	el("style").append(
		"tr, td{ border: 1px solid red; padding: 1em; }",
		"table{ border-collapse: collapse; }"
	)
);
document.body.append(
	el("p", "Example of a complex template. Using for example nesting lists:"),
	el("ul").append(
		el("li", "List item 1"),
		el("li").append(
			el("ul").append(
				el("li", "Nested list item 1"),
			)
		)
	),
	el("table").append(
		el("tr").append(
			el("td", "Row 1 – Col 1"),
			el("td", "Row 1 – Col 2")
		)
	)
);
