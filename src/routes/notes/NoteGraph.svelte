<script lang="ts">
	import { onMount, onDestroy, untrack } from 'svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import {
		forceSimulation,
		forceManyBody,
		forceLink,
		forceCenter,
		forceCollide,
		type Simulation,
		type SimulationNodeDatum,
		type SimulationLinkDatum,
		type Force
	} from 'd3-force';
	import type { GraphEdge, GraphNode } from '$lib/noteEngine';

	interface SimNode extends GraphNode, SimulationNodeDatum {}
	interface SimLink extends SimulationLinkDatum<SimNode> {}

	let {
		nodes: inputNodes,
		edges: inputEdges,
		currentSlug,
		minHeight = 420,
		caption = 'Scroll or pinch to zoom · drag empty space to pan · click a node to open it'
	}: {
		nodes: GraphNode[];
		edges: GraphEdge[];
		currentSlug?: string;
		minHeight?: number;
		caption?: string | false;
	} = $props();

	const ZOOM_MIN = 0.05;
	const ZOOM_MAX = 8;

	let container: HTMLDivElement | undefined = $state();
	let svg: SVGSVGElement | undefined = $state();
	let width = $state(600);
	let height = $state(untrack(() => minHeight));
	let hoveredId: string | null = $state(null);
	let ro: ResizeObserver | undefined;

	// camera: world coordinates are unbounded (nodes settle wherever the
	// simulation puts them); these three values are what actually get shown
	let viewScale = $state(1);
	let viewX = $state(0);
	let viewY = $state(0);

	let simNodes = $state<SimNode[]>([]);
	let simLinks = $state<SimLink[]>([]);
	let sim: Simulation<SimNode, SimLink> | undefined;

	let dragNode: SimNode | null = null;
	let dragMoved = false;

	const hoveredNode = $derived(simNodes.find((n) => n.id === hoveredId));

	function labelFor(title: string): string {
		const maxChars = width < 420 ? 11 : width < 720 ? 18 : 60;
		if (title.length <= maxChars) return title;
		return title.slice(0, maxChars - 1).trimEnd() + '…';
	}

	function folderColor(folder: string): string {
		if (!folder) return 'var(--color-theme-2)';
		let hash = 0;
		for (let i = 0; i < folder.length; i++) hash = (hash * 31 + folder.charCodeAt(i)) >>> 0;
		const hue = hash % 360;
		return `hsl(${hue}deg 62% 52%)`;
	}

	// small helper so a single dragged-far or otherwise-extreme node can't
	// contaminate a shared average and fling everything else along with it
	const MAX_STEP = 40;
	function clamp(v: number, max: number): number {
		return Math.max(-max, Math.min(max, v));
	}

	function clusterForce(): Force<SimNode, SimLink> {
		let nodes: SimNode[] = [];
		const force = ((alpha: number) => {
			const centroids = new Map<string, { x: number; y: number; n: number }>();
			for (const node of nodes) {
				// a node actively being dragged shouldn't skew the centroid its
				// folder-mates get pulled toward
				if (node.fx != null || node.fy != null) continue;
				const c = centroids.get(node.folder) ?? { x: 0, y: 0, n: 0 };
				c.x += node.x ?? 0;
				c.y += node.y ?? 0;
				c.n += 1;
				centroids.set(node.folder, c);
			}
			for (const node of nodes) {
				if (node.fx != null || node.fy != null) continue;
				const c = centroids.get(node.folder);
				if (!c || c.n <= 1) continue;
				node.vx = (node.vx ?? 0) - clamp(((node.x ?? 0) - c.x / c.n) * alpha * 0.025, MAX_STEP);
				node.vy = (node.vy ?? 0) - clamp(((node.y ?? 0) - c.y / c.n) * alpha * 0.025, MAX_STEP);
			}
		}) as Force<SimNode, SimLink>;
		force.initialize = (n) => {
			nodes = n;
		};
		return force;
	}

	// gentle pull toward the center of the canvas - like Obsidian's graph view,
	// this keeps isolated notes (or a node dragged far away and released) from
	// drifting off indefinitely, without fighting the charge/link/collide forces
	// that actually determine the local layout
	function gravityForce(strength: number): Force<SimNode, SimLink> {
		let nodes: SimNode[] = [];
		const force = ((alpha: number) => {
			const cx = width / 2;
			const cy = height / 2;
			for (const node of nodes) {
				if (node.fx != null || node.fy != null) continue;
				node.vx = (node.vx ?? 0) + clamp((cx - (node.x ?? 0)) * strength * alpha, MAX_STEP);
				node.vy = (node.vy ?? 0) + clamp((cy - (node.y ?? 0)) * strength * alpha, MAX_STEP);
			}
		}) as Force<SimNode, SimLink>;
		force.initialize = (n) => {
			nodes = n;
		};
		return force;
	}

	// safety net, run last each tick: forceLink's spring correction is
	// unbounded, so if a node is dragged far from a linked neighbor (or two
	// linked nodes otherwise end up very far apart), the corrective velocity
	// can be huge - cap speed globally so that never turns into a runaway
	// explosion, regardless of which force produced it
	function velocityClampForce(maxSpeed: number): Force<SimNode, SimLink> {
		let nodes: SimNode[] = [];
		const force = (() => {
			for (const node of nodes) {
				if (node.fx != null || node.fy != null) continue;
				const vx = node.vx ?? 0;
				const vy = node.vy ?? 0;
				const speed = Math.hypot(vx, vy);
				if (speed > maxSpeed) {
					const scale = maxSpeed / speed;
					node.vx = vx * scale;
					node.vy = vy * scale;
				}
			}
		}) as Force<SimNode, SimLink>;
		force.initialize = (n) => {
			nodes = n;
		};
		return force;
	}

	function computeLayout() {
		if (!inputNodes.length) return;
		const angleStep = (2 * Math.PI) / inputNodes.length;
		const spread = Math.max(width, height) * (0.28 + Math.min(1.5, inputNodes.length / 60));
		simNodes = inputNodes.map((n, i) => ({
			...n,
			x: width / 2 + Math.cos(i * angleStep) * spread,
			y: height / 2 + Math.sin(i * angleStep) * spread
		}));
		simLinks = inputEdges.map((e) => ({ source: e.source, target: e.target }) as SimLink);

		sim?.stop();
		sim = forceSimulation<SimNode>(simNodes)
			.force('charge', forceManyBody<SimNode>().strength(-170))
			.force(
				'link',
				forceLink<SimNode, SimLink>(simLinks)
					.id((d) => d.id)
					.distance(62)
					.strength(0.55)
			)
			.force('center', forceCenter<SimNode>(width / 2, height / 2))
			.force(
				'collide',
				forceCollide<SimNode>((d) => d.r + 9)
			)
			.force('cluster', clusterForce())
			.force('gravity', gravityForce(0.035))
			.force('velocityClamp', velocityClampForce(34));
		// no .stop() here - the simulation ticks itself via its own internal
		// (non-blocking, requestAnimationFrame-driven) timer, so this never
		// freezes the page no matter how many nodes there are

		watchForSettle();
	}

	// follow the simulation with the camera while it's actively moving (initial
	// layout, or the converge/pop animation), then stop once it settles
	let settleWatchToken = 0;
	function watchForSettle() {
		const token = ++settleWatchToken;
		function poll() {
			if (!sim || token !== settleWatchToken) return;
			fitToContent();
			if (sim.alpha() > sim.alphaMin()) requestAnimationFrame(poll);
		}
		requestAnimationFrame(poll);
	}

	// "big bang" reset: briefly pull every node in toward the center into a
	// tight little clump, then let go - charge repulsion and collision naturally
	// spring everything back out into a fresh, untangled layout
	function convergeAndPop() {
		if (!sim || !simNodes.length) return;
		const cx = width / 2;
		const cy = height / 2;
		const implode = ((alpha: number) => {
			for (const n of simNodes) {
				n.vx = (n.vx ?? 0) + (cx - (n.x ?? 0)) * 0.32 * alpha;
				n.vy = (n.vy ?? 0) + (cy - (n.y ?? 0)) * 0.32 * alpha;
			}
		}) as Force<SimNode, SimLink>;
		sim.force('implode', implode);
		sim.alpha(1).restart();

		setTimeout(() => {
			sim?.force('implode', null);
			sim?.alpha(1).restart();
			watchForSettle();
		}, 380);
	}

	// frame the camera so all current nodes (plus their labels) are visible,
	// centered in the viewport - this is what lets the graph scale to far
	// more nodes than would ever fit onscreen at 1:1
	function fitToContent() {
		if (!simNodes.length) return;
		const pad = 36;
		let minX = Infinity;
		let minY = Infinity;
		let maxX = -Infinity;
		let maxY = -Infinity;
		for (const n of simNodes) {
			const x = n.x ?? 0;
			const y = n.y ?? 0;
			minX = Math.min(minX, x - n.r);
			maxX = Math.max(maxX, x + n.r);
			minY = Math.min(minY, y - n.r);
			maxY = Math.max(maxY, y + n.r + 18);
		}
		minX -= pad;
		minY -= pad;
		maxX += pad;
		maxY += pad;

		const bboxW = Math.max(1, maxX - minX);
		const bboxH = Math.max(1, maxY - minY);
		const fit = Math.min(width / bboxW, height / bboxH);
		viewScale = Math.min(2, Math.max(ZOOM_MIN, fit));

		const cx = (minX + maxX) / 2;
		const cy = (minY + maxY) / 2;
		viewX = width / 2 - cx * viewScale;
		viewY = height / 2 - cy * viewScale;
	}

	function measure() {
		if (!container) return;
		const rect = container.getBoundingClientRect();
		return { w: Math.max(260, rect.width), h: Math.max(minHeight, Math.min(rect.width * 0.72, 620)) };
	}

	function handleResize() {
		const m = measure();
		if (!m) return;
		width = m.w;
		height = m.h;
		if (simNodes.length === 0) {
			computeLayout();
		} else {
			fitToContent();
		}
	}

	// --- camera: zoom (wheel + pinch) & pan (drag empty space) ---

	function zoomAt(clientX: number, clientY: number, factor: number) {
		if (!svg) return;
		const rect = svg.getBoundingClientRect();
		const vbX = ((clientX - rect.left) / rect.width) * width;
		const vbY = ((clientY - rect.top) / rect.height) * height;
		const worldX = (vbX - viewX) / viewScale;
		const worldY = (vbY - viewY) / viewScale;
		const newScale = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, viewScale * factor));
		viewX = vbX - worldX * newScale;
		viewY = vbY - worldY * newScale;
		viewScale = newScale;
	}

	function onWheel(e: WheelEvent) {
		e.preventDefault();
		settleWatchToken++; // manual zoom takes over from any auto-follow
		const factor = Math.exp(-e.deltaY * 0.0016);
		zoomAt(e.clientX, e.clientY, factor);
	}


	const backgroundPointers = new Map<number, { x: number; y: number }>();
	let panLast = { x: 0, y: 0 };
	let pinchLastDist = 0;

	function onBackgroundPointerDown(e: PointerEvent) {
		settleWatchToken++; // manual panning/pinching takes over from any auto-follow
		backgroundPointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
		if (backgroundPointers.size === 1) {
			panLast = { x: e.clientX, y: e.clientY };
		} else if (backgroundPointers.size === 2) {
			const pts = [...backgroundPointers.values()];
			pinchLastDist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
		}
		window.addEventListener('pointermove', onBackgroundPointerMove);
		window.addEventListener('pointerup', onBackgroundPointerUp);
		window.addEventListener('pointercancel', onBackgroundPointerUp);
	}

	function onBackgroundPointerMove(e: PointerEvent) {
		if (!backgroundPointers.has(e.pointerId) || !svg) return;
		backgroundPointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

		if (backgroundPointers.size >= 2) {
			const pts = [...backgroundPointers.values()];
			const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
			const midX = (pts[0].x + pts[1].x) / 2;
			const midY = (pts[0].y + pts[1].y) / 2;
			if (pinchLastDist > 0) zoomAt(midX, midY, dist / pinchLastDist);
			pinchLastDist = dist;
		} else {
			const rect = svg.getBoundingClientRect();
			viewX += ((e.clientX - panLast.x) / rect.width) * width;
			viewY += ((e.clientY - panLast.y) / rect.height) * height;
			panLast = { x: e.clientX, y: e.clientY };
		}
	}

	function onBackgroundPointerUp(e: PointerEvent) {
		backgroundPointers.delete(e.pointerId);
		if (backgroundPointers.size === 0) {
			window.removeEventListener('pointermove', onBackgroundPointerMove);
			window.removeEventListener('pointerup', onBackgroundPointerUp);
			window.removeEventListener('pointercancel', onBackgroundPointerUp);
		} else {
			const [p] = backgroundPointers.values();
			panLast = { x: p.x, y: p.y };
			pinchLastDist = 0;
		}
	}

	// --- dragging a single node ---

	function clientToWorld(clientX: number, clientY: number) {
		const rect = svg!.getBoundingClientRect();
		const vbX = ((clientX - rect.left) / rect.width) * width;
		const vbY = ((clientY - rect.top) / rect.height) * height;
		return { x: (vbX - viewX) / viewScale, y: (vbY - viewY) / viewScale };
	}

	function onWindowPointerMove(e: PointerEvent) {
		if (!dragNode || !svg) return;
		dragMoved = true;
		const p = clientToWorld(e.clientX, e.clientY);
		dragNode.fx = p.x;
		dragNode.fy = p.y;
	}

	function onWindowPointerUp() {
		window.removeEventListener('pointermove', onWindowPointerMove);
		window.removeEventListener('pointerup', onWindowPointerUp);
		if (dragNode) {
			dragNode.fx = null;
			dragNode.fy = null;
		}
		sim?.alphaTarget(0);
		dragNode = null;
	}

	function onNodePointerDown(e: PointerEvent, node: SimNode) {
		e.preventDefault();
		// cancel any in-flight camera auto-follow (from the initial layout or
		// converge/pop animation) - otherwise it keeps calling fitToContent()
		// every frame for as long as the drag keeps alpha reheated, and since
		// the drag's own screen->world conversion depends on the current
		// viewScale, a shrinking viewScale and a growing drag distance feed
		// back into each other
		settleWatchToken++;
		dragNode = node;
		dragMoved = false;
		node.fx = node.x;
		node.fy = node.y;
		sim?.alphaTarget(0.3).restart();
		window.addEventListener('pointermove', onWindowPointerMove);
		window.addEventListener('pointerup', onWindowPointerUp);
	}

	function openNote(slug: string) {
		if (dragMoved) return;
		goto(resolve('/notes/[...slug]', { slug }));
	}

	function isConnected(id: string): boolean {
		if (!hoveredId) return false;
		if (id === hoveredId) return true;
		return simLinks.some((l) => {
			const s = typeof l.source === 'object' ? (l.source as SimNode).id : l.source;
			const t = typeof l.target === 'object' ? (l.target as SimNode).id : l.target;
			return (s === hoveredId && t === id) || (t === hoveredId && s === id);
		});
	}

	function linkCoord(end: SimNode | string | number, axis: 'x' | 'y'): number {
		if (typeof end === 'object') return (end[axis] as number) ?? 0;
		const node = simNodes.find((n) => n.id === end);
		return node ? ((node[axis] as number) ?? 0) : 0;
	}

	onMount(() => {
		handleResize();
		ro = new ResizeObserver(() => handleResize());
		if (container) ro.observe(container);
	});

	onDestroy(() => {
		ro?.disconnect();
		sim?.stop();
		if (typeof window !== 'undefined') {
			window.removeEventListener('pointermove', onWindowPointerMove);
			window.removeEventListener('pointerup', onWindowPointerUp);
			window.removeEventListener('pointermove', onBackgroundPointerMove);
			window.removeEventListener('pointerup', onBackgroundPointerUp);
			window.removeEventListener('pointercancel', onBackgroundPointerUp);
		}
	});
