import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const magicCollection = defineCollection({
	loader: glob({ base: "./src/content/magic", pattern: "**/*.{md,mdx}" }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
	}),
});

const scaffCollection = defineCollection({
	loader: glob({ base: "./src/content/scaff", pattern: "**/*.{md,mdx}" }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
	}),
});

export const collections = {
	magic: magicCollection,
	scaff: scaffCollection,
};
