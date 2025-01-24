import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const frames: {
    id: string;
    imageUrl: string;
    timestamp: string;
    subtitle: string;
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
      if (!fs.statSync(path.join(seasonDir, timestamp)).isDirectory()) continue;

      frames.push({
        id: `${season}-${timestamp}`,
        imageUrl: `/frames/${season}/${timestamp}/frame.jpg`,
        timestamp: `${season} - ${timestamp}`,
        subtitle: "Add your caption",
      });
    }
  }

  return NextResponse.json(frames);
}
