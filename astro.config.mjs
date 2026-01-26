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
			redirectToDefaultLocale: false,
		},
	},
	redirects: {
		"/magic": {
			status: 302,
			destination: "/en/magic/introduction",
		},
		"/": {
			status: 302,
			destination: "/en",
		},
	},

	integrations: [svelte()],
});
