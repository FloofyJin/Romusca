export type Theme = 'light' | 'dark';

function readInitialTheme(): Theme {
	if (typeof document === 'undefined') return 'light';
	return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}

export const theme = $state({ current: readInitialTheme() });

export function toggleTheme() {
	setTheme(theme.current === 'dark' ? 'light' : 'dark');
}

export function setTheme(next: Theme) {
	theme.current = next;
	document.documentElement.setAttribute('data-theme', next);
	localStorage.setItem('theme', next);
}
