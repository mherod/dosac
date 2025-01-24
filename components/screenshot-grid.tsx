"use client";

import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import fs from "fs";
import path from "path";

// Get all frames from the public directory
function getFrames() {
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

  return frames;
}

const SCREENSHOTS = getFrames();

export function ScreenshotGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {SCREENSHOTS.map((screenshot) => (
        <Link key={screenshot.id} href={`/caption/${screenshot.id}`}>
          <Card className="overflow-hidden transition-all hover:ring-2 hover:ring-primary">
            <div className="relative aspect-video">
              <Image
                src={screenshot.imageUrl}
                alt={screenshot.timestamp}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <div className="p-3">
              <p className="text-sm font-medium text-muted-foreground">
                {screenshot.timestamp}
              </p>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}
