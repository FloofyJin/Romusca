<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import github from '$lib/images/github.svg';
	import { theme, toggleTheme } from '$lib/theme.svelte';
</script>

<header>
	<div class="corner">
	</div>

	<nav>
		<ul>
			<li aria-current={page.url.pathname === '/' ? 'page' : undefined}>
				<a href={resolve('/')}>Home</a>
			</li>
			<!-- <li aria-current={page.url.pathname === '/about' ? 'page' : undefined}>
				<a href={resolve('/about')}>About</a>
			</li> -->
			<li aria-current={page.url.pathname === '/resume' ? 'page' : undefined}>
				<a href={resolve('/resume')}>Resume</a>
			</li>
		</ul>
	</nav>

	<div class="corner actions">
		<button
			class="theme-toggle"
			type="button"
			onclick={toggleTheme}
			aria-label={theme.current === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
		>
			{theme.current === 'dark' ? '☀️' : '🌙'}
		</button>
		<a class="icon-link" href="https://github.com/FloofyJin">
			<img src={github} alt="GitHub" />
		</a>
	</div>
</header>

<style>
	header {
		display: flex;
		justify-content: space-between;
	}

	.corner {
		width: 3em;
		height: 3em;
	}

	.corner a {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
	}

	.corner img {
		width: 2em;
		height: 2em;
		object-fit: contain;
	}

	.corner.actions {
		width: auto;
		display: flex;
		align-items: center;
		gap: 0.5em;
	}

	.corner.actions .icon-link {
		width: 3em;
	}

	.theme-toggle {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2em;
		height: 2em;
		border: none;
		background: transparent;
		cursor: pointer;
		font-size: 1.1em;
		line-height: 1;
		padding: 0;
		border-radius: 50%;
		transition: background-color 0.2s ease;
	}

	.theme-toggle:hover {
		background-color: rgba(128, 128, 128, 0.15);
	}

	nav {
		display: flex;
		justify-content: center;
	}

	svg {
		width: 2em;
		height: 3em;
		display: block;
	}

	path {
		fill: var(--background);
	}

	ul {
		position: relative;
		padding: 0;
		margin: 0;
		height: 3em;
		display: flex;
		justify-content: center;
		align-items: center;
		list-style: none;
		/* background: var(--background); */
		background-size: contain;
	}

	li {
		position: relative;
		height: 100%;
	}

	li[aria-current='page']::before {
		--size: 6px;
		content: '';
		width: 0;
		height: 0;
		position: absolute;
		top: 0;
	}

	nav a {
		display: flex;
		height: 100%;
		align-items: center;
		padding: 0 0.5rem;
		color: var(--color-text);
		font-weight: 700;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		text-decoration: none;
		transition: color 0.2s linear;
	}

	a:hover {
		color: var(--color-theme-1);
	}
</style>
