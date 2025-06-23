// @ts-check
import { defineConfig, fontProviders } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import vercel from "@astrojs/vercel";

import mdx from "@astrojs/mdx";

import alpinejs from "@astrojs/alpinejs";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },

  adapter: vercel(),
  integrations: [mdx(), alpinejs({ entrypoint: "/src/entrypoint" })],
  experimental: {
    fonts: [
      {
        provider: fontProviders.bunny(),
        name: "Bigshot One",
        cssVariable: "--font-bigshot-one",
      },
      {
        provider: fontProviders.bunny(),
        name: "Karla",
        cssVariable: "--font-karla",
      },
    ],
  },
});
