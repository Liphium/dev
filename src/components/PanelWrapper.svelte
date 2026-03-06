<script lang="ts">
	import { Menu, X } from "@lucide/svelte";
	import favicon from "../assets/favicon.png";
	import type { Snippet } from "svelte";

	interface LinkItem {
		name: string;
		link: string;
	}

	interface Section {
		name: string;
		linkPrefix: string;
		links: LinkItem[];
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

	let isSidebarOpen = $state(false);

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

<svelte:window onkeydown={handleEscape} />

<div class="flex w-full justify-center">
	<div class="flex w-full max-w-6xl font-mono text-bg-100">
		<!-- Desktop Navigation sidebar -->
		<div
			class="hidden lg:flex sticky inset-0 h-screen min-w-60 justify-center pl-4 pr-2 py-4 bg-bg-800"
		>
			<!-- Sidebar content -->
			<div class="flex w-full flex-col justify-between gap-8 font-mono">
				<div class="flex w-full flex-col gap-6">
					<!-- Version and software indicator -->
					<div class="align-center flex gap-2">
						<img
							src={favicon.src}
							alt="Planet logo"
							class="h-6 w-6 rounded-sm"
						/>
						<p class="font-bold text-bg-200">{software}</p>
					</div>

					<!-- Links at the top of the sidebar -->
					{#each sections as section}
						<div class="flex flex-col gap-3">
							{#if section.name}
								<p class="font-bold text-bg-100">
									{section.name}
								</p>
							{/if}

							{#each section.links as link}
								<a
									class={`w-max border-b-2 transition-colors ${currentPath.includes(link.link) ? "border-bg-100 text-bg-100" : "border-transparent text-bg-200"} hover:border-b-2 hover:border-bg-100`}
									href={linkPrefix + link.link}
								>
									{link.name}
								</a>
							{/each}
						</div>
					{/each}
				</div>
			</div>

			<!-- Separator between sidebar and main content -->
			<div class="w-0.5 bg-bg-500"></div>
		</div>

		<!-- Content for the page -->
		<div class="w-full p-4 lg:p-4 px-2 overflow-x-hidden min-w-0">
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
				<!-- Version and software indicator -->
				<div class="align-center flex gap-2">
					<img
						src={favicon.src}
						alt="Planet logo"
						class="h-6 w-6 rounded-sm"
					/>
					<p class="font-bold text-bg-200">{software}</p>
				</div>

				<!-- Links -->
				{#each sections as section}
					<div class="flex flex-col gap-3">
						{#if section.name}
							<p class="font-bold text-bg-100">
								{section.name}
							</p>
						{/if}

						{#each section.links as link}
							<a
								onclick={closeSidebar}
								class={`w-max border-b-2 transition-colors ${currentPath.includes(link.link) ? "border-bg-100 text-bg-100" : "border-transparent text-bg-200"} hover:border-b-2 hover:border-bg-100`}
								href={linkPrefix + link.link}
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

<!-- Floating Action Button (Mobile only) -->
<button
	onclick={toggleSidebar}
	class="fixed bottom-6 right-6 w-14 h-14 bg-bg-600 hover:bg-bg-500 text-bg-100 rounded-full shadow-lg lg:hidden flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 z-[60]"
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
