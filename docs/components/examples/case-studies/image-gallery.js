/**
 * Case Study: Interactive Image Gallery
 *
 * This example demonstrates:
 * - Dynamic loading of content
 * - Lightbox functionality
 * - Animation handling
 * - Keyboard and gesture navigation
 */

import { el, memo, on } from "deka-dom-el";
import { S } from "deka-dom-el/signals";

// Sample image data
const imagesSample = (url=> [
	{ id: 1, src: url+'nature', alt: 'Nature', title: 'Beautiful Landscape' },
	{ id: 2, src: url+'places', alt: 'City', title: 'Urban Architecture' },
	{ id: 3, src: url+'people', alt: 'People', title: 'Street Photography' },
	{ id: 4, src: url+'food', alt: 'Food', title: 'Culinary Delights' },
	{ id: 5, src: url+'animals', alt: 'Animals', title: 'Wildlife' },
	{ id: 6, src: url+'travel', alt: 'Travel', title: 'Adventure Awaits' },
	{ id: 7, src: url+'computer', alt: 'Technology', title: 'Modern Tech' },
	{ id: 8, src: url+'music', alt: 'Art', title: 'Creative Expression' },
])('https://api.algobook.info/v1/randomimage?category=');
/**
 * Interactive Image Gallery Component
 * @returns {HTMLElement} Gallery element
 */
export function ImageGallery(images= imagesSample) {
	const filterTag = S('all');
	const imagesToDisplay = S(() => {
		const tag = filterTag.get();
		if (tag === 'all') return images;
		else return images.filter(img => img.alt.toLowerCase() === tag);
	})
	const onFilterChange = tag => on("click", () => {
		filterTag.set(tag);
	});

	// Lightbox
	const selectedImageId = S(null);
	const selectedImage = S(() => {
		const id = selectedImageId.get();
		return id ? images.find(img => img.id === id) : null;
	});
	const isLightboxOpen = S(() => selectedImage.get() !== null);
	const onImageClick = id => on("click", () => {
		selectedImageId.set(id);
		document.body.style.overflow = 'hidden'; // Prevent scrolling when lightbox is open

		// Add keyboard event listeners when lightbox opens
		document.addEventListener('keydown', handleKeyDown);
	});
	const closeLightbox = () => {
		selectedImageId.set(null);
		document.body.style.overflow = ''; // Restore scrolling

		// Remove keyboard event listeners when lightbox closes
		document.removeEventListener('keydown', handleKeyDown);
	};
	const onPrevImage = e => {
		e.stopPropagation(); // Prevent closing the lightbox
		const images = imagesToDisplay.get();
		const currentId = selectedImageId.get();
		const currentIndex = images.findIndex(img => img.id === currentId);
		const prevIndex = (currentIndex - 1 + images.length) % images.length;
		selectedImageId.set(images[prevIndex].id);
	};
	const onNextImage = e => {
		e.stopPropagation(); // Prevent closing the lightbox
		const images = imagesToDisplay.get();
		const currentId = selectedImageId.get();
		const currentIndex = images.findIndex(img => img.id === currentId);
		const nextIndex = (currentIndex + 1) % images.length;
		selectedImageId.set(images[nextIndex].id);
	};

	// Keyboard navigation handler
	function handleKeyDown(e) {
		switch(e.key) {
			case 'Escape':
				closeLightbox();
				break;
			case 'ArrowLeft':
				document.querySelector('.lightbox-prev-btn').click();
				break;
			case 'ArrowRight':
				document.querySelector('.lightbox-next-btn').click();
				break;
		}
	}

	// Build the gallery UI
	return el("div", { className: "gallery-container" }).append(
		// Gallery header
		el("header", { className: "gallery-header" }).append(
			el("h1", "Interactive Image Gallery"),
			el("p", "Click on any image to view it in the lightbox. Use arrow keys for navigation.")
		),

		// Filter options
		el("div", { className: "gallery-filters" }).append(
			el("button", {
				classList: { active: S(() => filterTag.get() === 'all') },
				textContent: "All"
			}, onFilterChange('all')),
			el("button", {
				classList: { active: S(() => filterTag.get() === 'nature') },
				textContent: "Nature"
			}, onFilterChange('nature')),
			el("button", {
				classList: { active: S(() => filterTag.get() === 'urban') },
				textContent: "Urban"
			}, onFilterChange('urban')),
			el("button", {
				classList: { active: S(() => filterTag.get() === 'people') },
				textContent: "People"
			}, onFilterChange('people'))
		),

		// Image grid
		el("div", { className: "gallery-grid" }).append(
			S.el(imagesToDisplay, images =>
				images.map(image =>
					memo(image.id, ()=>
						el("div", {
							className: "gallery-item",
							dataTag: image.alt.toLowerCase()
						}).append(
							el("img", {
								src: image.src,
								alt: image.alt,
								loading: "lazy"
							}, onImageClick(image.id)),
							el("div", { className: "gallery-item-caption" }).append(
								el("h3", image.title),
								el("p", image.alt)
							)
						)
					)
				)
			)
		),

		// Lightbox (only shown when an image is selected)
		S.el(isLightboxOpen, open => !open
			? el()
			: el("div", { className: "lightbox-overlay" }, on("click", closeLightbox)).append(
					el("div", {
						className: "lightbox-content",
						onClick: e => e.stopPropagation() // Prevent closing when clicking inside
					}).append(
						el("button", {
							className: "lightbox-close-btn",
							"aria-label": "Close lightbox"
						}, on("click", closeLightbox)).append("×"),

						el("button", {
							className: "lightbox-prev-btn",
							"aria-label": "Previous image"
						}, on("click", onPrevImage)).append("❮"),

						el("button", {
							className: "lightbox-next-btn",
							"aria-label": "Next image"
						}, on("click", onNextImage)).append("❯"),

						S.el(selectedImage, img => !img
							? el()
							: el("div", { className: "lightbox-image-container" }).append(
								el("img", {
									src: img.src,
									alt: img.alt,
									className: "lightbox-image"
								}),
								el("div", { className: "lightbox-caption" }).append(
									el("h2", img.title),
									el("p", img.alt)
								)
							)
						)
					)
				)
		),
	);
}

