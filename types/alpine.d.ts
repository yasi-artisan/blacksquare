import "alpinejs";
import type { set } from "astro:schema";

declare module "@alpinejs/intersect";

declare module "alpinejs" {
  interface Stores {
    darkMode: {
      value: boolean;
      set: (value: boolean) => void;
      toggle: () => void;
    };
  }
}
