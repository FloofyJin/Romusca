<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import SketchyPanel from './SketchyPanel.svelte';
</script>

<svelte:head>
	<title>Note not found · Notes</title>
</svelte:head>

<SketchyPanel class="error-panel" tag="section">
	<h1 class="error-title">Page torn out</h1>
	<p>{page.error?.message ?? 'That note doesn’t exist.'}</p>
	<p><a href={resolve('/notes')}>Back to the notes overview →</a></p>
</SketchyPanel>

<style>
	:global(.error-panel) {
		padding: 1.75rem;
	}

	.error-title {
		font-family: var(--font-hand);
		font-size: 1.8rem;
		margin: 0 0 0.75rem;
		color: var(--color-theme-1);
	}
</style>
