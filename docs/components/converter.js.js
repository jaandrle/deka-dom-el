import { el, on } from "deka-dom-el";
import { S } from "deka-dom-el/signals";
const { parse }= globalThis.BFS || { parse(){ return { children: [ "not implemented" ] } } };
// Example HTML snippets
const examples = [
{
	name: "Simple Component",
	html: `<div class="card">
	<img src="image.jpg" alt="Card Image" class="card-image">
	<h2 class="card-title">Card Title</h2>
	<p class="card-text">This is a simple card component</p>
	<button aria-pressed="mixed" type="button" class="card-button">Click Me</button>
</div>`
},
{
	name: "Navigation",
	html: `<nav class="main-nav">
	<ul>
		<li><a href="/" class="active">Home</a></li>
		<li><a href="/about">About</a></li>
		<li><a href="/services">Services</a></li>
		<li><a href="/contact">Contact</a></li>
	</ul>
</nav>`
},
{
	name: "Form",
	html: `<form class="contact-form" onsubmit="submitForm(event)">
	<div class="form-group">
		<label for="name">Name:</label>
		<input type="text" id="name" name="name" required>
	</div>
	<div class="form-group">
		<label for="email">Email:</label>
		<input type="email" id="email" name="email" required>
	</div>
	<div class="form-group">
		<label for="message">Message:</label>
		<textarea id="message" name="message" rows="4" required></textarea>
	</div>
	<button type="submit" class="submit-btn">Send Message</button>
</form>`
}
];

// Convert HTML to dd<el> code
function convertHTMLtoDDE(html, options = {}) {

	try {
		const parsed = parse(html);
		return nodeToDDE(parsed.children[0], options);
	} catch (error) {
		console.error("Parsing error:", error);
		return `// Error parsing HTML: ${error.message}`;
	}
}

// Node types based on standard DOM nodeType values
const NODE_TYPE = {
	ELEMENT: 1,      // Standard element node (equivalent to node.type === "element")
	TEXT: 3,         // Text node (equivalent to node.type === "text")
	COMMENT: 8       // Comment node (equivalent to node.type === "comment")
};

// Convert a parsed node to dd<el> code
function nodeToDDE(node, options = {}, level = 0) {
	const { nodeType } = node;
	// Handle text nodes
	if (nodeType === NODE_TYPE.TEXT) {
		const text = node.nodeValue;
		if (!text.trim()) return null;

		// Return as plain text or template string for longer text
		return text.includes("\n") || text.includes('"')
			? `\`${text}\``
			: `"${text}"`;
	}

	// Handle comment nodes
	if (nodeType === NODE_TYPE.COMMENT) {
		return null; // TODO: Skip comments?
	}

	// For element nodes
	if (nodeType === NODE_TYPE.ELEMENT) {
		const tab= options.indent === "-1" ? "\t" : " ".repeat(options.indent);
		const indent = tab.repeat(level);
		const nextIndent = tab.repeat(level + 1);

		// Special case for SVG elements
		const isNS = node.tagName === "svg";
		const elFunction = isNS ? "elNS" : "el";

		// Get tag name
		let tagStr = `"${node.tagName}"`;

		// Process attributes
		const attrs = [];
		const sets = {
			aria: {},
			data: {},
		}

		for (const { name: key, value } of node.attributes) {
			// Handle class attribute
			if (key === "class") {
				attrs.push(`className: "${value}"`);
				continue;
			}

			// Handle style attribute
			if (key === "style") {
				if (options.styleAsObject) {
				// Convert inline style to object
				const styleObj = {};
				value.split(";").forEach(part => {
					const [propRaw, valueRaw] = part.split(":");
					if (propRaw && valueRaw) {
						const prop = propRaw.trim();
						const propCamel = prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
						styleObj[propCamel] = valueRaw.trim();
					}
				});

				if (Object.keys(styleObj).length > 0) {
					const styleStr = JSON.stringify(styleObj).replace(/"([^"]+)":/g, "$1:");
					attrs.push(`style: ${styleStr}`);
				}
				} else {
					// Keep as string
					attrs.push(`style: "${value}"`);
				}
				continue;
			}

			// Handle boolean attributes
			if (value === "" || value === key) {
				attrs.push(`${key}: true`);
				continue;
			}

			// Handle data/aria attributes
			if (key.startsWith("data-") || key.startsWith("aria-")) {
				const keyName = key.startsWith("aria-") ? "aria" : "data";
				const keyCamel = key.slice(keyName.length + 1).replace(/-([a-z])/g, (_, c) => c.toUpperCase());
				sets[keyName][keyCamel] = value;
				continue;
			}

			// Regular attributes
			const keyRegular = key==="for"
				? "htmlFor"
				: key.startsWith("on")
				? `"=${key}"`
				: key.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
			attrs.push(`${keyRegular}: "${value}"`);
		}

		// Process sets
		for (const [name, set] of Object.entries(sets)) {
		if(options.dataAttrsAsCamel)
			for (const [key, value] of Object.entries(set))
			attrs.push(`${name}${key[0].toUpperCase() + key.substring(1)}: "${value}"`);
		else {
			const setStr= Object.entries(set).map(([key, value]) => `${key}: "${value}"`).join(",");
			if (setStr !== "")
			attrs.push(`${name}set: { ${setStr} }`);
		}
		}

		// Process children
		const children = [];
		for (const child of node.childNodes) {
		const childCode = nodeToDDE(child, options, level + 1);
		if (childCode) children.push(childCode);
		}
		if(children.length===1 && node.childNodes[0].nodeType===NODE_TYPE.TEXT){
		const textContent= children.pop().slice(1, -1);
		attrs.unshift(`textContent: "${textContent}"`);
		}

		// Build the element creation code
		let result = `${elFunction}("${node.tagName.toLowerCase()}"`;

		// Add attributes if any
		if (attrs.length > 0) {
		const tooLong= attrs.join(``).length+result.length > 55;
		if(options.expaned || tooLong || attrs.length > 3)
			result += `, {\n${nextIndent}${attrs.join(`,\n${nextIndent}`)},\n${indent}}`;
		else
			result += `, { ${attrs.join(", ")} }`;
		} else if (children.length > 0) {
		result += ", null";
		}

		// Add children if any
		if (children.length > 0) {
		result += `).append(\n${nextIndent}${children.join(`,\n${nextIndent}`)},\n${indent})`;
		} else {
		result += ")";
		}

		return result;
	}

	return null;
}

