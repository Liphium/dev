<script lang="ts">
	import { getAbsoluteLocaleUrl } from "astro:i18n";
	import { Menu, X } from "@lucide/svelte";
	import favicon from "../assets/favicon.png";

	interface Props {
		lang: string;
		translations: {
			name: string;
			magic: string;
		};
	}

	let { lang, translations }: Props = $props();

	let isMenuOpen = $state(false);

	const links = [
		{
			name: translations.magic,
			link: getAbsoluteLocaleUrl(
				lang,
				"/magic/getting-started/introduction",
			),
		},
	];

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
		if (isMenuOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
	}

	function closeMenu() {
		isMenuOpen = false;
		document.body.style.overflow = "";
	}
</script>

<nav class="flex flex-row justify-center p-4">
	<div
		class="flex w-full max-w-6xl items-center justify-center text-bg-100 font-mono"
	>
		<!-- Logo and brand -->
		<div class="flex items-center gap-2">
			<img src={favicon.src} alt="Logo" class="w-6 h-6 rounded-sm" />
			<a
				class="border-b-2 border-transparent font-bold hover:border-b-2 hover:border-bg-100 transition-colors"
				href="/">{translations.name}</a
			>
		</div>

		<!-- Desktop navigation links -->
		<div class="hidden md:flex gap-8 ml-8">
			{#each links as link}
				<a
					class="border-b-2 border-transparent hover:border-b-2 hover:border-bg-100 transition-colors"
					href={link.link}
				>
					{link.name}
				</a>
			{/each}
		</div>

		<!-- Mobile menu button -->
		<button
			onclick={toggleMenu}
			class="md:hidden relative flex justify-center items-center w-8 h-8 cursor-pointer z-50 ml-auto"
			aria-label="Toggle menu"
		>
			<Menu
				class="w-6 h-6 text-bg-100 transition-opacity duration-300 {isMenuOpen
					? 'opacity-0'
					: 'opacity-100'}"
			/>
			<X
				class="w-6 h-6 text-bg-100 absolute transition-opacity duration-300 {isMenuOpen
					? 'opacity-100'
					: 'opacity-0'}"
			/>
		</button>
	</div>
</nav>

<!-- Mobile menu overlay -->
<div
	role="button"
	tabindex="0"
	onclick={(e) => {
		if (e.target === e.currentTarget) {
			closeMenu();
		}
	}}
	onkeydown={(e) => {
		if (e.key === "Escape") {
			closeMenu();
		}
	}}
	class="fixed inset-0 bg-bg-800/80 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
	class:opacity-0={!isMenuOpen}
	class:opacity-100={isMenuOpen}
	class:pointer-events-none={!isMenuOpen}
>
	<div
		class="flex flex-col items-center justify-center h-full gap-8 font-mono text-bg-100"
	>
		{#each links as link}
			<a
				onclick={closeMenu}
				class="text-2xl border-b-2 border-transparent hover:border-b-2 hover:border-bg-100 transition-colors"
				href={link.link}
			>
				{link.name}
			</a>
		{/each}
	</div>
</div>
