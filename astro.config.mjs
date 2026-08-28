// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import svelte from "@astrojs/svelte";
import pagefind from "astro-pagefind";

import mdx from "@astrojs/mdx";
import { unified } from "@astrojs/markdown-remark";
import codeTabs from "./src/plugins/code-tabs";
import rehypeRaw from "rehype-raw";
import rehypePrettyCode from "rehype-pretty-code";

// https://astro.build/config
export default defineConfig({
	i18n: {
		locales: ["en"],
		defaultLocale: "en",
	},
	integrations: [svelte(), mdx(), pagefind()],
	markdown: {
		processor: unified({
			remarkPlugins: [codeTabs],
			rehypePlugins: [
				rehypeRaw,
				[rehypePrettyCode, { theme: "github-dark", keepBackground: false }],
			],
		}),
	},
	vite: {
		plugins: [tailwindcss()],
	},
});