// Render the component
document.body.append(
	el("div", { style: "padding: 20px; background: #f5f5f5; min-height: 100vh;" }).append(
		el(ImageGallery)
	),
	el("style", `
		.gallery-container {
			font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
			max-width: 1200px;
			margin: 0 auto;
			padding: 2rem;
		}

		.gallery-header {
			text-align: center;
			margin-bottom: 2rem;
		}

		.gallery-header h1 {
			margin-bottom: 0.5rem;
			color: #333;
		}

		.gallery-header p {
			color: #666;
		}

		.gallery-filters {
			display: flex;
			justify-content: center;
			margin-bottom: 2rem;
			flex-wrap: wrap;
		}

		.gallery-filters button {
			background: none;
			border: none;
			padding: 0.5rem 1.5rem;
			margin: 0 0.5rem;
			font-size: 1rem;
			cursor: pointer;
			border-radius: 30px;
			transition: all 0.3s ease;
			color: #555;
		}

		.gallery-filters button:hover {
			background: #f0f0f0;
		}

		.gallery-filters button.active {
			background: #4a90e2;
			color: white;
		}

		.gallery-grid {
			display: grid;
			grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
			gap: 1.5rem;
		}

		.gallery-item {
			position: relative;
			border-radius: 8px;
			overflow: hidden;
			box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
			transition: transform 0.3s ease, box-shadow 0.3s ease;
			cursor: pointer;
		}

		.gallery-item:hover {
			transform: translateY(-5px);
			box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
		}

		.gallery-item img {
			width: 100%;
			height: 200px;
			object-fit: cover;
			display: block;
			transition: transform 0.5s ease;
		}

		.gallery-item:hover img {
			transform: scale(1.05);
		}

		.gallery-item-caption {
			position: absolute;
			bottom: 0;
			left: 0;
			right: 0;
			background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
			color: white;
			padding: 1rem;
			transform: translateY(100%);
			transition: transform 0.3s ease;
		}

		.gallery-item:hover .gallery-item-caption {
			transform: translateY(0);
		}

		.gallery-item-caption h3 {
			margin: 0 0 0.5rem;
			font-size: 1.2rem;
		}

		.gallery-item-caption p {
			margin: 0;
			font-size: 0.9rem;
			opacity: 0.8;
		}

		/* Lightbox styles */
		.lightbox-overlay {
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background: rgba(0, 0, 0, 0.9);
			display: flex;
			justify-content: center;
			align-items: center;
			z-index: 1000;
			padding: 2rem;
		}

		.lightbox-content {
			position: relative;
			max-width: 90%;
			max-height: 90%;
		}

		.lightbox-image-container {
			overflow: hidden;
			border-radius: 4px;
			box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
			background: #000;
		}

		.lightbox-image {
			max-width: 100%;
			max-height: 80vh;
			display: block;
			margin: 0 auto;
		}

		.lightbox-caption {
			background: #222;
			color: white;
			padding: 1rem;
			text-align: center;
		}

		.lightbox-caption h2 {
			margin: 0 0 0.5rem;
		}

		.lightbox-caption p {
			margin: 0;
			opacity: 0.8;
		}

		.lightbox-close-btn,
		.lightbox-prev-btn,
		.lightbox-next-btn {
			background: rgba(0, 0, 0, 0.5);
			color: white;
			border: none;
			font-size: 1.5rem;
			width: 50px;
			height: 50px;
			border-radius: 50%;
			display: flex;
			justify-content: center;
			align-items: center;
			cursor: pointer;
			transition: background 0.3s ease;
			position: absolute;
		}

		.lightbox-close-btn:hover,
		.lightbox-prev-btn:hover,
		.lightbox-next-btn:hover {
			background: rgba(0, 0, 0, 0.8);
		}

		.lightbox-close-btn {
			top: -25px;
			right: -25px;
		}

		.lightbox-prev-btn {
			left: -25px;
			top: 50%;
			transform: translateY(-50%);
		}

		.lightbox-next-btn {
			right: -25px;
			top: 50%;
			transform: translateY(-50%);
		}

		@media (max-width: 768px) {
			.gallery-container {
				padding: 1rem;
			}

			.gallery-grid {
				grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
				gap: 1rem;
			}

			.lightbox-prev-btn,
			.lightbox-next-btn {
				width: 40px;
				height: 40px;
				font-size: 1.2rem;
			}
		}
	`)
);
