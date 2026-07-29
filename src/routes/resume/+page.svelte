<script lang="ts">
	import { onMount } from 'svelte';
	import resumeUrl from '$lib/documents/jinsung_park_resume_4_0.pdf?url';

	let containerEl: HTMLDivElement;
	let pagesEl: HTMLDivElement;
	let loading = $state(true);
	let error = $state('');

	onMount(() => {
		let cancelled = false;
		let cleanupResize: (() => void) | undefined;

		(async () => {
			const pdfjsLib = await import('pdfjs-dist');
			const workerUrl = (await import('pdfjs-dist/build/pdf.worker.mjs?url')).default;
			pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

			const pdf = await pdfjsLib.getDocument({ url: resumeUrl }).promise;
			if (cancelled) return;

			const pages = await Promise.all(
				Array.from({ length: pdf.numPages }, (_, i) => pdf.getPage(i + 1))
			);
			if (cancelled) return;

			const renderPages = async () => {
				const targetWidth = containerEl.clientWidth;
				const outputScale = window.devicePixelRatio || 1;

				pagesEl.innerHTML = '';

				for (const page of pages) {
					const unscaledViewport = page.getViewport({ scale: 1 });
					const scale = targetWidth / unscaledViewport.width;
					const viewport = page.getViewport({ scale });

					const pageWrapper = document.createElement('div');
					pageWrapper.className = 'pdf-page';
					pageWrapper.style.width = `${viewport.width}px`;
					pageWrapper.style.height = `${viewport.height}px`;

					const canvas = document.createElement('canvas');
					canvas.width = Math.floor(viewport.width * outputScale);
					canvas.height = Math.floor(viewport.height * outputScale);
					canvas.style.width = `${viewport.width}px`;
					canvas.style.height = `${viewport.height}px`;
					const ctx = canvas.getContext('2d')!;
					const transform = outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : undefined;

					const textLayerDiv = document.createElement('div');
					textLayerDiv.className = 'textLayer';
					textLayerDiv.style.width = `${viewport.width}px`;
					textLayerDiv.style.height = `${viewport.height}px`;
					// pdf.js text layer builder reads scale from this custom property
					textLayerDiv.style.setProperty('--scale-factor', `${scale}`);

					pageWrapper.appendChild(canvas);
					pageWrapper.appendChild(textLayerDiv);
					pagesEl.appendChild(pageWrapper);

					await page.render({ canvas, canvasContext: ctx, viewport, transform }).promise;

					const textContent = await page.getTextContent();
					const textLayer = new pdfjsLib.TextLayer({
						textContentSource: textContent,
						container: textLayerDiv,
						viewport
					});
					await textLayer.render();
				}
			};

			await renderPages();
			loading = false;

			let resizeTimeout: ReturnType<typeof setTimeout>;
			const onResize = () => {
				clearTimeout(resizeTimeout);
				resizeTimeout = setTimeout(renderPages, 200);
			};
			window.addEventListener('resize', onResize);
			cleanupResize = () => {
				window.removeEventListener('resize', onResize);
				clearTimeout(resizeTimeout);
			};
		})().catch((err) => {
			console.error(err);
			error = 'Failed to load resume.';
			loading = false;
		});

		return () => {
			cancelled = true;
			cleanupResize?.();
		};
	});
</script>

<svelte:head>
	<title>Resume</title>
	<meta name="description" content="Jinsung Park's resume" />
</svelte:head>

<div class="resume-container" bind:this={containerEl}>
	{#if loading}
		<p class="status">Loading resume…</p>
	{/if}
	{#if error}
		<p class="status">{error}</p>
	{/if}
	<div class="pages" bind:this={pagesEl}></div>
</div>

<style>
	.resume-container {
		width: 100%;
		max-width: 850px;
		margin: 0 auto;
	}

	.status {
		text-align: center;
	}

	.pages {
		display: flex;
		flex-direction: column;
	}

	:global(.pdf-page) {
		position: relative;
		display: block;
		box-shadow: 0 1px 4px var(--pdf-shadow);
	}

	:global(.pdf-page + .pdf-page) {
		border-top: 1px solid var(--pdf-divider);
	}

	:global(.pdf-page canvas) {
		display: block;
		filter: var(--pdf-filter);
		transition: filter 0.2s ease;
	}

	:global(.textLayer) {
		position: absolute;
		inset: 0;
		overflow: clip;
		opacity: 1;
		line-height: 1;
		text-align: initial;
		text-size-adjust: none;
		forced-color-adjust: none;
		transform-origin: 0 0;
		caret-color: CanvasText;
		z-index: 0;
	}

	:global(.textLayer span),
	:global(.textLayer br) {
		color: transparent;
		position: absolute;
		white-space: pre;
		cursor: text;
		transform-origin: 0% 0%;
	}

	:global(.textLayer ::selection) {
		background: rgba(0, 100, 255, 0.3);
	}
</style>
