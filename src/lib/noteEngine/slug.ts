/** Slugify a single path segment (folder or file name) for use in a URL. */
export function segmentSlug(name: string): string {
	return name
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

/**
 * Slugify heading text for use as an in-page anchor id. Obsidian header links
 * are sometimes typed by hand without the exact punctuation of the heading
 * (e.g. a dropped colon), so this strips punctuation entirely rather than
 * just swapping spaces for dashes - that keeps `[[#Some Header]]` resolving
 * even when the source heading is `### Some: Header`.
 */
export function headingSlug(text: string): string {
	return text
		.replace(/`([^`]*)`/g, '$1')
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9\s-]/g, '')
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-')
		.replace(/^-+|-+$/g, '');
}
