<script lang="ts">
	import { graphNodes, graphEdges, notes } from '$lib/noteEngine';
	import NoteGraph from './NoteGraph.svelte';
	import SketchyPanel from './SketchyPanel.svelte';

	let folderCount = $derived(new Set(notes.map((n) => n.folderPath[0] ?? '')).size);
</script>

<svelte:head>
	<title>Notes</title>
	<meta name="description" content="Jinsung Park's notes, mirrored from an Obsidian vault" />
</svelte:head>

<SketchyPanel class="overview-panel" tag="section">
	<h1 class="overview-title">Notes</h1>
	<p class="overview-blurb">
		This vault contains {notes.length} notes across {folderCount} folder
	</p>
	<NoteGraph nodes={graphNodes} edges={graphEdges} minHeight={460} />
</SketchyPanel>

<style>
	:global(.overview-panel) {
		padding: 1.5rem 1.75rem 1.25rem;
	}

	.overview-title {
		font-family: var(--font-hand);
		font-size: 2.3rem;
		margin: 0 0 0.6rem;
		color: var(--color-theme-1);
	}

	.overview-blurb {
		max-width: 62ch;
		margin: 0 0 1.4rem;
	}
</style>
