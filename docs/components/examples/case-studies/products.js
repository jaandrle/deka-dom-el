import { el, on, scope } from "deka-dom-el";
import { S } from "deka-dom-el/signals";

export function ProductCatalog() {
	const { signal }= scope;

	const itemsPerPage = 5;
	const products = asyncSignal(S,
		fetchProducts,
		{ initial: [], keepLast: true, signal });
	const searchTerm = S("");
	const handleSearch = (e) => searchTerm.set(e.target.value);
	const sortOrder = S("default");
	const handleSort = (e) => sortOrder.set(e.target.value);
	const page = S(1);
	const handlePageChange = (newPage) => page.set(newPage);
	const resetFilters = () => {
		searchTerm.set("");
		sortOrder.set("default");
		page.set(1);
	};

	const filteredProducts = S(() => {
		if (products.status.get() !== "resolved") return [];

		const results = products.result.get().filter(product =>
			product.title.toLowerCase().includes(searchTerm.get().toLowerCase()) ||
			product.description.toLowerCase().includes(searchTerm.get().toLowerCase())
		);

		return [...results].sort((a, b) => {
			const order = sortOrder.get();
			if (order === "price-asc") return a.price - b.price;
			if (order === "price-desc") return b.price - a.price;
			if (order === "rating") return b.rating - a.rating;
			return 0; // default: no sorting
		});
	});
	const totalPages = S(() => Math.ceil(filteredProducts.get().length / itemsPerPage));
	const paginatedProducts = S(() => {
		const currentPage = page.get();
		const filtered = filteredProducts.get();
		const start = (currentPage - 1) * itemsPerPage;
		return filtered.slice(start, start + itemsPerPage);
	});

	// Component structure
	return el("div", { className: "product-catalog" }).append(
		el("header", { className: "catalog-header" }).append(
			el("h2", "Product Catalog"),
			el("div", { className: "toolbar" }).append(
				el("button", {
					className: "refresh-btn",
					textContent: "Refresh Products",
					type: "button",
					onclick: () => products.invoke(),
				}),
				el("button", {
					className: "reset-btn",
					textContent: "Reset Filters",
					type: "button",
					onclick: resetFilters,
				})
			)
		),

		// Search and filter controls
		el("div", { className: "controls" }).append(
			el("div", { className: "search-box" }).append(
				el("input", {
					type: "search",
					placeholder: "Search products...",
					value: searchTerm,
					oninput: handleSearch,
				})
			),
			el("div", { className: "sort-options" }).append(
				el("label", "Sort by: "),
				el("select", { onchange: handleSort }, on.defer(el => el.value = sortOrder.get())).append(
					el("option", { value: "default", textContent: "Default" }),
					el("option", { value: "price-asc", textContent: "Price: Low to High" }),
					el("option", { value: "price-desc", textContent: "Price: High to Low" }),
					el("option", { value: "rating", textContent: "Top Rated" })
				)
			)
		),

		// Status indicators
		el("div", { className: "status-container" }).append(
			S.el(products.status, status =>
				status === "pending" ?
					el("div", { className: "loader" }).append(
						el("div", { className: "spinner" }),
						el("p", "Loading products...")
					)
				: status === "rejected" ?
					el("div", { className: "error-message" }).append(
						el("p", products.error.get().message),
						el("button", {
							textContent: "Try Again",
							onclick: () => products.invoke()
						})
					)
				: el()
			)
		),

		// Results count
		S.el(S(()=> [filteredProducts.get(), searchTerm.get()]), ([filtered, term]) =>
			products.status.get() === "resolved"
				? el("div", {
					className: "results-info",
					textContent: term ?
							`Found ${filtered.length} products matching "${term}"`
							: `Showing all ${filtered.length} products`
				})
				: el()
		),

		// Products grid
		el("div", { className: "products-grid" }).append(
			S.el(paginatedProducts, paginatedItems =>
				products.status.get() === "resolved" && paginatedItems.length > 0 ?
					paginatedItems.map(product => el(ProductCard, { product }))
					: products.status.get() === "resolved" && paginatedItems.length === 0 ?
						el("p", { className: "no-results", textContent: "No products found matching your criteria." })
						: el()
			)
		),

		// Pagination
		S.el(S(()=> [totalPages.get(), page.get()]), ([total, current]) =>
			products.status.get() === "resolved" && total > 1 ?
				el("div", { className: "pagination" }).append(
					el("button", {
						textContent: "Previous",
						disabled: current === 1,
						onclick: () => handlePageChange(current - 1)
					}),
					...Array.from({ length: total }, (_, i) => i + 1).map(num =>
						el("button", {
							className: num === current ? "current-page" : "",
							textContent: num,
							onclick: () => handlePageChange(num)
						})
					),
					el("button", {
						textContent: "Next",
						disabled: current === total,
						onclick: () => handlePageChange(current + 1)
					})
				)
				: el()
		)
	);
}

