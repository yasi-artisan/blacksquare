import DefaultTemplate from "@/components/templates/page/DefaultTemplate.astro";
import NoneTemplate from "@/components/templates/page/NoneTemplate.astro";
export const TEMPLATES = {
  default: DefaultTemplate,
  none: NoneTemplate,
} as const;

export type TemplateKey = keyof typeof TEMPLATES;
