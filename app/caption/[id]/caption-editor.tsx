"use client";

import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import * as htmlToImage from "html-to-image";
import { CaptionedImage } from "@/components/captioned-image";
import { useSearchParams } from "next/navigation";
import { useCaptionState } from "@/lib/hooks/use-caption-state";
import { VerticalFrameStrip } from "@/components/vertical-frame-strip";
import { EditorControlsCard } from "@/components/caption-controls/editor-controls-card";
import { handleShare } from "@/lib/share";

interface Screenshot {
  id: string;
  imageUrl: string;
  image2Url: string;
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
    shadowSize,
    setShadowSize,
    fontFamily,
    setFontFamily,
  } = useCaptionState({
    defaultFontSize: 24,
    defaultOutlineWidth: 1,
    defaultShadowSize: 0,
    defaultFontFamily: "Arial",
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

  const [primaryImage, setPrimaryImage] = useState(screenshot.imageUrl);
  const [secondaryImage, setSecondaryImage] = useState(screenshot.image2Url);

  const handleFrameSelect = (selectedImage: string) => {
    if (selectedImage === primaryImage) {
      // If selecting the primary image, swap primary and secondary
      setPrimaryImage(secondaryImage);
      setSecondaryImage(primaryImage);
    } else {
      // If selecting the secondary image or a new image, make it primary
      setPrimaryImage(selectedImage);
    }
  };

  const onShare = async () => {
    const path = `/caption/${screenshot.id}`;
    await handleShare(path, caption);
  };

  return (
    <div className="pt-8">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <Card className="overflow-hidden shadow-lg transition-shadow hover:shadow-xl">
            <div className="relative">
              <div ref={imageRef}>
                <CaptionedImage
                  imageUrl={primaryImage}
                  image2Url={secondaryImage}
                  caption={caption}
                  fontSize={fontSize}
                  outlineWidth={outlineWidth}
                  shadowSize={shadowSize}
                  fontFamily={fontFamily}
                  maintainAspectRatio={true}
                />
              </div>
            </div>
          </Card>

          <Card className="p-4 shadow-md">
            <div className="space-y-3">
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
          <EditorControlsCard
            captions={[caption]}
            onCaptionChange={(_, value) => setCaption(value)}
            fontSize={fontSize}
            setFontSize={setFontSize}
            outlineWidth={outlineWidth}
            setOutlineWidth={setOutlineWidth}
            shadowSize={shadowSize}
            setShadowSize={setShadowSize}
            fontFamily={fontFamily}
            setFontFamily={setFontFamily}
            onDownload={handleDownload}
            onShare={onShare}
          >
            <div className="space-y-4">
              <div className="h-6">
                <label className="text-sm font-medium text-foreground leading-6">
                  Frame
                </label>
              </div>
              <div className="flex items-center justify-center bg-muted/50 rounded-lg p-4">
                <VerticalFrameStrip
                  imageUrls={[screenshot.imageUrl, screenshot.image2Url]}
                  centerImageUrl={primaryImage}
                  frameWidth={100}
                  onFrameSelect={handleFrameSelect}
                />
              </div>
            </div>
          </EditorControlsCard>
        </div>
      </div>
    </div>
  );
}
