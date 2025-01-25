"use client";

import { FrameCard } from "@/components/frame-card";

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
        <FrameCard
          key={screenshot.id}
          screenshot={screenshot}
          priority={screenshots.indexOf(screenshot) < 6}
        />
      ))}
    </div>
  );
}
