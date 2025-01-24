import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const frames: {
    id: string;
    imageUrl: string;
    blankImageUrl: string;
    timestamp: string;
    subtitle: string;
    speech: string;
  }[] = [];
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
        subtitle: speech, // Keep for backwards compatibility
        speech,
      });
    }
  }

  return NextResponse.json(frames);
}
