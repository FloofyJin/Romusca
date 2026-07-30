import { resolve } from '$app/paths';
import { imagesByBasename, resolveWikilinkTarget } from './content';
import { headingSlug } from './slug';
import type { NoteFile } from './types';

const IMAGE_EMBED_RE = /!\[\[([^\]]+)\]\]/g;
const NOTE_LINK_RE = /\[\[([^\]]+)\]\]/g;

function escapeAttr(s: string): string {
	return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

/**
 * Rewrite Obsidian `[[wikilinks]]` and `![[embeds]]` in raw note markdown into
 * plain markdown (or inline HTML for images) that `marked` can render, and
 * collect which other notes this note links to along the way.
 */
export function transformWikilinks(
	raw: string,
	fromNote: NoteFile
): { text: string; linksTo: string[] } {
	const linksTo = new Set<string>();

	let text = raw.replace(IMAGE_EMBED_RE, (_match, inner: string) => {
		const [namePart, sizePart] = inner.split('|').map((s: string) => s.trim());
		const basename = namePart.split('/').pop()!;
		const url = imagesByBasename.get(basename);
		if (!url) {
			return `<span class="note-broken-embed">🖼 missing attachment: ${escapeAttr(basename)}</span>`;
		}
		const widthAttr = sizePart && /^\d+$/.test(sizePart) ? ` width="${sizePart}"` : '';
		return `<img src="${url}" alt="${escapeAttr(namePart)}"${widthAttr} loading="lazy" />`;
	});

	text = text.replace(NOTE_LINK_RE, (_match, inner: string) => {
		const [target, alias] = inner.split('|').map((s: string) => s.trim());
		const [notePart, headingPart] = target.split('#');

		if (!notePart) {
			const href = `#${headingSlug(headingPart ?? '')}`;
			const label = alias ?? headingPart ?? target;
			return `[${label}](${href})`;
		}

		const resolved = resolveWikilinkTarget(notePart, fromNote);
		if (!resolved) {
			return `<span class="note-broken-link" title="Note not found: ${escapeAttr(notePart)}">${alias ?? notePart}</span>`;
		}
		linksTo.add(resolved.slug);
		const base = resolve('/notes/[...slug]', { slug: resolved.slug });
		const href = headingPart ? `${base}#${headingSlug(headingPart)}` : base;
		const label = alias ?? notePart;
		return `[${label}](${href})`;
	});

	return { text, linksTo: [...linksTo] };
}
