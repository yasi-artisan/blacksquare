import "alpinejs";

declare module "@alpinejs/intersect";

declare module "alpinejs" {
  interface Stores {
    darkMode: {
      value: boolean;
      toggle: () => void;
    };
  }
}