// Product card component
function ProductCard({ product }) {
	const showDetails = S(false);

	return el("div", { className: "product-card" }).append(
		el("div", { className: "product-image" }).append(
			el("img", { src: product.thumbnail, alt: product.title })
		),
		el("div", { className: "product-info" }).append(
			el("h3", { className: "product-title", textContent: product.title }),
			el("div", { className: "product-price-rating" }).append(
				el("span", { className: "product-price", textContent: `$${product.price.toFixed(2)}` }),
				el("span", { className: "product-rating" }).append(
					el("span", { className: "stars", textContent: "★".repeat(Math.round(product.rating)) }),
					el("span", { className: "rating-value", textContent: `(${product.rating})` }),
				)
			),
			el("p", { className: "product-category", textContent: `Category: ${product.category}` }),
			S.el(showDetails, details =>
				details ?
					el("div", { className: "product-details" }).append(
						el("p", { className: "product-description", textContent: product.description }),
						el("div", { className: "product-meta" }).append(
							el("p", `Brand: ${product.brand}`),
							el("p", `Stock: ${product.stock} units`),
							el("p", `Discount: ${product.discountPercentage}%`)
						)
					)
					: el()
			),
			el("div", { className: "product-actions" }).append(
				el("button", {
					className: "details-btn",
					textContent: S(() => showDetails.get() ? "Hide Details" : "Show Details"),
					onclick: () => showDetails.set(!showDetails.get())
				}),
				el("button", {
					className: "add-to-cart-btn",
					textContent: "Add to Cart"
				})
			)
		)
	);
}

// Data fetching function
async function fetchProducts({ signal }) {
	await simulateNetworkDelay();
	// Simulate random errors for demonstration
	if (Math.random() > 0.9) throw new Error("Failed to load products. Network error.");

	const response = await fetch("https://dummyjson.com/products", { signal });
	if (!response.ok) throw new Error(`API error: ${response.status}`);

	const data = await response.json();
	return data.products.slice(0, 20); // Limit to 20 products for the demo
}

// Utility for simulating network latency
function simulateNetworkDelay(min = 300, max = 1200) {
	const delay = Math.floor(Math.random() * (max - min + 1)) + min;
	return new Promise(resolve => setTimeout(resolve, delay));
}

/**
 * Custom hook for async data fetching with signals
 * @template T
 * @param {typeof S} S - Signal constructor
 * @param {(params: { signal: AbortSignal }) => Promise<T>} invoker - Async function to execute
 * @param {{ initial?: T, keepLast?: boolean, signal?: AbortSignal }} options - Configuration options
 * @returns {Object} Status signals and control methods
 */
export function asyncSignal(S, invoker, { initial, keepLast, signal } = {}) {
	/** @type {(s: AbortSignal) => AbortSignal} */
	const anySignal = !signal || !AbortSignal.any // TODO: make better
		? s=> s
		: s=> AbortSignal.any([s, signal]);
	// Status tracking signals
	const status = S("pending");
	const result = S(initial);
	const error = S(null);
	let controller = null;

	// Function to trigger data fetching
	async function invoke() {
		// Cancel any in-flight request
		if (controller) controller.abort();
		controller = new AbortController();

		status.set("pending");
		error.set(null);
		if (!keepLast) result.set(initial);

		try {
			const data = await invoker({
				signal: anySignal(controller.signal),
			});
			if (!controller.signal.aborted) {
				status.set("resolved");
				result.set(data);
			}
		} catch (e) {
			if (e.name !== "AbortError") {
				error.set(e);
				status.set("rejected");
			}
		}
	}

	// Initial data fetch
	invoke();

	return { status, result, error, invoke };
}

