"use client";

import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";

type Screenshot = {
  id: string;
  imageUrl: string;
  blankImageUrl: string;
  timestamp: string;
  subtitle: string;
  speech: string;
};

export function ScreenshotGrid() {
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/frames")
      .then((res) => res.json())
      .then((data) => {
        setScreenshots(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching frames:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center">Loading screenshots...</div>;
  }

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
