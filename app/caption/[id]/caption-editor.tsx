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
import { VerticalFrameStrip } from "@/components/vertical-frame-strip";

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
    handleShare,
  } = useCaptionState({
    defaultFontSize: 24,
    defaultOutlineWidth: 1,
    defaultShadowSize: 0,
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

  return (
    <div className="container mx-auto max-w-5xl pt-8">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <Card className="overflow-hidden shadow-lg transition-shadow hover:shadow-xl">
            <div className="relative">
              <div ref={imageRef}>
                <CaptionedImage
                  imageUrl={primaryImage}
                  image2Url={secondaryImage}
                  caption={caption}
                  fontSize={fontSize[0]}
                  outlineWidth={outlineWidth[0]}
                  shadowSize={shadowSize[0]}
                  fontFamily={fontFamily}
                  maintainAspectRatio={true}
                />
              </div>
            </div>
          </Card>
          <div className="bg-muted/50 rounded-lg p-4">
            <ActionButtons
              onDownload={handleDownload}
              onShare={() => handleShare(caption)}
              className="grid-cols-2"
            />
          </div>
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
          <Card className="p-6 shadow-md">
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-center justify-between h-6">
                    <label className="text-sm font-medium text-foreground leading-6">
                      Caption
                    </label>
                    <span className="text-sm text-muted-foreground leading-6">
                      {caption.length} characters
                    </span>
                  </div>
                  <Textarea
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Enter your caption..."
                    className="min-h-[120px] resize-none transition-colors focus:border-primary"
                  />
                </div>

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
              </div>

              <div className="space-y-6 pt-6 border-t">
                <div className="space-y-4">
                  <div className="h-6">
                    <label className="text-sm font-medium text-foreground leading-6">
                      Font Settings
                    </label>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <FontControls
                      fontSize={fontSize}
                      setFontSize={setFontSize}
                      outlineWidth={outlineWidth}
                      setOutlineWidth={setOutlineWidth}
                      shadowSize={shadowSize}
                      setShadowSize={setShadowSize}
                      fontFamily={fontFamily}
                      setFontFamily={setFontFamily}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
