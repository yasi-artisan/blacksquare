import { MediaScript } from "@frontmatter/extensibility";
import sharp from "sharp";
import { dirname } from "path";

(async () => {
  const mediaScriptArgs = MediaScript.getArguments();
  if (!mediaScriptArgs) {
    MediaScript.done(`No arguments found`);
    return;
  }

  const { mediaPath } = mediaScriptArgs;
  if (!mediaPath) {
    MediaScript.done(`No media path found`);
    return;
  }

  const folderPath = mediaPath.substring(0, mediaPath.lastIndexOf("/"));
  let newFilePath = `${folderPath}/${crypto.randomUUID()}.webp`;

  await sharp(mediaPath)
    .resize(2400, 2400, { fit: "inside" })
    .toFormat("webp")
    .toFile(newFilePath);

  MediaScript.copyMetadataAndDelete(mediaPath, newFilePath);

  const imagemin = (await import("imagemin")).default;
  const imageminWebp = (await import("imagemin-webp")).default;

  await imagemin([newFilePath], {
    destination: dirname(mediaPath),
    glob: false,
    plugins: [imageminWebp({ quality: 85 })],
  });

  MediaScript.done("An optimized image has been created.");
})();
