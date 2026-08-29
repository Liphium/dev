<script lang="ts">
	import { Menu, Search, X } from "@lucide/svelte";
	import { onMount } from "svelte";
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
		linkPrefix: string;
		children: Snippet;
		sections: Section[];
		currentPath: string;
	}

	let { software, linkPrefix, children, sections, currentPath }: Props =
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

	let searchOpen = $state(false);
	let modalEl: any;

	function openSearch() {
		modalEl?.open?.();
	}

	function handleSearchKeydown(e: KeyboardEvent) {
		if (e.key.toLowerCase() === "/") {
			const target = e.target as HTMLElement;
			if (
				target.tagName === "INPUT" ||
				target.tagName === "TEXTAREA" ||
				target.isContentEditable
			) {
				return;
			}
			e.preventDefault();
			openSearch();
		}
	}

	onMount(() => {
		const onClose = () => {
			searchOpen = false;
		};
		modalEl?.addEventListener("close", onClose);
		return () => modalEl?.removeEventListener("close", onClose);
	});

	function toggleSidebar() {
		isSidebarOpen = !isSidebarOpen;
		if (isSidebarOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
	}

	function closeSidebar() {
		isSidebarOpen = false;
		document.body.style.overflow = "";
	}

	function handleEscape(e: KeyboardEvent) {
		if (e.key === "Escape" && isSidebarOpen) {
			closeSidebar();
		}
	}
</script>

<svelte:window
	onkeydown={(e) => {
		handleEscape(e);
		handleSearchKeydown(e);
	}}
/>

{#snippet searchTrigger()}
	<button
		type="button"
		onclick={openSearch}
		aria-haspopup="dialog"
		aria-controls="docs-search-modal"
		aria-expanded={searchOpen}
		class="flex items-center w-full gap-2 rounded-lg border-2 border-bg-500 bg-bg-700 p-2 text-sm text-bg-300 transition-colors hover:border-bg-300 hover:text-bg-100 cursor-pointer"
	>
		<Search class="h-4 w-4 shrink-0" />
		<span class="flex-1 truncate text-left">Search</span>
		<kbd
			class="hidden shrink-0 rounded border border-bg-500 bg-bg-600 px-1.5 py-0.5 text-xs text-bg-300 sm:inline"
		>
			/
		</kbd>
	</button>
{/snippet}

<div class="flex w-full justify-center">
	<div class="flex w-full max-w-6xl px-4 font-mono text-bg-100">
		<pagefind-config bundle-path="/pagefind/{software}/"></pagefind-config>

		<pagefind-modal
			reset-on-close="true"
			bind:this={modalEl}
			id="docs-search-modal"
			data-pf-theme="dark"
		></pagefind-modal>

		<!-- Desktop Navigation sidebar -->
		<div
			class="hidden lg:flex sticky inset-0 h-screen w-60 justify-center bg-bg-800"
		>
			<div class="flex h-full w-full flex-col">
				<!-- Search trigger -->
				<div class="flex w-full pt-4 pr-10">
					{@render searchTrigger()}
				</div>

				<!-- Sidebar content -->
				<div
					class="sidebar-scroll flex w-full flex-col gap-8 font-mono overflow-y-auto pr-10"
				>
					<div class="flex w-full flex-col gap-6 py-4">
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
			</div>

			<!-- Separator between sidebar and main content -->
			<div class="w-0.5 bg-bg-500 my-4"></div>
		</div>

		<!-- Content for the page -->
		<div
			class="w-full py-4 lg:py-4 lg:pl-10 overflow-x-hidden min-w-0"
			data-pagefind-body
		>
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
		<div class="flex h-full w-full flex-col">
			<!-- Search trigger -->
			<div class="p-6 pb-3">
				{@render searchTrigger()}
			</div>

			<!-- Links -->
			<div class="h-full flex-1 overflow-y-auto px-6 pb-6">
				<div class="flex flex-col gap-6 font-mono text-bg-100">
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
		</div>

		<!-- Separator line on the right edge -->
		<div class="w-0.5 bg-bg-500"></div>
	</div>
</div>

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
