import { error } from '@sveltejs/kit';
import { notes, renderedBySlug, backlinksBySlug, graphNodes, graphEdges } from '$lib/noteEngine';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () => notes.map((n) => ({ slug: n.slug }));

export const load: PageLoad = ({ params }) => {
	const note = renderedBySlug.get(params.slug);
	if (!note) {
		error(404, `No note at "${params.slug}"`);
	}

	const neighborIds = new Set<string>([note.slug]);
	for (const target of note.linksTo) neighborIds.add(target);
	for (const back of backlinksBySlug.get(note.slug) ?? []) neighborIds.add(back);

	const localNodes = graphNodes.filter((n) => neighborIds.has(n.id));
	const localEdges = graphEdges.filter((e) => neighborIds.has(e.source) && neighborIds.has(e.target));

	const backlinkTitles = (backlinksBySlug.get(note.slug) ?? [])
		.map((slug) => renderedBySlug.get(slug))
		.filter((n): n is NonNullable<typeof n> => Boolean(n));

	return { note, localNodes, localEdges, backlinkTitles };
};
