import { file, glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const artwork = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/data/artwork" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      year: z.number().optional(),
      tags: z.string().array().optional(),
      isDraft: z.boolean().default(true),
      medium: z.string().array().optional(),
      slug: z.string().regex(/^[a-z0-9-]+$/),
      featured: z.object({
        alt: z.string().optional(),
        image: image(),
      }),
      gallery: z.union([image(), z.string().url()]).array().optional(),
    }),
});

const settings = defineCollection({
  loader: file("src/data/settings.yml"),
  schema: z.object({
    sitename: z.string(),
    description: z.string().optional(),
    logo: z.string().optional(),
    socials: z
      .object({
        twitter: z.string().url().optional(),
        instagram: z.string().url().optional(),
        facebook: z.string().url().optional(),
        linkedin: z.string().url().optional(),
      })
      .optional(),
    contact: z.object({
      email: z.string().email().optional(),
    }),
    features: z.record(z.string(), z.boolean()).optional(),
  }),
});

export const collections = { artwork, settings };
