/**
 * Case Study: Data Dashboard with Charts
 *
 * This example demonstrates:
 * - Integration with a third-party charting library
 * - Data fetching and state management
 * - Responsive layout design
 * - Multiple interactive components working together
 */

import { el, on } from "deka-dom-el";
import { S } from "deka-dom-el/signals";

/**
 * Data Dashboard Component with Chart Integration
 * @returns {HTMLElement} Dashboard element
 */
export function DataDashboard() {
	// Mock data for demonstration
	const DATA = {
		sales: [42, 58, 65, 49, 72, 85, 63, 70, 78, 89, 95, 86],
		visitors: [1420, 1620, 1750, 1850, 2100, 2400, 2250, 2500, 2750, 2900, 3100, 3200],
		conversion: [2.9, 3.5, 3.7, 2.6, 3.4, 3.5, 2.8, 2.8, 2.8, 3.1, 3.0, 2.7],
		months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
	};
	const years = [2022, 2023, 2024];
	const dataTypes = [
		{ id: 'sales', label: 'Sales', unit: 'K' },
		{ id: 'visitors', label: 'Visitors', unit: '' },
		{ id: 'conversion', label: 'Conversion Rate', unit: '%' }
	];

	// Filter options
	const selectedYear = S(2024);
	const onYearChange = on("change", e => {
		selectedYear.set(parseInt(/** @type {HTMLSelectElement} */(e.target).value));
		loadData();
	});
	const selectedDataType = S(/** @type {'sales' | 'visitors' | 'conversion'} */ ('sales'));
	const onDataTypeChange = on("click", e => {
		const type = /** @type {'sales' | 'visitors' | 'conversion'} */(
			/** @type {HTMLButtonElement} */(e.currentTarget).dataset.type);
		selectedDataType.set(type);
	});
	const currentDataType = S(() => dataTypes.find(type => type.id === selectedDataType.get()));
	const selectedData = S(() => DATA[selectedDataType.get()]);

	// Values based on filters
	const totalValue = S(() => selectedData.get().reduce((sum, value) => sum + value, 0));
	const averageValue = S(() => {
		const data = selectedData.get();
		return data.reduce((sum, value) => sum + value, 0) / data.length;
	});
	const highestValue = S(() => Math.max(...selectedData.get()));

	// Simulate data loading
	const isLoading = S(false);
	const error = S(null);
	function loadData() {
		isLoading.set(true);
		error.set(null);

		// Simulate API call
		setTimeout(() => {
			if (Math.random() > 0.9) {
				// Simulate occasional error
				error.set('Failed to load data. Please try again.');
			}
			isLoading.set(false);
		}, 800);
	}

	// Reactive chart rendering
	const chart = S(()=> {
		const chart= el("canvas", { id: "chart-canvas", width: 800, height: 400 });
		const ctx = chart.getContext('2d');
		const data = selectedData.get();
		const months = DATA.months;
		const width = chart.width;
		const height = chart.height;
		const maxValue = Math.max(...data) * 1.1;
		const barWidth = width / data.length - 10;

		// Clear canvas
		ctx.clearRect(0, 0, width, height);

		// Draw background grid
		ctx.beginPath();
		ctx.strokeStyle = '#f0f0f0';
		ctx.lineWidth = 1;
		for(let i = 0; i < 5; i++) {
			const y = height - (height * (i / 5)) - 30;
			ctx.moveTo(50, y);
			ctx.lineTo(width - 20, y);

			// Draw grid labels
			ctx.fillStyle = '#999';
			ctx.font = '12px Arial';
			ctx.fillText(Math.round(maxValue * (i / 5)).toString(), 20, y + 5);
		}
		ctx.stroke();

		// Draw bars
		data.forEach((value, index) => {
			const x = index * (barWidth + 10) + 60;
			const barHeight = (value / maxValue) * (height - 60);

			// Bar
			ctx.fillStyle = '#4a90e2';
			ctx.fillRect(x, height - barHeight - 30, barWidth, barHeight);

			// Month label
			ctx.fillStyle = '#666';
			ctx.font = '12px Arial';
			ctx.fillText(months[index], x + barWidth/2 - 10, height - 10);
		});

		// Chart title
		ctx.fillStyle = '#333';
		ctx.font = 'bold 14px Arial';
		ctx.fillText(`${currentDataType.get().label} (${selectedYear.get()})`, width/2 - 80, 20);
		return chart;
	});

	return el("div", { className: "dashboard" }).append(
		el("header", { className: "dashboard-header" }).append(
			el("h1", "Sales Performance Dashboard"),
			el("div", { className: "year-filter" }).append(
				el("label", { htmlFor: "yearSelect", textContent: "Select Year:" }),
				el("select", { id: "yearSelect" },
					on.defer(el=> el.value = selectedYear.get().toString()),
					onYearChange
				).append(
					...years.map(year => el("option", { value: year, textContent: year }))
				)
			)
		),

		S.el(error, errorMsg => !errorMsg
			? el()
			: el("div", { className: "error-message" }).append(
					el("p", errorMsg),
					el("button", { textContent: "Retry", type: "button" }, on("click", loadData)),
				),
		),

		S.el(isLoading, loading => !loading
			? el()
			: el("div", { className: "loading-spinner" })
		),

		// Main dashboard content
		el("div", { className: "dashboard-content" }).append(
			// Metrics cards
			el("div", { className: "metrics-container" }).append(
				el("div", { className: "metric-card" }).append(
					el("h3", "Total"),
					el("#text", S(() => `${totalValue.get().toLocaleString()}${currentDataType.get().unit}`)),
				),
				el("div", { className: "metric-card" }).append(
					el("h3", "Average"),
					el("#text", S(() => `${averageValue.get().toFixed(1)}${currentDataType.get().unit}`)),
				),
				el("div", { className: "metric-card" }).append(
					el("h3", "Highest"),
					el("#text", S(() => `${highestValue.get()}${currentDataType.get().unit}`)),
				),
			),

			// Data type selection tabs
			el("div", { className: "data-type-tabs" }).append(
				...dataTypes.map(type =>
					el("button", {
						type: "button",
						className: S(() => selectedDataType.get() === type.id ? 'active' : ''),
						dataType: type.id,
						textContent: type.label
					}, onDataTypeChange)
				)
			),

			// Chart container
			el("div", { className: "chart-container" }).append(
				S.el(chart, chart => chart)
			)
		),
	);
}