// Initialize the component
document.body.append(
	el(ProductCatalog),
	el("style", `
		.product-catalog {
			font-family: system-ui, -apple-system, sans-serif;
			max-width: 1200px;
			margin: 0 auto;
			padding: 20px;
		}

		.catalog-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 20px;
		}

		.toolbar button {
			margin-left: 10px;
			padding: 8px 12px;
			border-radius: 4px;
			border: none;
			background: #4a6cf7;
			color: white;
			cursor: pointer;
		}

		.controls {
			display: flex;
			justify-content: space-between;
			margin-bottom: 20px;
			gap: 15px;
			flex-wrap: wrap;
		}

		.search-box input {
			padding: 8px 12px;
			border: 1px solid #ddd;
			border-radius: 4px;
			width: 300px;
			max-width: 100%;
		}

		.sort-options select {
			padding: 8px 12px;
			border: 1px solid #ddd;
			border-radius: 4px;
		}

		.loader {
			text-align: center;
			padding: 40px 0;
		}

		.spinner {
			display: inline-block;
			width: 40px;
			height: 40px;
			border: 4px solid rgba(0, 0, 0, 0.1);
			border-left-color: #4a6cf7;
			border-radius: 50%;
			animation: spin 1s linear infinite;
		}

		@keyframes spin {
			to { transform: rotate(360deg); }
		}

		.error-message {
			background: #ffebee;
			color: #c62828;
			padding: 15px;
			border-radius: 4px;
			margin: 20px 0;
			text-align: center;
		}

		.results-info {
			margin-bottom: 15px;
			color: #666;
		}

		.products-grid {
			display: grid;
			grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
			gap: 20px;
			margin-bottom: 30px;
		}

		.product-card {
			border: 1px solid #eee;
			border-radius: 8px;
			overflow: hidden;
			transition: transform 0.2s, box-shadow 0.2s;
		}

		.product-card:hover {
			transform: translateY(-5px);
			box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
		}

		.product-image img {
			width: 100%;
			height: 180px;
			object-fit: cover;
			display: block;
		}

		.product-info {
			padding: 15px;
		}

		.product-title {
			margin: 0 0 10px;
			font-size: 1.1rem;
			height: 2.4rem;
			overflow: hidden;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
		}

		.product-price-rating {
			display: flex;
			justify-content: space-between;
			margin-bottom: 10px;
		}

		.product-price {
			font-weight: bold;
			color: #4a6cf7;
			font-size: 1.2rem;
		}

		.stars {
			color: gold;
			margin-right: 5px;
		}

		.product-category {
			color: #666;
			font-size: 0.9rem;
			margin-bottom: 15px;
		}

		.product-details {
			margin: 15px 0;
			font-size: 0.9rem;
		}

		.product-description {
			line-height: 1.5;
			margin-bottom: 10px;
			color: #444;
		}

		.product-meta {
			display: flex;
			flex-wrap: wrap;
			gap: 10px;
			color: #666;
			font-size: 0.85rem;
		}

		.product-actions {
			display: flex;
			gap: 10px;
			margin-top: 15px;
		}

		.product-actions button {
			flex: 1;
			padding: 8px 0;
			border: none;
			border-radius: 4px;
			cursor: pointer;
		}

		.details-btn {
			background: #eee;
			color: #333;
		}

		.add-to-cart-btn {
			background: #4a6cf7;
			color: white;
		}

		.pagination {
			display: flex;
			justify-content: center;
			gap: 5px;
			margin-top: 30px;
		}

		.pagination button {
			padding: 8px 12px;
			border: 1px solid #ddd;
			background: white;
			border-radius: 4px;
			cursor: pointer;
		}

		.pagination button.current-page {
			background: #4a6cf7;
			color: white;
			border-color: #4a6cf7;
		}

		.pagination button:disabled {
			opacity: 0.5;
			cursor: not-allowed;
		}

		.no-results {
			grid-column: 1 / -1;
			text-align: center;
			padding: 40px;
			color: #666;
		}

		@media (max-width: 768px) {
			.controls {
				flex-direction: column;
			}

			.search-box input {
				width: 100%;
			}

			.products-grid {
				grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
			}
		}
	`),
);
