import { file, glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const artwork = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/data/artworks" }),
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

const pages = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/data/pages" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      snippet: z.string().optional(),
      tags: z.string().array().optional(),
      featured: z
        .object({
          image: image(),
          alt: z.string().optional(),
        })
        .optional(),
      isDraft: z.boolean().default(true),
      type: z.enum(["default"]).default("default"),
    }),
});

const MenuItemBaseSchema = z.object({
  label: z.string(),
  icon: z.string().optional(),
  order: z.number().optional(),
});

export type MenuItem = {
  label: string;
  order?: number;
} & (
  | { type: "link"; slug: string }
  | { type: "component"; component: string }
  | { type: "folder"; children?: MenuItem[] }
);

export const MenuItemSchema: z.ZodType<MenuItem> = z.lazy(() =>
  z.discriminatedUnion("type", [
    MenuItemBaseSchema.extend({
      type: z.literal("link"),
      slug: z.string(),
    }),
    MenuItemBaseSchema.extend({
      type: z.literal("component"),
      component: z.string(),
    }),
    MenuItemBaseSchema.extend({
      type: z.literal("folder"),
      children: z.array(MenuItemSchema).optional(),
    }),
  ]),
);

const menu = defineCollection({
  loader: file("src/data/menu.yml"),
  schema: MenuItemSchema,
});

export const collections = { artwork, settings, pages, menu };
