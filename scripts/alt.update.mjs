import { FieldAction } from "@frontmatter/extensibility";
import mediaDB from "../.frontmatter/database/mediaDb.json" with { type: "json" };

(async () => {
  const { frontMatter } = FieldAction.getArguments();
  const imageList = mediaDB.src.assets.images;
  const image = frontMatter.featured.image.toLowerCase().split("/").pop();
  let value = frontMatter.featured.alt;

  if (image && image in imageList) {
    value = imageList[image].caption;
  }

  FieldAction.update(value);
})();
