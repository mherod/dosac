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
  blankImageUrl: string;
  timestamp: string;
  subtitle: string;
  speech: string;
  episode: string;
  character: string;
}

interface CaptionEditorProps {
  screenshot: Screenshot;
}

export function CaptionEditor({ screenshot }: CaptionEditorProps) {
  const [caption, setCaption] = useState(screenshot.speech);
  const [fontSize, setFontSize] = useState([18]);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <div className="container max-w-5xl">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-6">
            <Card className="overflow-hidden shadow-lg transition-shadow hover:shadow-xl">
              <div className="relative aspect-video">
                <Image
                  src={screenshot.blankImageUrl}
                  alt={screenshot.timestamp}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1200px) 100vw, 1200px"
                  priority
                />
                {caption && (
                  <div
                    className="absolute bottom-0 left-0 right-0 flex items-center justify-center px-4 pb-8"
                    style={{
                      background:
                        "linear-gradient(transparent, rgba(0, 0, 0, 0.3))",
                      minHeight: "100px",
                    }}
                  >
                    <p
                      style={{
                        fontSize: `${fontSize}px`,
                        color: "#ffffff",
                        textShadow: `
                          -2px -2px 0 #000,  
                           2px -2px 0 #000,
                          -2px  2px 0 #000,
                           2px  2px 0 #000,
                          -1px -1px 0 #000,  
                           1px -1px 0 #000,
                          -1px  1px 0 #000,
                           1px  1px 0 #000
                        `,
                        textAlign: "center",
                        maxWidth: "90%",
                        margin: "0 auto",
                        wordWrap: "break-word",
                        lineHeight: 1.3,
                        fontWeight: 500,
                      }}
                    >
                      {caption}
                    </p>
                  </div>
                )}
              </div>
            </Card>
            <Card className="p-4 shadow-md">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">
                    Episode
                  </p>
                  <p className="text-sm font-medium">{screenshot.episode}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">
                    Character
                  </p>
                  <p className="text-sm font-medium">
                    {screenshot.character || "Unknown"}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">
                    Timestamp
                  </p>
                  <p className="text-sm font-medium">{screenshot.timestamp}</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6 shadow-md">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Caption</label>
                  <Textarea
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Enter your caption..."
                    className="min-h-[100px] resize-none transition-colors focus:border-primary"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Font Size</label>
                    <span className="text-sm text-muted-foreground">
                      {fontSize}px
                    </span>
                  </div>
                  <Slider
                    value={fontSize}
                    onValueChange={setFontSize}
                    min={16}
                    max={36}
                    step={1}
                    className="py-2"
                  />
                </div>

                <div className="flex gap-4">
                  <Button className="flex-1 shadow-sm transition-all hover:shadow-md">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 shadow-sm transition-all hover:shadow-md"
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