</script>

<div class="graph-wrap" bind:this={container}>
	<div class="graph-canvas">
		<svg
			bind:this={svg}
			class="graph-svg"
			viewBox="0 0 {width} {height}"
			role="img"
			aria-label="Graph of linked notes"
			onwheel={onWheel}
		>
			<rect
				class="graph-background"
				role="presentation"
				aria-hidden="true"
				x="0"
				y="0"
				{width}
				{height}
				onpointerdown={onBackgroundPointerDown}
			/>
			<g transform="translate({viewX} {viewY}) scale({viewScale})">
				<g class="wobbly" >
					{#each simLinks as link, i (i)}
						<line
							x1={linkCoord(link.source, 'x')}
							y1={linkCoord(link.source, 'y')}
							x2={linkCoord(link.target, 'x')}
							y2={linkCoord(link.target, 'y')}
							class="edge"
						/>
					{/each}
					{#each simNodes as node (node.id)}
						<circle
							cx={node.x}
							cy={node.y}
							r={node.r + (hoveredId === node.id || node.id === currentSlug ? 3 : 0)}
							class="node-circle"
							class:current={node.id === currentSlug}
							class:dim={hoveredId !== null && !isConnected(node.id)}
							style="fill:{folderColor(node.folder)}"
						/>
					{/each}
				</g>
				<g class="labels">
					{#each simNodes as node (node.id)}
						<text
							x={node.x}
							y={(node.y ?? 0) + node.r + 13}
							class="node-label"
							class:current={node.id === currentSlug}
							class:dim={hoveredId !== null && !isConnected(node.id)}
						>
							{labelFor(node.title)}<title>{node.title}</title>
						</text>
					{/each}
				</g>
				<g class="hit-targets">
					{#each simNodes as node (node.id)}
						<circle
							cx={node.x}
							cy={node.y}
							r={node.r + 11}
							class="hit"
							role="button"
							tabindex="0"
							aria-label="Open note {node.title}"
							onpointerdown={(e) => onNodePointerDown(e, node)}
							onpointerenter={() => (hoveredId = node.id)}
							onpointerleave={() => (hoveredId = null)}
							onclick={() => openNote(node.id)}
							onkeydown={(e) => {
								if (e.key === 'Enter' || e.key === ' ') {
									e.preventDefault();
									openNote(node.id);
								}
							}}
						/>
					{/each}
				</g>
			</g>
		</svg>
		<div class="zoom-controls">
			<button type="button" onclick={fitToContent} aria-label="Reset view" title="Fit everything in view">
				⤢
			</button>
			<button
				type="button"
				class="converge-btn"
				onclick={convergeAndPop}
				aria-label="Converge and pop back out"
				title="Pull everything together, then let it spring back apart"
			>
				<svg viewBox="0 0 20 20" aria-hidden="true">
					<circle cx="10" cy="10" r="2.1" fill="currentColor" stroke="none" />
					<g stroke="currentColor" stroke-width="1.4" stroke-linecap="round">
						<line x1="10" y1="10" x2="10" y2="3" />
						<line x1="10" y1="10" x2="10" y2="17" />
						<line x1="10" y1="10" x2="3" y2="10" />
						<line x1="10" y1="10" x2="17" y2="10" />
						<line x1="10" y1="10" x2="4.5" y2="4.5" />
						<line x1="10" y1="10" x2="15.5" y2="15.5" />
						<line x1="10" y1="10" x2="4.5" y2="15.5" />
						<line x1="10" y1="10" x2="15.5" y2="4.5" />
					</g>
				</svg>
			</button>
		</div>
	</div>
	<div class="graph-footer">
		{#if hoveredNode}
			<p class="caption hover-info">
				<strong>{hoveredNode.title}</strong>{hoveredNode.folder ? ` — ${hoveredNode.folder}` : ''}
			</p>
		{:else if caption}
			<p class="caption">{caption}</p>
		{/if}
	</div>
</div>

<style>
	.graph-wrap {
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	.graph-canvas {
		position: relative;
	}

	.graph-svg {
		display: block;
		width: 100%;
		height: auto;
		touch-action: none;
		cursor: grab;
	}

	.graph-background {
		fill: transparent;
		pointer-events: all;
	}

	.edge {
		stroke: var(--sketchy-stroke);
		stroke-opacity: 0.45;
		stroke-width: 1.4;
	}

	.node-circle {
		stroke: var(--sketchy-stroke);
		stroke-width: 1.4;
		transition:
			opacity 0.15s ease,
			r 0.1s ease;
	}

	.node-circle.current {
		stroke: var(--color-theme-1);
		stroke-width: 2.4;
	}

	.node-circle.dim {
		opacity: 0.25;
	}

	.node-label {
		font-family: var(--font-hand);
		font-size: 0.85rem;
		text-anchor: middle;
		fill: var(--color-text);
		pointer-events: none;
		transition: opacity 0.15s ease;
	}

	.node-label.current {
		fill: var(--color-theme-1);
		font-weight: 700;
	}

	.node-label.dim {
		opacity: 0.3;
	}

	.hit {
		fill: transparent;
		cursor: grab;
	}

	.hit:active {
		cursor: grabbing;
	}

	.zoom-controls {
		position: absolute;
		top: 0.6rem;
		right: 0.6rem;
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}

	.zoom-controls button {
		width: 1.9rem;
		height: 1.9rem;
		border-radius: 50%;
		border: 1.5px solid var(--sketchy-stroke);
		background: var(--paper-bg);
		color: var(--color-text);
		font-family: var(--font-hand);
		font-size: 1.05rem;
		line-height: 1;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		opacity: 0.8;
		transition:
			opacity 0.15s ease,
			transform 0.1s ease;
	}

	.zoom-controls button:hover {
		opacity: 1;
		transform: scale(1.08);
	}

	.converge-btn svg {
		width: 1.05rem;
		height: 1.05rem;
		transition: transform 0.15s ease;
	}

	.converge-btn:active svg {
		transform: scale(0.85);
	}

	.graph-footer {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		margin-top: 0.5rem;
		min-height: 1.2em;
	}

	.caption {
		font-size: 0.8rem;
		font-style: italic;
		opacity: 0.65;
		margin: 0;
	}

	.hover-info {
		font-style: normal;
		opacity: 0.9;
	}
</style>
