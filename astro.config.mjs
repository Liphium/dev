// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import svelte from "@astrojs/svelte";

import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
	i18n: {
		locales: ["en"],
		defaultLocale: "en",
	},
	redirects: {
		"/magic": {
			status: 302,
			destination: "/magic/getting-started/introduction",
		},
		"/scaff": {
			status: 302,
			destination: "/scaff/getting-started/introduction",
		},
		"/neoroute": {
			status: 302,
			destination: "/neoroute/getting-started/introduction",
		},
	},
	integrations: [svelte(), mdx()],
	vite: {
		plugins: [tailwindcss()],
	},
});
