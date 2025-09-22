import fs from "node:fs";
import path from "node:path";
import { InvalidFrameIdError } from "./frames";
import type { Frame, ParsedFrameId } from "./frames";

/**
 * Validates and parses a frame ID into its components
 * @param id - The frame ID to validate (format: s01e01-00-00-00.000)
 * @returns Object containing parsed season, episode, and timestamp
 * @throws InvalidFrameIdError if the ID format is invalid
 */
export function validateFrameId(id: string): ParsedFrameId {
  // Split on first dash after episode ID to separate season from timestamp
  const dashIndex = id.indexOf("-", 6); // Skip past s##e## format
  if (dashIndex === -1) {
    throw new InvalidFrameIdError(
      `Invalid frame ID format: ${id}. Expected format: s01e01-00-00-00.000`,
    );
  }

  const season = id.substring(0, dashIndex);
  const timestamp = id.substring(dashIndex + 1);

  if (!season || !timestamp) {
    throw new InvalidFrameIdError(
      `Invalid frame ID format: ${id}. Expected format: s01e01-00-00-00.000`,
    );
  }

  return { season, episode: season, timestamp };
}

/**
 * Retrieves frame data by its ID from the filesystem
 * @param id - The frame ID to retrieve (format: s01e01-00-00-000)
 * @returns Promise resolving to frame data including paths and speech
 * @throws InvalidFrameIdError if the frame doesn't exist or ID is invalid
 */
export async function getFrameById(id: string): Promise<Frame> {
  const { season, timestamp } = validateFrameId(id);

  // Try the new format first (all dashes)
  let framePath = path.join(
    process.cwd(),
    "public",
    "frames",
    season,
    timestamp,
  );

  // Fallback: try the old format (with colons) if new format doesn't exist
  if (!fs.existsSync(framePath)) {
    const legacyTimestamp = timestamp.replace(/-(\d{2}\.\d{3})$/, ":$1");
    const legacyFramePath = path.join(
      process.cwd(),
      "public",
      "frames",
      season,
      legacyTimestamp,
    );

    if (fs.existsSync(legacyFramePath)) {
      framePath = legacyFramePath;
    } else {
      throw new InvalidFrameIdError(
        `Frame not found: ${id} (tried both ${timestamp} and ${legacyTimestamp})`,
      );
    }
  }

  const speechPath = path.join(framePath, "speech.txt");
  const speech = fs.readFileSync(speechPath, "utf-8").trim();

  return {
    id,
    imageUrl: `/frames/${season}/${timestamp}/frame-blank.webp`,
    image2Url: `/frames/${season}/${timestamp}/frame-blank2.webp`,
    timestamp,
    subtitle: speech,
    speech,
    episode: season,
    character: "",
  };
}

/**
 * Retrieves all frames from the prebuilt index file
 * Falls back to filesystem scanning if index doesn't exist
 * @returns Promise resolving to array of all frame data
 */
export async function getFrameIndex(): Promise<Frame[]> {
  const indexPath = path.join(process.cwd(), "public", "frame-index.json");

  // Try to use prebuilt index first
  if (fs.existsSync(indexPath)) {
    try {
      const indexContent = fs.readFileSync(indexPath, "utf-8");
      const frames: Frame[] = JSON.parse(indexContent);
      console.log(`Loaded ${frames.length} frames from prebuilt index`);
      return frames;
    } catch (error) {
      console.error(
        "Error reading prebuilt frame index, falling back to filesystem scan:",
        error,
      );
    }
  }

  // Fallback: scan filesystem (original implementation)
  console.warn(
    "Prebuilt frame index not found, scanning filesystem (this will be slow)...",
  );
  const frames: Frame[] = [];
  const seasonsDir = path.join(process.cwd(), "public", "frames");

  // Read all seasons
  const seasons = fs.readdirSync(seasonsDir);

  for (const season of seasons) {
    const seasonDir = path.join(seasonsDir, season);
    if (!fs.statSync(seasonDir).isDirectory()) continue;

    // Read all timestamps in the season
    const timestamps = fs.readdirSync(seasonDir);

    for (const timestamp of timestamps) {
      if (!fs.statSync(path.join(seasonDir, timestamp)).isDirectory()) continue;

      // Normalize timestamp to URL-safe format (replace colons with dashes)
      const urlSafeTimestamp = timestamp.replace(/:/g, "-");
      const id = `${season}-${urlSafeTimestamp}`;

      try {
        const frame = await getFrameById(id);
        frames.push(frame);
      } catch (error) {
        console.error(`Error loading frame ${id}:`, error);
      }
    }
  }

  return frames;
}
