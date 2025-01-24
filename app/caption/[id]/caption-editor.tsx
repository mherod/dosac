"use client";

import { useState } from "react";
import Image from "next/image";
import { Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";

interface Screenshot {
  id: string;
  imageUrl: string;
  timestamp: string;
  subtitle: string;
  episode: string;
  character: string;
}

interface CaptionEditorProps {
  screenshot: Screenshot;
}

export function CaptionEditor({ screenshot }: CaptionEditorProps) {
  const [caption, setCaption] = useState(screenshot.subtitle);
  const [fontSize, setFontSize] = useState([32]);

  return (
    <div className="container max-w-5xl py-8">
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <Card className="overflow-hidden">
            <div className="relative aspect-video">
              <Image
                src={screenshot.imageUrl}
                alt={screenshot.subtitle}
                fill
                className="object-cover"
                sizes="(max-width: 1200px) 100vw, 1200px"
              />
              {caption && (
                <div
                  className="absolute bottom-0 left-0 right-0 bg-black/75 p-4 text-center text-white"
                  style={{ fontSize: `${fontSize}px` }}
                >
                  {caption}
                </div>
              )}
            </div>
          </Card>
          <div className="mt-4 space-y-1">
            <p className="text-sm text-muted-foreground">
              From: {screenshot.episode}
            </p>
            <p className="text-sm text-muted-foreground">
              Character: {screenshot.character}
            </p>
            <p className="text-sm text-muted-foreground">
              Timestamp: {screenshot.timestamp}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium">Caption</label>
            <Textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Enter your caption..."
              className="min-h-[100px]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Font Size</label>
            <Slider
              value={fontSize}
              onValueChange={setFontSize}
              min={16}
              max={48}
              step={1}
            />
          </div>

          <div className="flex gap-4">
            <Button className="flex-1">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button variant="outline" className="flex-1">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
