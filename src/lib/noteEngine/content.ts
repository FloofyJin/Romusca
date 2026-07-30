import { segmentSlug } from './slug';
import type { NoteFile, TreeNode } from './types';

const rawModules = import.meta.glob('../notes/**/*.md', {
	query: '?raw',
	import: 'default',
	eager: true
}) as Record<string, string>;

const imageModules = import.meta.glob(
	'../notes/**/*.{png,jpg,jpeg,gif,webp,svg}',
	{ query: '?url', import: 'default', eager: true }
) as Record<string, string>;

function relativeToNotesRoot(key: string): string {
	const marker = '/notes/';
	const idx = key.indexOf(marker);
	return idx === -1 ? key : key.slice(idx + marker.length);
}

function buildNoteFile(key: string, raw: string): NoteFile {
	const relPath = relativeToNotesRoot(key);
	const parts = relPath.split('/');
	const fileName = parts.pop()!.replace(/\.md$/i, '');
	return {
		slug: [...parts, fileName].map(segmentSlug).join('/'),
		title: fileName,
		folderPath: parts,
		folderSlug: parts.map(segmentSlug),
		raw
	};
}

export const notes: NoteFile[] = Object.entries(rawModules)
	.map(([key, raw]) => buildNoteFile(key, raw))
	.sort((a, b) => a.title.localeCompare(b.title));

export const notesBySlug: Map<string, NoteFile> = new Map(notes.map((n) => [n.slug, n]));

/** attachment lookup by bare filename, since Obsidian embeds reference images by basename only */
export const imagesByBasename: Map<string, string> = new Map();
for (const [key, url] of Object.entries(imageModules)) {
	const relPath = relativeToNotesRoot(key);
	const basename = relPath.split('/').pop()!;
	imagesByBasename.set(basename, url);
}

const notesByStem: Map<string, NoteFile[]> = new Map();
for (const note of notes) {
	const key = note.title.toLowerCase();
	const list = notesByStem.get(key) ?? [];
	list.push(note);
	notesByStem.set(key, list);
}

/** Resolve an Obsidian `[[wikilink]]` target against the vault, preferring a match in the linking note's own folder when the stem is ambiguous. */
export function resolveWikilinkTarget(linkText: string, fromNote: NoteFile): NoteFile | undefined {
	const cleaned = linkText.trim();
	if (!cleaned) return undefined;

	const asSlug = cleaned
		.split('/')
		.map((s) => segmentSlug(s))
		.join('/');
	const direct = notesBySlug.get(asSlug);
	if (direct) return direct;

	const stem = cleaned.split('/').pop()!.toLowerCase();
	const candidates = notesByStem.get(stem);
	if (!candidates || candidates.length === 0) return undefined;
	if (candidates.length === 1) return candidates[0];

	const sameFolder = candidates.find(
		(c) => c.folderSlug.join('/') === fromNote.folderSlug.join('/')
	);
	return sameFolder ?? candidates[0];
}

export function buildTree(allNotes: NoteFile[]): TreeNode[] {
	const root: TreeNode[] = [];

	function ensureFolder(children: TreeNode[], path: string[], depth: number): TreeNode[] {
		if (depth >= path.length) return children;
		const name = path[depth];
		let folder = children.find(
			(n) => n.type === 'folder' && n.name === name
		) as Extract<TreeNode, { type: 'folder' }> | undefined;
		if (!folder) {
			const slugPath = path
				.slice(0, depth + 1)
				.map((s) => segmentSlug(s))
				.join('/');
			folder = { type: 'folder', name, slugPath, children: [] };
			children.push(folder);
		}
		return ensureFolder(folder.children, path, depth + 1);
	}

	for (const note of allNotes) {
		const parent = ensureFolder(root, note.folderPath, 0);
		parent.push({ type: 'file', name: note.title, slug: note.slug });
	}

	sortTree(root);
	return root;
}

function sortTree(nodes: TreeNode[]) {
	nodes.sort((a, b) => {
		if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
		return a.name.localeCompare(b.name);
	});
	for (const node of nodes) {
		if (node.type === 'folder') sortTree(node.children);
	}
}
