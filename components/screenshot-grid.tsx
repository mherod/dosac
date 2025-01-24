"use client";

import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";

// Placeholder data - will be replaced with real API data
const SCREENSHOTS = [
  {
    id: "1",
    imageUrl:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&q=80",
    timestamp: "S03E01 - 14:22",
    subtitle: "He's so dense that light bends around him.",
  },
  {
    id: "2",
    imageUrl:
      "https://images.unsplash.com/photo-1533749047139-189de3cf06d3?w=800&q=80",
    timestamp: "S02E03 - 18:45",
    subtitle:
      "I've got a to-do list here that's longer than a Leonard Cohen song.",
  },
  {
    id: "3",
    imageUrl:
      "https://images.unsplash.com/photo-1504384764586-bb4cdc1707b0?w=800&q=80",
    timestamp: "S04E06 - 22:15",
    subtitle:
      "Allow me to explain to you exactly how much of a chance you've got.",
  },
];

export function ScreenshotGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {SCREENSHOTS.map((screenshot) => (
        <Link key={screenshot.id} href={`/caption/${screenshot.id}`}>
          <Card className="overflow-hidden transition-all hover:ring-2 hover:ring-primary">
            <div className="relative aspect-video">
              <Image
                src={screenshot.imageUrl}
                alt={screenshot.subtitle}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <div className="p-3">
              <p className="text-sm font-medium text-muted-foreground">
                {screenshot.timestamp}
              </p>
              <p className="line-clamp-2 text-sm">{screenshot.subtitle}</p>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}