export function converter() {
	// State for the converter
	const htmlInput = S(examples[0].html);
	const error = S("");

	const status = S("");
	const showStatus= msg => {
		status.set(msg);
		// Clear status after 3 seconds
		setTimeout(() => status.set(""), 3000);
	};

	// Options state
	const options = {
		styleAsObject: {
			title: "Convert style to object",
			value: S(true),
		},
		dataAttrsAsCamel: {
			title: "dataKey/ariaKey (or dataset/ariaset)",
			value: S(true),
		},
		indent: {
			title: "Indentation (-1 for tabs)",
			value: S("-1"),
			type: "number",
		},
		expaned: {
			title: "Force multiline",
			value: S(false),
		}
	};
	const getOptions = ()=> Object.fromEntries(Object.entries(options)
		.map(([key, option]) => ([
			key,
			option.value.get()
		]))
	);

	// Update the dd<el> output when input or options change
	const ddeOutput = S(() => {
		try {
			const result = convertHTMLtoDDE(htmlInput.get(), getOptions());
			error.set("");
			return result;
		} catch (err) {
			error.set(`Error: ${err.message}`);
			return "";
		}
	});

	// Event handlers
	const onConvert = on("submit", e => {
		e.preventDefault();
		htmlInput.set(htmlInput.get(), true);
		showStatus("Converted!");
	});

	const onCopy = on("click", async () => {
		if (!ddeOutput.get()) return;

		try {
			await navigator.clipboard.writeText(ddeOutput.get());
			showStatus("Copied to clipboard!");
		} catch (err) {
			error.set(`Could not copy: ${err.message}`);
		}
	});
	const onClear = on("click", () => {
		htmlInput.set("");
		showStatus("Input cleared");
	});
	const onExampleLoad = (example) => on("click", () => {
		htmlInput.set(example.html);
		showStatus(`Loaded "${example.name}" example`);
	});

	const optionsElements = () => Object.entries(options)
		.map(([key, option]) =>
			el("label", { className: "option-group" }).append(
				option.type==="number"
					? el("input", {
						type: option.type || "checkbox",
						name: key,
						value: option.value.get(),
						max: 10,
					}, on("change", e => option.value.set(e.target.value)))
					: el("input", {
						type: option.type || "checkbox",
						name: key,
						checked: option.value.get(),
					}, on("change", e => option.value.set(e.target.checked))),
				option.title,
			)
	);
	const exampleButtons = examples.map(example =>
		el("button", {
			type: "button",
			className: "secondary example-button"
		}, onExampleLoad(example)).append(example.name)
	);

	return el("div", { id: "html-to-dde-converter" }).append(
		el("h3", "HTML to dd<el> Converter"),
		el("p", { className: "description" }).append(
			"Convert HTML markup to dd<el> JavaScript code. Paste your HTML below or choose from an example."
		),

		el("form", { className: "converter-form" }, onConvert).append(
			el("div", { className: "options" }).append(...optionsElements()),

			el("div", { className: "examples-list" }).append(
				el("label", "Examples: "),
				...exampleButtons
			),

			el("div", { className: "editor-container" }).append(
				el("div", { className: "input-group" }).append(
					el("label", { htmlFor: "html-input" }).append(
						"HTML Input",
						el("div", { className: "button-group" }).append(
							el("button", {
								type: "button",
								className: "secondary",
								title: "Clear input"
							}, onClear).append("Clear")
						)
					),
					el("textarea", {
						id: "html-input",
						spellcheck: false,
						value: htmlInput,
						placeholder: "Paste your HTML here or choose an example",
						oninput: e => htmlInput.set(e.target.value)
					})
				),

				el("div", { className: "output-group" }).append(
					el("label", { htmlFor: "dde-output" }).append(
						"dd<el> Output",
						el("div", { className: "button-group" }).append(
							el("button", {
								type: "button",
								className: "copy-button",
								title: "Copy to clipboard",
								disabled: S(() => !ddeOutput.get())
							}, onCopy).append("Copy")
						)
					),
					el("textarea", {
						id: "dde-output",
						readonly: true,
						spellcheck: false,
						placeholder: "The converted dd<el> code will appear here",
						value: S(() => ddeOutput.get() || "// Convert HTML to see results here")
					})
				)
			),

			el("div", { className: "button-group" }).append(
				S.el(error, error => !error ? el() : el("div", { className: "error" }).append(error)),
				el("div", { className: "status", textContent: status }),
				el("button", { type: "submit" }).append("Convert")
			)
		)
	);
}
