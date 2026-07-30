<script lang="ts">
	import { resolve } from '$app/paths';
	import SketchyPanel from '../SketchyPanel.svelte';
	import NoteGraph from '../NoteGraph.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let note = $derived(data.note);
	let showToc = $derived(note.headings.filter((h) => h.depth <= 3).length > 1);
</script>

<svelte:head>
	<title>{note.title} · Notes</title>
	<meta name="description" content="Note: {note.title}" />
</svelte:head>

<article>
	<p class="crumbs">
		<a href={resolve('/notes')}>Notes</a>
		{#each note.folderPath as segment}
			<span class="sep">/</span><span>{segment}</span>
		{/each}
		<span class="sep">/</span><span class="current">{note.title}</span>
	</p>

	<SketchyPanel class="note-panel" tag="section">
		<h1 class="note-title">{note.title}</h1>

		{#if showToc}
			<details class="toc">
				<summary>Contents</summary>
				<ul>
					{#each note.headings.filter((h) => h.depth <= 3) as heading}
						<li style="--indent: {heading.depth - 1}">
							<a href="#{heading.id}">{heading.text}</a>
						</li>
					{/each}
				</ul>
			</details>
		{/if}

		<div class="note-content">
			{@html note.html}
		</div>
	</SketchyPanel>

	{#if data.backlinkTitles.length}
		<SketchyPanel class="backlinks-panel">
			<h2 class="backlinks-title">Linked from</h2>
			<ul class="backlinks-list">
				{#each data.backlinkTitles as linked}
					<li>
						<a href={resolve('/notes/[...slug]', { slug: linked.slug })}>{linked.title}</a>
						<span class="backlink-folder">{linked.folderPath.join(' / ') || 'root'}</span>
					</li>
				{/each}
			</ul>
		</SketchyPanel>
	{/if}

	{#if data.localNodes.length > 1}
		<section class="local-graph">
			<h2 class="local-graph-title">Nearby in the graph</h2>
			<NoteGraph
				nodes={data.localNodes}
				edges={data.localEdges}
				currentSlug={note.slug}
				minHeight={320}
				caption="Drag to rearrange · click a node to jump there"
			/>
		</section>
	{/if}
</article>

<style>
	.crumbs {
		font-size: 0.85rem;
		opacity: 0.75;
		margin: 0 0 0.75rem 0.25rem;
	}

	.crumbs a {
		color: var(--color-theme-2);
		text-decoration: none;
	}

	.crumbs a:hover {
		text-decoration: underline;
	}

	.crumbs .sep {
		margin: 0 0.35em;
		opacity: 0.5;
	}

	.crumbs .current {
		font-weight: 700;
		color: var(--color-text);
	}

	:global(.note-panel) {
		padding: 1.5rem 1.75rem;
		margin-bottom: 1.5rem;
	}

	.note-title {
		font-family: var(--font-hand);
		font-size: 2rem;
		margin: 0 0 1rem;
		color: var(--color-theme-1);
	}

	.toc {
		border: 1.5px dashed var(--code-border);
		border-radius: 6px;
		padding: 0.5rem 0.9rem;
		margin-bottom: 1.25rem;
		background: var(--code-bg);
	}

	.toc summary {
		cursor: pointer;
		font-family: var(--font-hand);
		font-weight: 700;
	}

	.toc ul {
		list-style: none;
		margin: 0.5rem 0 0.1rem;
		padding: 0;
	}

	.toc li {
		padding: 0.15rem 0 0.15rem calc(var(--indent, 0) * 1rem);
	}

	.toc a {
		color: var(--color-theme-2);
		text-decoration: none;
		font-size: 0.92rem;
	}

	.toc a:hover {
		text-decoration: underline;
	}

	:global(.backlinks-panel) {
		padding: 1.1rem 1.4rem;
		margin-bottom: 1.5rem;
	}

	.backlinks-title {
		font-family: var(--font-hand);
		font-size: 1.2rem;
		margin: 0 0 0.6rem;
	}

	.backlinks-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}

	.backlinks-list a {
		color: var(--color-theme-2);
		font-weight: 600;
		text-decoration: none;
	}

	.backlinks-list a:hover {
		text-decoration: underline;
	}

	.backlink-folder {
		font-size: 0.78rem;
		opacity: 0.55;
		margin-left: 0.5rem;
	}

	.local-graph-title {
		font-family: var(--font-hand);
		font-size: 1.2rem;
		margin: 0 0 0.5rem;
	}
</style>
