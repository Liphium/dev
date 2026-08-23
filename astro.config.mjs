// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import svelte from "@astrojs/svelte";

import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
	i18n: {
		locales: ["en"],
		defaultLocale: "en",
	},
	integrations: [svelte(), mdx()],
	vite: {
		plugins: [tailwindcss()],
	},
});
