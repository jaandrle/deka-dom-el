try {
	// Initialize Shiki with our custom theme
	const highlighter = await globalThis.shiki.getHighlighter({
		theme: "css-variables",
		langs: ["javascript", "typescript", "css", "html", "shell"],
	});

	// Find all code blocks that need highlighting
	const codeBlocks = document.querySelectorAll('div[data-js="todo"] code[class*="language-"]');

	// Process each code block
	codeBlocks.forEach((block) => {
		try {
			// Get the language from the class
			const langClass = block.className.match(/language-(\w+)/);

			// Map the language to Shiki format
			let lang = langClass ? langClass[1] : 'javascript';
			if (lang === 'js') lang = 'javascript';
			if (lang === 'ts') lang = 'typescript';

			// Mark the container as processed
			block.parentElement.dataset.js = "done";

			// Highlight the code
			const code = block.textContent;
			const html = highlighter.codeToHtml(code, { lang });

			// Insert the highlighted HTML
			block.innerHTML = html;

			// Add copy button functionality
			const copyBtn = document.createElement('button');
			copyBtn.className = 'copy-button';
			copyBtn.textContent = 'Copy';
			copyBtn.setAttribute('aria-label', 'Copy code to clipboard');
			copyBtn.addEventListener('click', () => {
				navigator.clipboard.writeText(code).then(() => {
					copyBtn.textContent = 'Copied!';
					setTimeout(() => {
						copyBtn.textContent = 'Copy';
					}, 2000);
				});
			});

			// Add the copy button to the code block container
			block.parentElement.appendChild(copyBtn);
		} catch (err) {
			console.error('Error highlighting code block:', err);
			// Make sure we don't leave the block in a pending state
			block.parentElement.dataset.js = "error";
		}
	});
} catch (err) {
	console.error('Failed to initialize Shiki:', err);

	// Fallback: at least mark blocks as processed so they don't show loading indicator
	document.querySelectorAll('div[data-js="todo"]').forEach(block => {
		block.dataset.js = "error";
	});
}
