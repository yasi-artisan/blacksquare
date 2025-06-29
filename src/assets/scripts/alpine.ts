import { isInputError } from "astro:actions";
import { actions } from "astro:actions";

document.addEventListener("alpine:init", () => {
  window.Alpine.store("darkMode", {
    value: localStorage.getItem("darkMode")
      ? localStorage.getItem("darkMode") === "true"
      : document.documentElement.classList.contains("dark") ||
        window.matchMedia("(prefers-color-scheme: dark)").matches,
    set(value) {
      this.value = value;
      document.documentElement.classList.toggle("dark", this.value);
      localStorage.setItem("darkMode", this.value.toString());
    },
    toggle() {
      this.value = !this.value;
      document.documentElement.classList.toggle("dark", this.value);
      localStorage.setItem("darkMode", this.value.toString());
    },
  });
});

interface ContactFormRefs {
  form: HTMLFormElement;
}
interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

interface FieldErrors {
  name: string;
  email: string;
  message: string;
}

const contactForm = () => {
  window.Alpine.data("contactForm", () => ({
    $refs: {} as ContactFormRefs,
    form: {
      name: "",
      email: "",
      message: "",
    },
    fieldErrors: {
      name: "",
      email: "",
      message: "",
    } as FieldErrors,
    message: null as string | null,
    loading: false as boolean,
    isError: true,
    async submit(e: SubmitEvent) {
      e.preventDefault();
      this.loading = true;
      const formData = new FormData(this.$refs.form);
      const { data, error } = await actions.contact(formData);
      this.loading = false;
      if (isInputError(error)) {
        const fields = Object.keys(this.fieldErrors);
        fields.forEach((field) => {
          if (field in error.fields) {
            // @ts-ignore
            this.fieldErrors[field as keyof FieldErrors] =
              error.fields[field].join(", ");
          }
        });
      }

      if (data?.success) {
        this.message = data.message;
        this.isError = false;
      } else {
        this.isError = true;
      }
    },
    reset() {
      this.loading = false;
      this.$refs.form.reset();
    },
  }));
};

import EmblaCarousel from "embla-carousel";
import type { EmblaCarouselType, EmblaOptionsType } from "embla-carousel";

const artworkPage = () => {
  window.Alpine.data("artworkPage", () => ({
    showTitle: false,
    showContent: false,
    activeIndex: 0,
    slideIndex: 0,
    embla: null as null | EmblaCarouselType,
    init() {
      const options = { loop: true } as EmblaOptionsType;
      this.embla = EmblaCarousel(this.$refs.embla, options);
      const updateIndex = () => {
        if (this.embla) {
          this.slideIndex = this.embla.selectedScrollSnap();
        }
      };
      this.embla.on("select", updateIndex);
      this.embla.on("init", updateIndex);
      this.embla.on("reInit", updateIndex);

      document.addEventListener("keyup", (e) => {
        if (e.key === "ArrowRight") {
          this.embla?.scrollNext();
        } else if (e.key === "ArrowLeft") {
          this.embla?.scrollPrev();
        }
      });
    },
  }));
};

document.addEventListener("alpine:init", contactForm);
document.addEventListener("alpine:init", artworkPage);
