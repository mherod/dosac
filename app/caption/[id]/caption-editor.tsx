"use client";

import { CaptionFrameControls } from "@/components/caption-controls/caption-frame-controls";
import { EditorControlsCard } from "@/components/caption-controls/editor-controls-card";
import { CaptionedImage } from "@/components/captioned-image";
import { Card } from "@/components/ui/card";
import { useCaptionState } from "@/lib/hooks/use-caption-state";
import { handleShare } from "@/lib/share";
import * as htmlToImage from "html-to-image";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

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

export function CaptionEditor({
  screenshot,
}: CaptionEditorProps): React.ReactElement {
  const imageRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();

  // Get the text from URL if it exists, otherwise use screenshot speech
  const urlText = searchParams?.get("text");
  const initialCaption = urlText
    ? decodeURIComponent(urlText)
    : screenshot.speech;
  const [caption, setCaption] = useState<string>(initialCaption);

  const {
    fontSize,
    setFontSize,
    outlineWidth,
    setOutlineWidth,
    shadowSize,
    setShadowSize,
    fontFamily,
    setFontFamily,
  } = useCaptionState();

  // Update caption when URL text parameter changes
  useEffect(() => {
    const urlText = searchParams?.get("text");
    if (urlText) {
      setCaption(decodeURIComponent(urlText));
    } else {
      setCaption(screenshot.speech);
    }
  }, [searchParams, screenshot.speech]);

  const handleDownload = async (): Promise<void> => {
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

  const [primaryImage, setPrimaryImage] = useState<string>(screenshot.imageUrl);
  const [secondaryImage, setSecondaryImage] = useState(screenshot.image2Url);

  const handleFrameSelect = (selectedImage: string): void => {
    if (selectedImage === primaryImage) {
      // If selecting the primary image, swap primary and secondary
      setPrimaryImage(secondaryImage);
      setSecondaryImage(primaryImage);
    } else {
      // If selecting the secondary image or a new image, make it primary
      setPrimaryImage(selectedImage);
    }
  };

  const onShare = async (): Promise<void> => {
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
            <CaptionFrameControls
              imageUrls={[screenshot.imageUrl, screenshot.image2Url]}
              selectedImage={primaryImage}
              onSelect={handleFrameSelect}
              caption={caption}
              onCaptionChange={setCaption}
              label="Primary Frame"
            />
          </EditorControlsCard>
        </div>
      </div>
    </div>
  );
}
