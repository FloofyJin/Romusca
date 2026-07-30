<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { notesTree } from '$lib/noteEngine';
	import NotesTree from './NotesTree.svelte';
	import SketchyPanel from './SketchyPanel.svelte';
	import SketchyDefs from './SketchyDefs.svelte';
	import './notes.css';

	let { children } = $props();

	let currentSlug = $derived(page.params.slug ?? '');
</script>

<SketchyDefs />

<div class="notes-shell">
	<div class="notes-main">
		{@render children()}
	</div>
	<aside class="notes-aside">
		<SketchyPanel class="nav-panel">
			<a class="nav-title" href={resolve('/notes')}>Notes</a>
			<nav aria-label="Notes navigation">
				<NotesTree nodes={notesTree} {currentSlug} />
			</nav>
		</SketchyPanel>
	</aside>
</div>

<style>
	/* the root layout's <main> caps out at 64rem; widen it specifically for
	   the notes section (leaving other pages alone) so this max-width is the
	   one that actually binds */
	:global(main:has(.notes-shell)) {
		max-width: 80rem;
	}

	.notes-shell {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1.5rem;
		width: 100%;
		max-width: 80rem;
		margin: 0 auto;
	}

	.notes-aside {
		order: -1;
	}

	@media (min-width: 900px) {
		.notes-shell {
			grid-template-columns: minmax(0, 1fr) 17rem;
			align-items: start;
		}

		.notes-aside {
			order: 1;
			position: sticky;
			top: 1rem;
			max-height: calc(100vh - 2rem);
			overflow-y: auto;
		}
	}

	.notes-main {
		min-width: 0;
	}

	:global(.nav-panel) {
		padding: 1rem 1.1rem;
	}

	.nav-title {
		display: block;
		font-family: var(--font-hand);
		font-size: 1.4rem;
		margin-bottom: 0.6rem;
		color: var(--color-theme-1);
		text-decoration: none;
	}
</style>
