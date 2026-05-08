import { defineCollection, z } from "astro:content";

const magicCollection = defineCollection({
	schema: z.object({
		title: z.string(),
		description: z.string(),
	}),
});

const scaffCollection = defineCollection({
	schema: z.object({
		title: z.string(),
		description: z.string(),
	}),
});

export const collections = {
	magic: magicCollection,
	scaff: scaffCollection,
};
