import fastGlob from "fast-glob";
import sharp from "sharp";
import fs from "fs/promises";

const MAX_WIDTH = 500;

async function resizeImages() {
  // Find all JPEG images in the public directory
  const images = await fastGlob("public/**/*.{jpg,jpeg}", {
    absolute: false,
    onlyFiles: true,
  });

  console.log(`Found ${images.length} images to process`);

  for (const imagePath of images) {
    try {
      const image = sharp(imagePath);
      const metadata = await image.metadata();

      // Skip if image is already smaller than MAX_WIDTH
      if (metadata.width && metadata.width <= MAX_WIDTH) {
        console.log(`Skipping ${imagePath} - already ${metadata.width}px wide`);
        continue;
      }

      // Resize the image and overwrite the original
      await image
        .resize(MAX_WIDTH, null, {
          fit: "inside",
          withoutEnlargement: true,
        })
        .jpeg({
          quality: 85,
          mozjpeg: true,
        })
        .toBuffer()
        .then((buffer) => fs.writeFile(imagePath, buffer));

      console.log(
        `Resized ${imagePath} from ${metadata.width}px to ${MAX_WIDTH}px`,
      );
    } catch (error) {
      console.error(`Error processing ${imagePath}:`, error);
    }
  }
}

resizeImages().catch(console.error);
