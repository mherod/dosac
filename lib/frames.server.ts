import fs from "fs";
import path from "path";
import { Frame, ParsedFrameId, InvalidFrameIdError } from "./frames";

export function validateFrameId(id: string): ParsedFrameId {
  const [season, ...timestampParts] = id.split("-");
  const timestamp = timestampParts.join("-");

  if (!season || !timestamp) {
    throw new InvalidFrameIdError(
      `Invalid URL format for ID '${id}'. Expected 'season-timestamp' (e.g., s01e01-12-34.567)`,
    );
  }

  if (!/^s\d{2}e\d{2}$/.test(season)) {
    throw new InvalidFrameIdError(
      `Invalid season format '${season}' in URL. Expected format: s01e01 (e.g., s01e01-12-34.567)`,
    );
  }

  if (!/^\d{2}-\d{2}\.\d{3}$/.test(timestamp)) {
    throw new InvalidFrameIdError(
      `Invalid timestamp format '${timestamp}' in URL. Expected format: MM-SS.mmm (e.g., 12-34.567)`,
    );
  }

  return { season, timestamp };
}

export async function getFrameById(id: string): Promise<Frame> {
  const { season, timestamp } = validateFrameId(id);
  const baseFramePath = `/frames/${season}/${timestamp}`;
  const imageUrl = `${baseFramePath}/frame.jpg`;
  const blankImageUrl = `${baseFramePath}/frame-blank.jpg`;

  // Read speech directly from file system
  const speechPath = path.join(
    process.cwd(),
    "public",
    "frames",
    season,
    timestamp,
    "speech.txt",
  );
  let speech = "";

  if (fs.existsSync(speechPath)) {
    speech = fs.readFileSync(speechPath, "utf-8").trim();
  }

  return {
    id,
    imageUrl,
    blankImageUrl,
    timestamp: `${season} - ${timestamp}`,
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
      const frameDir = path.join(seasonDir, timestamp);
      if (!fs.statSync(frameDir).isDirectory()) continue;

      // Read speech.txt if it exists
      let speech = "";
      const speechPath = path.join(frameDir, "speech.txt");
      if (fs.existsSync(speechPath)) {
        speech = fs.readFileSync(speechPath, "utf-8").trim();
      }

      frames.push({
        id: `${season}-${timestamp}`,
        imageUrl: `/frames/${season}/${timestamp}/frame.jpg`,
        blankImageUrl: `/frames/${season}/${timestamp}/frame-blank.jpg`,
        timestamp: `${season} - ${timestamp}`,
        subtitle: speech,
        speech,
        episode: season,
        character: "",
      });
    }
  }

  return frames;
}
