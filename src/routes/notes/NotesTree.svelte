<script lang="ts">
	import { resolve } from '$app/paths';
	import type { TreeNode } from '$lib/noteEngine';
	import Self from './NotesTree.svelte';

	let {
		nodes,
		currentSlug,
		depth = 0
	}: { nodes: TreeNode[]; currentSlug: string; depth?: number } = $props();

	function isAncestor(slugPath: string): boolean {
		return currentSlug === slugPath || currentSlug.startsWith(slugPath + '/');
	}
</script>

<ul class="tree" style:--depth={depth}>
	{#each nodes as node (node.type === 'folder' ? 'd:' + node.slugPath : 'f:' + node.slug)}
		<li>
			{#if node.type === 'folder'}
				<details open={isAncestor(node.slugPath)}>
					<summary>
						<svg class="twist" viewBox="0 0 12 12" aria-hidden="true">
							<path d="M3 1.5 L9 6 L3 10.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
						</svg>
						<svg class="folder-icon" viewBox="0 0 20 16" aria-hidden="true">
							<path
								d="M1.2 2.3 Q1 1.1 2.4 1.1 L7.6 1 Q8.4 1 8.8 1.8 L9.4 3 L17.5 3.1 Q18.9 3 18.7 4.4 L18 14 Q17.9 15 16.7 14.9 L2 15 Q1 15 1.1 13.8 Z"
								fill="none"
								stroke="currentColor"
								stroke-width="1.3"
								stroke-linejoin="round"
							/>
						</svg>
						<span class="label">{node.name}</span>
					</summary>
					<Self nodes={node.children} {currentSlug} depth={depth + 1} />
				</details>
			{:else}
				<a
					class="note-link"
					class:active={node.slug === currentSlug}
					href={resolve('/notes/[...slug]', { slug: node.slug })}
				>
					<svg class="file-icon" viewBox="0 0 14 16" aria-hidden="true">
						<path
							d="M1.4 1.3 L8.3 1.1 L12.6 5.4 L12.5 14.6 Q12.5 15.3 11.7 15.2 L1.5 15.1 Q0.9 15.1 1 14.3 Z"
							fill="none"
							stroke="currentColor"
							stroke-width="1.2"
							stroke-linejoin="round"
						/>
						<path d="M8.2 1.2 L8.4 5.3 L12.5 5.4" fill="none" stroke="currentColor" stroke-width="1.1" stroke-linejoin="round" />
					</svg>
					<span class="label">{node.name}</span>
				</a>
			{/if}
		</li>
	{/each}
</ul>

<style>
	.tree {
		list-style: none;
		margin: 0;
		padding-left: calc(var(--depth, 0) * 0.95rem);
	}

	li {
		margin: 0.05rem 0;
	}

	summary {
		display: flex;
		align-items: center;
		gap: 0.35rem;
		cursor: pointer;
		padding: 0.2rem 0.35rem;
		border-radius: 5px;
		list-style: none;
		font-weight: 600;
		color: var(--color-text);
		user-select: none;
	}

	summary::-webkit-details-marker {
		display: none;
	}

	summary:hover {
		background: var(--sketchy-hover);
	}

	.twist {
		width: 0.6rem;
		height: 0.6rem;
		flex: none;
		transition: transform 0.15s ease;
		color: var(--color-theme-2);
	}

	details[open] > summary .twist {
		transform: rotate(90deg);
	}

	.folder-icon,
	.file-icon {
		width: 1rem;
		height: 0.95rem;
		flex: none;
		color: var(--color-theme-2);
	}

	.note-link {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.2rem 0.35rem;
		border-radius: 5px;
		color: var(--color-text);
		text-decoration: none;
		font-size: 0.95rem;
	}

	.note-link:hover {
		background: var(--sketchy-hover);
		text-decoration: none;
	}

	.note-link.active {
		background: var(--sketchy-active);
		color: var(--color-theme-1);
		font-weight: 700;
	}

	.note-link.active .file-icon {
		color: var(--color-theme-1);
	}

	.label {
		overflow-wrap: anywhere;
	}
</style>
