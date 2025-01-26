"use client";

import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import * as htmlToImage from "html-to-image";
import { CaptionedImage } from "@/components/captioned-image";
import { useSearchParams } from "next/navigation";
import { FontControls } from "@/components/caption-controls/font-controls";
import { ActionButtons } from "@/components/caption-controls/action-buttons";
import { useCaptionState } from "@/lib/hooks/use-caption-state";

interface Screenshot {
  id: string;
  imageUrl: string;
  image2Url: string;
  blankImageUrl: string;
  blankImage2Url: string;
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
  const imageRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();

  // Get the text from URL if it exists, otherwise use screenshot speech
  const urlText = searchParams?.get("text");
  const initialCaption = urlText
    ? decodeURIComponent(urlText)
    : screenshot.speech;
  const [caption, setCaption] = useState(initialCaption);

  const {
    fontSize,
    setFontSize,
    outlineWidth,
    setOutlineWidth,
    fontFamily,
    setFontFamily,
    handleShare,
  } = useCaptionState({
    defaultFontSize: 24,
    defaultOutlineWidth: 1,
    defaultFontFamily: "system-ui",
  });

  // Update caption when URL text parameter changes
  useEffect(() => {
    const urlText = searchParams?.get("text");
    if (urlText) {
      setCaption(decodeURIComponent(urlText));
    } else {
      setCaption(screenshot.speech);
    }
  }, [searchParams, screenshot.speech]);

  const handleDownload = async () => {
    if (!imageRef.current) return;

    try {
      const dataUrl = await htmlToImage.toPng(imageRef.current, {
        quality: 1.0,
        pixelRatio: 2,
      });

      const link = document.createElement("a");
      link.download = `${screenshot.episode}-${screenshot.timestamp}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Error generating image:", error);
    }
  };

  return (
    <div className="container mx-auto max-w-5xl pt-8">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-4">
          <Card className="overflow-hidden shadow-lg transition-shadow hover:shadow-xl">
            <div ref={imageRef}>
              <CaptionedImage
                imageUrl={screenshot.imageUrl}
                image2Url={screenshot.image2Url}
                caption={caption}
                fontSize={fontSize[0]}
                outlineWidth={outlineWidth[0]}
                fontFamily={fontFamily}
                maintainAspectRatio={true}
              />
            </div>
          </Card>
          <Card className="p-3 shadow-md">
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

        <div className="space-y-4">
          <Card className="p-4 shadow-md">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Caption</label>
                <Textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Enter your caption..."
                  className="min-h-[100px] resize-none transition-colors focus:border-primary"
                />
              </div>

              <FontControls
                fontSize={fontSize}
                setFontSize={setFontSize}
                outlineWidth={outlineWidth}
                setOutlineWidth={setOutlineWidth}
                fontFamily={fontFamily}
                setFontFamily={setFontFamily}
              />

              <ActionButtons
                onDownload={handleDownload}
                onShare={() => handleShare(caption)}
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
