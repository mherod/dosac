import fastGlob from "fast-glob";
import sharp from "sharp";
import path from "path";
import fs from "fs/promises";

const MAX_WIDTH = 400;

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

      // Create a backup of the original file
      const backupPath = imagePath + ".backup";
      await fs.copyFile(imagePath, backupPath);

      // Resize the image
      await image
        .resize(MAX_WIDTH, null, {
          fit: "inside",
          withoutEnlargement: true,
        })
        .jpeg({
          quality: 85,
          mozjpeg: true,
        })
        .toFile(imagePath + ".tmp");

      // Replace the original with the resized version
      await fs.unlink(imagePath);
      await fs.rename(imagePath + ".tmp", imagePath);

      console.log(
        `Resized ${imagePath} from ${metadata.width}px to ${MAX_WIDTH}px`,
      );
    } catch (error) {
      console.error(`Error processing ${imagePath}:`, error);
    }
  }
}

resizeImages().catch(console.error);
