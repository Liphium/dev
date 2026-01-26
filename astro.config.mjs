// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import svelte from "@astrojs/svelte";

// https://astro.build/config
export default defineConfig({
	vite: {
		plugins: [tailwindcss()],
	},
	i18n: {
		locales: ["en"],
		defaultLocale: "en",
		routing: {
			prefixDefaultLocale: true,
		},
	},
	redirects: {
		"/magic": {
			status: 302,
			destination: "/en/magic/introduction",
		},
	},

	integrations: [svelte()],
});
