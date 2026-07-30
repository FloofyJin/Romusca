import { notes } from './content';
import { renderNote } from './markdown';
import type { GraphEdge, GraphNode, RenderedNote } from './types';

export const renderedNotes: RenderedNote[] = notes.map(renderNote);
export const renderedBySlug: Map<string, RenderedNote> = new Map(
	renderedNotes.map((n) => [n.slug, n])
);

export const graphNodes: GraphNode[] = renderedNotes.map((n) => ({
	id: n.slug,
	title: n.title,
	folder: n.folderPath.join('/'),
	r: 9
}));

const edgeKeys = new Set<string>();
export const graphEdges: GraphEdge[] = [];
for (const note of renderedNotes) {
	for (const target of note.linksTo) {
		if (target === note.slug || !renderedBySlug.has(target)) continue;
		const key = [note.slug, target].sort().join('~~');
		if (edgeKeys.has(key)) continue;
		edgeKeys.add(key);
		graphEdges.push({ source: note.slug, target });
	}
}

export const backlinksBySlug: Map<string, string[]> = new Map();
for (const note of renderedNotes) {
	for (const target of note.linksTo) {
		if (!renderedBySlug.has(target)) continue;
		const list = backlinksBySlug.get(target) ?? [];
		list.push(note.slug);
		backlinksBySlug.set(target, list);
	}
}
