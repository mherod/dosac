import fs from "node:fs";
import path from "node:path";
import type { Frame } from "../lib/frames";

/**
 * Generates a prebuilt frame index file to avoid scanning directories on every request
 */
async function generateFrameIndex(): Promise<void> {
  const frames: Frame[] = [];
  const seasonsDir = path.join(process.cwd(), "public", "frames");

  console.log("Generating frame index...");

  // Read all seasons
  const seasons = fs.readdirSync(seasonsDir);
  console.log(`Found ${seasons.length} seasons`);

  for (const season of seasons) {
    const seasonDir = path.join(seasonsDir, season);
    if (!fs.statSync(seasonDir).isDirectory()) continue;

    console.log(`Processing ${season}...`);

    // Read all timestamps in the season
    const timestamps = fs.readdirSync(seasonDir);
    let frameCount = 0;

    for (const timestamp of timestamps) {
      const timestampDir = path.join(seasonDir, timestamp);
      if (!fs.statSync(timestampDir).isDirectory()) continue;

      // Check if required files exist
      const speechPath = path.join(timestampDir, "speech.txt");
      const framePath = path.join(timestampDir, "frame-blank.webp");

      if (!fs.existsSync(speechPath) || !fs.existsSync(framePath)) {
        console.warn(`Missing files for ${season}/${timestamp}, skipping...`);
        continue;
      }

      try {
        // Read speech content
        const speech = fs.readFileSync(speechPath, "utf-8").trim();

        // Normalize timestamp to URL-safe format (ensure dashes are used)
        const urlSafeTimestamp = timestamp.replace(/:/g, "-");
        const id = `${season}-${urlSafeTimestamp}`;

        const frame: Frame = {
          id,
          imageUrl: `/frames/${season}/${timestamp}/frame-blank.webp`,
          image2Url: `/frames/${season}/${timestamp}/frame-blank2.webp`,
          timestamp: urlSafeTimestamp,
          subtitle: speech,
          speech,
          episode: season,
          character: "",
        };

        frames.push(frame);
        frameCount++;
      } catch (error) {
        console.error(`Error processing frame ${season}/${timestamp}:`, error);
      }
    }

    console.log(`  ${season}: ${frameCount} frames`);
  }

  // Write the index file
  const indexPath = path.join(process.cwd(), "public", "frame-index.json");
  fs.writeFileSync(indexPath, JSON.stringify(frames, null, 2));

  console.log(`\nFrame index generated successfully!`);
  console.log(`Total frames: ${frames.length}`);
  console.log(`Index file: ${indexPath}`);
  console.log(
    `File size: ${(fs.statSync(indexPath).size / 1024 / 1024).toFixed(2)} MB`,
  );
}

// Run the script
generateFrameIndex().catch(console.error);
