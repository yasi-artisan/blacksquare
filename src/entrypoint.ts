import type { Alpine } from "alpinejs";
import intersect from "@alpinejs/intersect";
// @ts-ignore
import Flickity from "flickity";

type FlickityOptions = {
  cellAlign?: string;
  wrapAround?: boolean;
  pageDots?: boolean;
  prevNextButtons?: boolean;
  [key: string]: any;
};

export default (Alpine: Alpine) => {
  Alpine.plugin(intersect);
  Alpine.directive("carousel", (el, { expression }) => {
    const {
      cellAlign = "center",
      wrapAround = true,
      pageDots = true,
      prevNextButtons = false,
      ...rest
    } = expression ? (JSON.parse(expression) as FlickityOptions) : {};
    const flickity = new Flickity(el, {
      cellAlign,
      wrapAround,
      pageDots,
      prevNextButtons,
      ...rest,
    });
    flickity.on("change", (value: number) => {
      el.dispatchEvent(
        new CustomEvent("carousel-change", {
          detail: { index: value },
          bubbles: true,
        }),
      );
    });
  });
};
