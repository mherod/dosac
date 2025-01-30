import fs from "fs";
import path from "path";
import { InvalidFrameIdError } from "./frames";
import type { Frame, ParsedFrameId } from "./frames";

export function validateFrameId(id: string): ParsedFrameId {
  const [season, ...timestampParts] = id.split("-");
  const timestamp = timestampParts.join("-");

  if (!season || !timestamp) {
    throw new InvalidFrameIdError(
      `Invalid frame ID format: ${id}. Expected format: s01e01-00-00-000`,
    );
  }

  return { season, episode: season, timestamp };
}

export async function getFrameById(id: string): Promise<Frame> {
  const { season, timestamp } = validateFrameId(id);

  const framePath = path.join(
    process.cwd(),
    "public",
    "frames",
    season,
    timestamp,
  );

  if (!fs.existsSync(framePath)) {
    throw new InvalidFrameIdError(`Frame not found: ${id}`);
  }

  const speechPath = path.join(framePath, "speech.txt");
  const speech = fs.readFileSync(speechPath, "utf-8").trim();

  return {
    id,
    imageUrl: `/frames/${season}/${timestamp}/frame-blank.jpg`,
    image2Url: `/frames/${season}/${timestamp}/frame-blank2.jpg`,
    timestamp,
    subtitle: speech,
    speech,
    episode: season,
    character: "",
  };
}

export async function getFrameIndex(): Promise<Frame[]> {
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

      const id = `${season}-${timestamp}`;
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
