"use client";

import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";

function formatEpisodeString(episodeId: string): string {
  // Format from "s01e02" to "Series 1 Episode 2"
  const match = episodeId.match(/^s(\d{2})e(\d{2})$/i);
  if (!match || !match[1] || !match[2]) return episodeId;

  return `Series ${parseInt(match[1])} Episode ${parseInt(match[2])}`;
}

function formatTimestamp(timestamp: string): string {
  // Format from "00-03.120" to "0:03"
  const match = timestamp.match(/^(\d{2})-(\d{2})\.\d{3}$/);
  if (!match || !match[1] || !match[2]) return timestamp;

  const minutes = parseInt(match[1]);
  const seconds = parseInt(match[2]);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

type Screenshot = {
  id: string;
  imageUrl: string;
  blankImageUrl: string;
  timestamp: string;
  subtitle: string;
  speech: string;
  episode: string;
};

interface ScreenshotGridProps {
  screenshots: Screenshot[];
}

export function ScreenshotGrid({ screenshots }: ScreenshotGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {screenshots.map((screenshot) => (
        <Link key={screenshot.id} href={`/caption/${screenshot.id}`}>
          <Card className="overflow-hidden">
            <div className="relative aspect-video">
              <Image
                src={screenshot.imageUrl}
                alt={screenshot.timestamp}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={screenshots.indexOf(screenshot) < 6}
              />
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">
                  {formatEpisodeString(screenshot.episode)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatTimestamp(screenshot.timestamp)}
                </p>
              </div>
              <p className="font-medium">{screenshot.speech}</p>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}
