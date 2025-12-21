import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";

// Import all the specifications
const specs = defineCollection({
    loader: glob({
        pattern: "**/*.md",
        base: "./specifications"
    })
})

export const collections = { specs };
