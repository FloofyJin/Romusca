<script lang="ts">
	let {
		children,
		class: className = '',
		strokeWidth = 1.5,
		tag = 'div'
	}: {
		children: import('svelte').Snippet;
		class?: string;
		strokeWidth?: number;
		tag?: string;
	} = $props();
</script>

<svelte:element this={tag} class="sketchy-panel {className}" style:border-width="{strokeWidth}px">
	{@render children()}
</svelte:element>

<style>
	.sketchy-panel {
		display: block;
		border: 1.5px solid var(--sketchy-stroke);
		border-radius: 8px;
	}
</style>
