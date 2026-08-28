<script lang="ts">
	import { Menu, Search as SearchIcon, X } from "@lucide/svelte";
	import { tick } from "svelte";
	import type { Snippet } from "svelte";

	interface LinkItem {
		name: string;
		link: string;
	}

	interface ProcessedLinkItem extends LinkItem {
		href: string;
		external: boolean;
	}

	interface Section {
		name: string;
		linkPrefix: string;
		links: LinkItem[];
	}

	interface ProcessedSection extends Section {
		links: ProcessedLinkItem[];
	}

	interface Props {
		software: string;
		collection: "magic" | "neoroute";
		linkPrefix: string;
		children: Snippet;
		sections: Section[];
		currentPath: string;
	}

	interface PagefindSearchResultData {
		url: string;
		meta: {
			title?: string;
		};
		excerpt?: string;
	}

	interface PagefindSearchResult {
		data: () => Promise<PagefindSearchResultData>;
	}

	interface PagefindSearchResponse {
		results: PagefindSearchResult[];
	}

	interface PagefindModule {
		search: (
			term: string,
			options?: {
				filters?: Record<string, string[]>;
			},
		) => Promise<PagefindSearchResponse>;
	}

	let { software, collection, linkPrefix, children, sections, currentPath }: Props =
		$props();

	const processedSections: ProcessedSection[] = $derived(
		sections.map((section) => ({
			...section,
			links: section.links.map((link) => {
				const external =
					link.link.startsWith("https://") ||
					link.link.startsWith("http://");
				return {
					...link,
					href: external ? link.link : linkPrefix + link.link,
					external,
				};
			}),
		})),
	);

	let isSidebarOpen = $state(false);
	let isSearchOpen = $state(false);
	let searchQuery = $state("");
	let searchResults = $state<
		{ url: string; title: string; excerpt: string | null }[]
	>([]);
	let isSearching = $state(false);
	let searchError = $state<string | null>(null);
	let searchInputElement: HTMLInputElement | null = null;
	let pagefind: PagefindModule | null = null;

	const searchButtonText = $derived(
		collection === "magic" ? "Search Magic docs" : "Search Neoroute docs",
	);

	const searchFilters = $derived({
		collection: [collection],
	});

	function syncBodyOverflow() {
		document.body.style.overflow = isSidebarOpen || isSearchOpen ? "hidden" : "";
	}

	function toggleSidebar() {
		isSidebarOpen = !isSidebarOpen;
		syncBodyOverflow();
	}

	function closeSidebar() {
		isSidebarOpen = false;
		syncBodyOverflow();
	}

	async function openSearch() {
		isSidebarOpen = false;
		isSearchOpen = true;
		syncBodyOverflow();
		await tick();
		searchInputElement?.focus();
	}

	function closeSearch() {
		isSearchOpen = false;
		searchQuery = "";
		searchResults = [];
		searchError = null;
		syncBodyOverflow();
	}

	function isTextEntryTarget(target: EventTarget | null) {
		const element = target as HTMLElement | null;
		if (!element) return false;
		return (
			element.tagName === "INPUT" ||
			element.tagName === "TEXTAREA" ||
			element.isContentEditable
		);
	}

	async function loadPagefind() {
		if (pagefind) return pagefind;
		const pagefindScriptPath = "/pagefind/pagefind.js";
		pagefind = await import(/* @vite-ignore */ pagefindScriptPath);
		return pagefind;
	}

	async function runSearch(query: string) {
		searchQuery = query;
		const normalizedQuery = query.trim();
		if (!normalizedQuery) {
			searchResults = [];
			searchError = null;
			return;
		}

		isSearching = true;
		searchError = null;

		try {
			const pagefindModule = await loadPagefind();
			const response = await pagefindModule.search(normalizedQuery, {
				filters: searchFilters,
			});
			const rawResults = await Promise.all(
				response.results.slice(0, 8).map((result) => result.data()),
			);
			searchResults = rawResults.map((result) => ({
				url: result.url,
				title: result.meta.title ?? "Untitled",
				excerpt: result.excerpt ?? null,
			}));
		} catch (error) {
			console.error(error);
			searchError = "Search is temporarily unavailable.";
		} finally {
			isSearching = false;
		}
	}

	function handleEscape(e: KeyboardEvent) {
		if (e.key === "Escape") {
			if (isSearchOpen) {
				closeSearch();
				return;
			}
			if (isSidebarOpen) {
				closeSidebar();
			}
			return;
		}

		if (
			e.key === "/" &&
			!e.metaKey &&
			!e.ctrlKey &&
			!e.altKey &&
			!e.shiftKey &&
			!e.repeat &&
			!isTextEntryTarget(e.target)
		) {
			e.preventDefault();
			openSearch();
		}
	}
