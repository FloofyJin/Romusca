import { Marked, type RendererObject, type Tokens, type TokenizerAndRendererExtension } from 'marked';
import hljs from 'highlight.js/lib/core';
import bash from 'highlight.js/lib/languages/bash';
import c from 'highlight.js/lib/languages/c';
import cpp from 'highlight.js/lib/languages/cpp';
import python from 'highlight.js/lib/languages/python';
import tcl from 'highlight.js/lib/languages/tcl';
import verilog from 'highlight.js/lib/languages/verilog';
import { headingSlug } from './slug';
import { transformWikilinks } from './wikilinks';
import type { Heading, NoteFile, RenderedNote } from './types';

hljs.registerLanguage('bash', bash);
hljs.registerLanguage('shell', bash);
hljs.registerLanguage('sh', bash);
hljs.registerLanguage('c', c);
hljs.registerLanguage('cpp', cpp);
hljs.registerLanguage('c++', cpp);
hljs.registerLanguage('python', python);
hljs.registerLanguage('tcl', tcl);
hljs.registerLanguage('verilog', verilog);

function escapeHtml(s: string): string {
	return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function highlightCode(code: string, lang: string | undefined): { html: string; label: string } {
	const language = (lang ?? '').trim().split(/\s+/)[0].toLowerCase();
	try {
		if (language && hljs.getLanguage(language)) {
			return { html: hljs.highlight(code, { language }).value, label: language };
		}
		const auto = hljs.highlightAuto(code);
		return { html: auto.value, label: auto.language ?? 'text' };
	} catch {
		return { html: escapeHtml(code), label: language || 'text' };
	}
}

// marked has no built-in syntax for ==highlighted text== (it's not part of
// CommonMark/GFM), so it's added as a small inline extension
const highlightExtension: TokenizerAndRendererExtension = {
	name: 'highlightMark',
	level: 'inline',
	start(src) {
		const i = src.indexOf('==');
		return i === -1 ? undefined : i;
	},
	tokenizer(src) {
		const match = /^==([^\n=]+?)==/.exec(src);
		if (!match) return undefined;
		return {
			type: 'highlightMark',
			raw: match[0],
			text: match[1],
			tokens: this.lexer.inlineTokens(match[1])
		};
	},
	renderer(token) {
		return `<mark>${this.parser.parseInline(token.tokens ?? [])}</mark>`;
	}
};

function createRenderer(headings: Heading[]): RendererObject {
	return {
		heading({ tokens, depth, text }: Tokens.Heading) {
			const id = headingSlug(text);
			headings.push({ depth, text, id });
			const inner = this.parser.parseInline(tokens);
			return `<h${depth} id="${id}" class="note-heading"><a class="note-heading-anchor" href="#${id}" aria-label="Link to this section">§</a>${inner}</h${depth}>\n`;
		},

		code({ text, lang }: Tokens.Code) {
			const { html, label } = highlightCode(text, lang);
			return `<div class="code-block" data-lang="${escapeHtml(label)}"><pre><code class="hljs language-${escapeHtml(label)}">${html}</code></pre></div>\n`;
		},

		image({ href, title, text }: Tokens.Image) {
			const titleAttr = title ? ` title="${escapeHtml(title)}"` : '';
			return `<img src="${href}" alt="${escapeHtml(text ?? '')}"${titleAttr} loading="lazy" />`;
		},

		link({ href, title, tokens }: Tokens.Link) {
			const label = this.parser.parseInline(tokens);
			const isExternal = /^[a-z]+:\/\//i.test(href ?? '') && !href?.startsWith('/');
			const titleAttr = title ? ` title="${escapeHtml(title)}"` : '';
			const externalAttrs = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
			return `<a href="${href}"${titleAttr}${externalAttrs}>${label}</a>`;
		}
	};
}

export function renderNote(note: NoteFile): RenderedNote {
	const { text, linksTo } = transformWikilinks(note.raw, note);
	const headings: Heading[] = [];
	const marked = new Marked({
		renderer: createRenderer(headings),
		extensions: [highlightExtension],
		gfm: true,
		breaks: false
	});
	const html = marked.parse(text, { async: false }) as string;
	return { ...note, html, headings, linksTo };
}
