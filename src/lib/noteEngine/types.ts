export interface Heading {
	depth: number;
	text: string;
	id: string;
}

export interface NoteFile {
	/** folder-scoped, URL-safe id, e.g. "axle/design" */
	slug: string;
	/** display title, e.g. "Design" */
	title: string;
	/** display folder segments, e.g. ["Axle"] */
	folderPath: string[];
	/** slugified folder segments, e.g. ["axle"] */
	folderSlug: string[];
	/** raw markdown source, straight from disk */
	raw: string;
}

export interface RenderedNote extends NoteFile {
	html: string;
	headings: Heading[];
	/** slugs of notes this note links to, deduped */
	linksTo: string[];
}

export type TreeNode =
	| { type: 'folder'; name: string; slugPath: string; children: TreeNode[] }
	| { type: 'file'; name: string; slug: string };

export interface GraphNode {
	id: string;
	title: string;
	folder: string;
	r: number;
}

export interface GraphEdge {
	source: string;
	target: string;
}
