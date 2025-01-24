import React from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MainNav } from "@/components/main-nav";
import fs from "fs";
import path from "path";
import Link from "next/link";

const getMeme = (id: string) => {
  const [season, episode, timestamp] = id.split("-");
  const framePath = path.join(
    process.cwd(),
    "public",
    "frames",
    season,
    timestamp,
    "frame.jpg",
  );

  if (!fs.existsSync(framePath)) {
    return null;
  }

  return {
    id,
    imageUrl: `/frames/${season}/${timestamp}/frame.jpg`,
    title: `Scene from ${season} at ${timestamp}`,
    likes: 0,
    comments: 0,
    description: "A memorable scene from Malcolm in the Middle",
    createdAt: new Date().toISOString(),
  };
};

export function generateStaticParams() {
  const frames: { id: string }[] = [];
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
      });
    }
  }

  return frames;
}

export default function MemePage({ params }: { params: { id: string } }) {
  const meme = getMeme(params.id);

  if (!meme) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <MainNav />

      <div className="border-b bg-muted/50">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-x-3">
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              ← Back to search
            </Link>
            <span className="text-sm text-muted-foreground">•</span>
            <span className="text-sm text-muted-foreground">
              Reference ID: {params.id}
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-lg border bg-background shadow-sm">
          <div className="border-b p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h1 className="text-lg font-semibold">{meme.title}</h1>
                <p className="text-sm text-muted-foreground">
                  Added to database on{" "}
                  {new Date(meme.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Heart className="mr-1.5 h-4 w-4" />
                  <span className="text-xs">{meme.likes}</span>
                </Button>
                <Button variant="outline" size="sm">
                  <MessageCircle className="mr-1.5 h-4 w-4" />
                  <span className="text-xs">{meme.comments}</span>
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="mr-1.5 h-4 w-4" />
                  <span className="text-xs">Share</span>
                </Button>
              </div>
            </div>
          </div>

          <div className="relative aspect-video">
            <Image
              src={meme.imageUrl}
              alt={meme.title}
              fill
              className="object-cover"
              sizes="(max-width: 1200px) 100vw, 1200px"
            />
          </div>

          <div className="border-t p-4">
            <div className="space-y-4">
              <div>
                <h2 className="text-sm font-medium">Description</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {meme.description}
                </p>
              </div>
              <div>
                <h2 className="text-sm font-medium">Comments</h2>
                <div className="mt-2 rounded border bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground">
                    No comments yet. Be the first to comment!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
