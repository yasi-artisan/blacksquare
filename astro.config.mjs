// @ts-check
import { defineConfig, fontProviders } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import vercel from "@astrojs/vercel";

import mdx from "@astrojs/mdx";

import alpinejs from "@astrojs/alpinejs";
import { resolve } from "path";
import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@/": resolve("./src"),
      },
    },
  },

  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
    imageService: true,
    devImageService: "sharp",
  }),
  integrations: [mdx(), alpinejs({ entrypoint: "/src/entrypoint" }), icon()],
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
