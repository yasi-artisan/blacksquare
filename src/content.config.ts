import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const artwork = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/artwork" }),
  schema: z.object({
    title: z.string(),
    year: z.number().optional(),
    tags: z.string().array().optional(),
    isDraft: z.boolean().default(true),
    medium: z.string().array().optional(),
    slug: z.string().regex(/^[a-z0-9-]+$/),
  }),
});

export const collections = { artwork };