</script>

<svelte:window onkeydown={handleEscape} />

<div
	class="flex w-full justify-center"
	data-pagefind-filter={`collection:${collection}`}
>
	<div class="flex w-full max-w-6xl px-4 font-mono text-bg-100">
		<!-- Desktop Navigation sidebar -->
		<div
			class="hidden lg:flex sticky inset-0 h-screen max-w-60 justify-center bg-bg-800"
		>
			<!-- Sidebar content -->
			<div
				class="sidebar-scroll flex w-full flex-col justify-between gap-8 font-mono overflow-y-auto pr-10"
			>
				<div class="flex w-full flex-col gap-6 py-4">
					<button
						type="button"
						class="search-trigger"
						onclick={openSearch}
					>
						<span class="search-trigger-main">
							<SearchIcon size={16} />
							{searchButtonText}
						</span>
						<span class="search-trigger-key">/</span>
					</button>

					<!-- Links at the top of the sidebar -->
					{#each processedSections as section}
						<div class="flex flex-col gap-3">
							{#if section.name}
								<p class="font-bold text-p-blue-200">
									{section.name}
								</p>
							{/if}

							{#each section.links as link}
								<a
									class={`w-max border-b-2 transition-colors ${currentPath.includes(link.link) ? "border-bg-100 text-bg-100" : "border-transparent text-bg-200"} hover:border-b-2 hover:border-bg-100`}
									href={link.href}
									target={link.external
										? "_blank"
										: undefined}
									rel={link.external
										? "noopener noreferrer"
										: undefined}
								>
									{link.name}
								</a>
							{/each}
						</div>
					{/each}
				</div>
			</div>

			<!-- Separator between sidebar and main content -->
			<div class="w-0.5 bg-bg-500 my-4"></div>
		</div>

		<!-- Content for the page -->
		<div class="w-full py-4 lg:py-4 lg:pl-10 overflow-x-hidden min-w-0">
			{@render children()}
		</div>
	</div>
</div>

<!-- Mobile sidebar overlay -->
<div
	role="button"
	tabindex="0"
	onclick={(e) => {
		if (e.target === e.currentTarget) {
			closeSidebar();
		}
	}}
	onkeydown={(e) => {
		if (e.key === "Escape") {
			closeSidebar();
		}
	}}
	class="fixed inset-0 bg-bg-800/80 backdrop-blur-sm lg:hidden transition-opacity duration-300 z-50"
	class:opacity-0={!isSidebarOpen}
	class:opacity-100={isSidebarOpen}
	class:pointer-events-none={!isSidebarOpen}
>
	<div
		class="fixed inset-y-0 left-0 w-64 max-w-[75vw] bg-bg-800/95 shadow-2xl transform transition-transform duration-300 flex"
		class:-translate-x-full={!isSidebarOpen}
		class:translate-x-0={isSidebarOpen}
	>
		<div class="h-full overflow-y-auto p-6 flex-1">
			<div class="flex flex-col gap-6 font-mono text-bg-100">
				<button type="button" class="search-trigger" onclick={openSearch}>
					<span class="search-trigger-main">
						<SearchIcon size={16} />
						{searchButtonText}
					</span>
					<span class="search-trigger-key">/</span>
				</button>

				<!-- Links -->
				{#each processedSections as section}
					<div class="flex flex-col gap-3">
						{#if section.name}
							<p class="font-bold text-p-blue-200">
								{section.name}
							</p>
						{/if}

						{#each section.links as link}
							<a
								onclick={closeSidebar}
								class={`w-max border-b-2 transition-colors ${currentPath.includes(link.link) ? "border-bg-100 text-bg-100" : "border-transparent text-bg-200"} hover:border-b-2 hover:border-bg-100`}
								href={link.href}
								target={link.external ? "_blank" : undefined}
								rel={link.external
									? "noopener noreferrer"
									: undefined}
							>
								{link.name}
							</a>
						{/each}
					</div>
				{/each}
			</div>
		</div>

		<!-- Separator line on the right edge -->
		<div class="w-0.5 bg-bg-500"></div>
	</div>
</div>

{#if isSearchOpen}
	<div
		role="button"
		tabindex="0"
		class="search-overlay"
		onclick={(e) => {
			if (e.target === e.currentTarget) closeSearch();
		}}
		onkeydown={(e) => {
			if (e.key === "Escape") closeSearch();
		}}
	>
		<div class="search-modal" role="dialog" aria-modal="true">
			<div class="search-input-wrap">
				<SearchIcon size={18} />
				<input
					bind:this={searchInputElement}
					type="text"
					placeholder={searchButtonText}
					value={searchQuery}
					oninput={(e) =>
						runSearch((e.currentTarget as HTMLInputElement).value)}
				/>
				<button type="button" class="search-close" onclick={closeSearch}>
					<X size={16} />
				</button>
			</div>

			<div class="search-results">
				{#if searchError}
					<p class="search-message text-error">{searchError}</p>
				{:else if isSearching}
					<p class="search-message">Searching…</p>
				{:else if searchQuery.trim().length === 0}
					<p class="search-message">
						Type to search within {collection} docs.
					</p>
				{:else if searchResults.length === 0}
					<p class="search-message">No results found.</p>
				{:else}
					{#each searchResults as result}
						<a href={result.url} class="search-result" onclick={closeSearch}>
							<p class="search-result-title">{result.title}</p>
							{#if result.excerpt}
								<p class="search-result-excerpt">{result.excerpt}</p>
							{/if}
						</a>
					{/each}
				{/if}
			</div>
		</div>
	</div>
{/if}

<!-- Floating Action Button (Mobile only) -->
<button
	onclick={toggleSidebar}
	class="fixed bottom-6 right-6 w-14 h-14 bg-bg-600 hover:bg-bg-500 text-bg-100 rounded-full shadow-lg lg:hidden flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 z-60"
	aria-label={isSidebarOpen
		? "Close documentation sidebar"
		: "Open documentation sidebar"}
>
	{#if isSidebarOpen}
		<X class="transition-opacity duration-300" />
	{:else}
		<Menu class="transition-opacity duration-300" />
	{/if}
</button>

<style>
	.search-trigger {
		display: flex;
		width: 100%;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
		border: 2px solid var(--color-bg-500);
		border-radius: 0.75rem;
		padding: 0.5rem 0.75rem;
		color: var(--color-bg-150);
		background-color: var(--color-bg-700);
		transition: border-color 120ms ease;
		cursor: pointer;
	}

	.search-trigger:hover {
		border-color: var(--color-p-blue-200);
	}

	.search-trigger-main {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.875rem;
	}

	.search-trigger-key {
		font-size: 0.75rem;
		padding: 0.125rem 0.4rem;
		border-radius: 0.4rem;
		border: 1px solid var(--color-bg-500);
		color: var(--color-bg-200);
	}

	.search-overlay {
		position: fixed;
		inset: 0;
		background: rgb(19 19 19 / 75%);
		backdrop-filter: blur(8px);
		display: flex;
		align-items: flex-start;
		justify-content: center;
		padding: 12vh 1rem 1rem;
		z-index: 70;
	}

	.search-modal {
		width: min(44rem, 100%);
		max-height: min(70vh, 36rem);
		border: 2px solid var(--color-bg-500);
		border-radius: 1rem;
		background-color: var(--color-bg-800);
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.search-input-wrap {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		padding: 0.75rem 1rem;
		border-bottom: 1px solid var(--color-bg-500);
		color: var(--color-bg-200);
	}

	.search-input-wrap input {
		flex: 1;
		background: transparent;
		border: none;
		outline: none;
		font-family: inherit;
		font-size: 0.95rem;
		color: var(--color-bg-100);
	}

	.search-input-wrap input::placeholder {
		color: var(--color-bg-300);
	}

	.search-close {
		width: 1.75rem;
		height: 1.75rem;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		background: transparent;
		color: var(--color-bg-200);
		border: 1px solid var(--color-bg-500);
		border-radius: 0.5rem;
		cursor: pointer;
	}

	.search-close:hover {
		color: var(--color-bg-100);
		border-color: var(--color-p-blue-200);
	}

	.search-results {
		overflow-y: auto;
		display: flex;
		flex-direction: column;
	}

	.search-message {
		padding: 1rem;
		color: var(--color-bg-200);
		font-size: 0.9rem;
	}

	.search-result {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		padding: 0.9rem 1rem;
		text-decoration: none;
		border-top: 1px solid var(--color-bg-700);
	}

	.search-result:hover {
		background-color: var(--color-bg-700);
	}

	.search-result-title {
		color: var(--color-p-blue-200);
		font-size: 0.95rem;
	}

	.search-result-excerpt {
		color: var(--color-bg-200);
		font-size: 0.85rem;
		line-height: 1.4;
	}

	.sidebar-scroll {
		-webkit-mask-image: linear-gradient(
			180deg,
			transparent 0,
			black 16px,
			black calc(100% - 16px),
			transparent 100%
		);
		mask-image: linear-gradient(
			180deg,
			transparent 0,
			black 16px,
			black calc(100% - 16px),
			transparent 100%
		);
	}
</style>