// Render the component
document.body.append(
	el("div", { style: "padding: 20px; background: #f5f5f5; min-height: 100vh;" }).append(
		el(DataDashboard)
	),
	el("style", `
			.dashboard {
				font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
				max-width: 1000px;
				margin: 0 auto;
				padding: 1rem;
				background: #fff;
				box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
				border-radius: 8px;
			}

			.dashboard-header {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 1.5rem;
				padding-bottom: 1rem;
				border-bottom: 1px solid #eee;
			}

			.dashboard-header h1 {
				font-size: 1.5rem;
				margin: 0;
				color: #333;
			}

			.year-filter {
				display: flex;
				align-items: center;
				gap: 0.5rem;
			}

			.year-filter select {
				padding: 0.5rem;
				border: 1px solid #ddd;
				border-radius: 4px;
				font-size: 1rem;
			}

			.metrics-container {
				display: grid;
				grid-template-columns: repeat(3, 1fr);
				gap: 1rem;
				margin-bottom: 1.5rem;
			}

			.metric-card {
				background: #f9f9f9;
				border-radius: 8px;
				padding: 1rem;
				text-align: center;
				transition: transform 0.2s ease;
			}

			.metric-card:hover {
				transform: translateY(-5px);
				box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
			}

			.metric-card h3 {
				margin-top: 0;
				color: #666;
				font-size: 0.9rem;
				margin-bottom: 0.5rem;
			}

			.metric-card p {
				font-size: 1.5rem;
				font-weight: bold;
				color: #333;
				margin: 0;
			}

			.data-type-tabs {
				display: flex;
				border-bottom: 1px solid #eee;
				margin-bottom: 1.5rem;
			}

			.data-type-tabs button {
				background: none;
				border: none;
				padding: 0.75rem 1.5rem;
				font-size: 1rem;
				cursor: pointer;
				color: #666;
				position: relative;
			}

			.data-type-tabs button.active {
				color: #4a90e2;
				font-weight: 500;
			}

			.data-type-tabs button.active::after {
				content: '';
				position: absolute;
				bottom: -1px;
				left: 0;
				width: 100%;
				height: 3px;
				background: #4a90e2;
				border-radius: 3px 3px 0 0;
			}

			.chart-container {
				background: #fff;
				border-radius: 8px;
				padding: 1rem;
				margin-bottom: 1.5rem;
				box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
			}

			.loading-spinner {
				display: flex;
				justify-content: center;
				align-items: center;
				height: 100px;
			}

			.loading-spinner::before {
				content: '';
				width: 40px;
				height: 40px;
				border: 4px solid #f3f3f3;
				border-top: 4px solid #4a90e2;
				border-radius: 50%;
				animation: spin 1s linear infinite;
			}

			@keyframes spin {
				0% { transform: rotate(0deg); }
				100% { transform: rotate(360deg); }
			}

			.error-message {
				background: #ffecec;
				color: #e74c3c;
				padding: 1rem;
				border-radius: 4px;
				margin-bottom: 1.5rem;
				display: flex;
				justify-content: space-between;
				align-items: center;
			}

			.error-message p {
				margin: 0;
			}

			.error-message button {
				background: #e74c3c;
				color: white;
				border: none;
				border-radius: 4px;
				padding: 0.5rem 1rem;
				cursor: pointer;
			}

			@media (max-width: 768px) {
				.metrics-container {
					grid-template-columns: 1fr;
				}

				.dashboard-header {
					flex-direction: column;
					align-items: flex-start;
					gap: 1rem;
				}

				.year-filter {
					width: 100%;
				}

				.year-filter select {
					flex-grow: 1;
				}
			}
		`)
);
