import "server-only";

import fs from "node:fs";
import path from "node:path";
import { unstable_cacheLife } from "next/cache";
import { InvalidFrameIdError } from "./frames";
import type { Frame, ParsedFrameId } from "./frames";

// Cache the frame index in memory
let cachedFrameIndex: Frame[] | null = null;
let hasLoggedIndexLoad = false;

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
  "use cache";
  unstable_cacheLife("static");

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
  // webpackIgnore: Runtime file read, not bundled
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
 * Internal function to load frames from disk (called once and cached)
 */
function loadFrameIndexFromDisk(): Frame[] {
  const indexPath = path.join(process.cwd(), "public", "frame-index.json");

  // Try to use prebuilt index first
  if (fs.existsSync(indexPath)) {
    try {
      const indexContent = fs.readFileSync(indexPath, "utf-8");
      const frames: Frame[] = JSON.parse(indexContent);

      // Only log once per worker process to reduce build noise
      if (!hasLoggedIndexLoad) {
        console.log(`Loaded ${frames.length} frames from prebuilt index`);
        hasLoggedIndexLoad = true;
      }

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
      const timestampDir = path.join(seasonDir, timestamp);
      if (!fs.statSync(timestampDir).isDirectory()) continue;

      // Normalize timestamp to URL-safe format (replace colons with dashes)
      const urlSafeTimestamp = timestamp.replace(/:/g, "-");
      const id = `${season}-${urlSafeTimestamp}`;

      try {
        // Read speech directly from filesystem
        const speechPath = path.join(timestampDir, "speech.txt");
        if (!fs.existsSync(speechPath)) continue;

        const speech = fs.readFileSync(speechPath, "utf-8").trim();

        frames.push({
          id,
          imageUrl: `/frames/${season}/${urlSafeTimestamp}/frame-blank.webp`,
          image2Url: `/frames/${season}/${urlSafeTimestamp}/frame-blank2.webp`,
          timestamp: urlSafeTimestamp,
          subtitle: speech,
          speech,
          episode: season,
          character: "",
        });
      } catch (error) {
        console.error(`Error loading frame ${id}:`, error);
      }
    }
  }

  return frames;
}

/**
 * Retrieves all frames from the prebuilt index file
 * Falls back to filesystem scanning if index doesn't exist
 * Uses singleton pattern to ensure only one load per worker process
 * @returns Promise resolving to array of all frame data
 */
export async function getFrameIndex(): Promise<Frame[]> {
  "use cache";
  unstable_cacheLife("stable");

  // Return cached index if available (singleton pattern)
  if (cachedFrameIndex) {
    return cachedFrameIndex;
  }

  // Load from disk and cache
  cachedFrameIndex = loadFrameIndexFromDisk();
  return cachedFrameIndex;
}
