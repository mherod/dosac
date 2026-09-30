"use client";

import * as htmlToImage from "html-to-image";
import { useRef, useState } from "react";
import { CaptionFrameControls } from "@/components/caption-controls/caption-frame-controls";
import { EditorControlsCard } from "@/components/caption-controls/editor-controls-card";
import { CaptionedImage } from "@/components/captioned-image";
import { Card } from "@/components/ui/card";
import { useCaptionState } from "@/lib/hooks/use-caption-state";
import { handleShare } from "@/lib/share";
import { formatEpisodeId, formatTimestamp } from "@/lib/utils";

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

interface CharacterInFrame {
  name: string;
  confidence: number;
}

interface CaptionEditorProps {
  screenshot: Screenshot;
  characters?: CharacterInFrame[] | null;
  /** Optional text override extracted server-side from searchParams */
  initialText?: string;
}

export function CaptionEditor({
  screenshot,
  characters,
  initialText,
}: CaptionEditorProps): React.ReactElement {
  const imageRef = useRef<HTMLDivElement>(null);

  // Use server-provided initialText if available, otherwise use screenshot speech
  const initialCaption = initialText
    ? decodeURIComponent(initialText)
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
      return;
    }

    if (selectedImage === secondaryImage) {
      // Keep both source frames distinct while promoting the selected frame.
      setPrimaryImage(secondaryImage);
      setSecondaryImage(primaryImage);
      return;
    }

    setPrimaryImage(selectedImage);
  };

  const onShare = async (): Promise<void> => {
    const path = `/caption/${screenshot.id}`;
    await handleShare(path, caption);
  };

  return (
    <div>
      <div className="grid items-start gap-6 md:grid-cols-2">
        <div>
          <Card className="overflow-hidden shadow-sm">
            <div className="flex items-center justify-between gap-3 border-b px-4 py-3">
              <h2 className="text-sm font-semibold">Preview</h2>
              <span className="text-xs text-muted-foreground">
                Current caption
              </span>
            </div>
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
            <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-2 border-t p-4 text-sm">
              <dt className="text-muted-foreground">Episode</dt>
              <dd className="text-right font-medium">
                {formatEpisodeId(screenshot.episode)}
              </dd>
              <dt className="text-muted-foreground">Character</dt>
              <dd className="break-words text-right font-medium">
                {characters && characters.length > 0
                  ? characters.map((c) => c.name).join(", ")
                  : screenshot.character || "Unknown"}
              </dd>
              <dt className="text-muted-foreground">Timestamp</dt>
              <dd className="text-right font-medium tabular-nums">
                {formatTimestamp(screenshot.timestamp)}
              </dd>
            </dl>
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
