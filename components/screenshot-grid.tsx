"use client";

import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";

type Screenshot = {
  id: string;
  imageUrl: string;
  blankImageUrl: string;
  timestamp: string;
  subtitle: string;
  speech: string;
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
              <p className="text-sm text-muted-foreground">
                {screenshot.timestamp}
              </p>
              <p className="font-medium">{screenshot.speech}</p>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}
