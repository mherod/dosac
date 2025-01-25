import { execSync } from "child_process";
import glob from "fast-glob";

async function main() {
  // Find all jpg files in public directory
  const images = await glob("public/**/*.jpg");

  // Use sips to get dimensions of all images
  for (const image of images) {
    try {
      const output = execSync(
        `sips -g pixelWidth -g pixelHeight "${image}"`,
      ).toString();
      const width = parseInt(output.match(/pixelWidth: (\d+)/)?.[1] || "0");
      const height = parseInt(output.match(/pixelHeight: (\d+)/)?.[1] || "0");

      if (width > 500) {
        console.log(`❌ ${image}: ${width}x${height}`);
      }
    } catch (error) {
      console.error(`Error processing ${image}:`, error);
    }
  }
}

main().catch(console.error);
