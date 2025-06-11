"use client";

import { CaptionFrameControls } from "@/components/caption-controls/caption-frame-controls";
import { EditorControlsCard } from "@/components/caption-controls/editor-controls-card";
import { FrameGrid } from "@/components/frame-grid";
import { FrameStack } from "@/components/frame-stack";
import { Card } from "@/components/ui/card";
import { CAPTION_DEFAULTS } from "@/lib/config/caption";
import { useCaptionState } from "@/lib/hooks/use-caption-state";
import { handleShare } from "@/lib/share";
import type { Screenshot } from "@/lib/types";
import { cn } from "@/lib/utils";
import * as htmlToImage from "html-to-image";
import { useRef, useState } from "react";

interface MultiCaptionEditorProps {
  frames: Screenshot[];
}

export function DualCaptionEditor({
  frames: initialFrames,
}: MultiCaptionEditorProps): React.ReactElement {
  const combinedRef = useRef<HTMLDivElement>(null);

  // State for frames and captions
  const [frames, setFrames] = useState(initialFrames);
  const [selectedImages, setSelectedImages] = useState(
    initialFrames.map((frame: Screenshot) => frame.imageUrl),
  );

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
    defaultFontSize: 18,
    defaultOutlineWidth: CAPTION_DEFAULTS.outlineWidth,
    defaultShadowSize: CAPTION_DEFAULTS.shadowSize,
    defaultFontFamily: CAPTION_DEFAULTS.fontFamily,
  });

  const handleDownload = async (): Promise<void> => {
    if (!combinedRef.current) return;

    try {
      const dataUrl = await htmlToImage.toPng(combinedRef.current, {
        quality: 1.0,
        pixelRatio: 2,
      });

      if (!frames.length || !frames[0]) {
        throw new Error("No frames available to download");
      }

      const link = document.createElement("a");
      link.download = `${frames[0].episode}-meme.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Error generating image:", error);
    }
  };

  const handleCaptionChange = (index: number, value: string): void => {
    const newFrames = [...frames];
    const currentFrame = newFrames[index];
    if (!currentFrame) return;

    newFrames[index] = {
      id: currentFrame.id,
      imageUrl: currentFrame.imageUrl,
      image2Url: currentFrame.image2Url,
      timestamp: currentFrame.timestamp,
      subtitle: currentFrame.subtitle,
      speech: value,
      episode: currentFrame.episode,
      character: currentFrame.character,
    };
    setFrames(newFrames);
  };

  const onShare = async (): Promise<void> => {
    if (!frames.length || !frames[0]) return;
    const path = `/caption/${frames.map((f: Screenshot) => f.id).join("/")}`;
    await handleShare(path, frames.map((f: Screenshot) => f.speech).join("\n"));
  };

  const handleFrameSelect = (index: number, imageUrl: string): void => {
    const newSelected = [...selectedImages];
    newSelected[index] = imageUrl;

    // If deselected, fall back to the original image
    const frame = initialFrames[index];
    if (!frame) return;

    const finalUrl = newSelected[index] || frame.imageUrl;

    setSelectedImages(
      newSelected.map((url: string, i: number) =>
        i === index ? finalUrl : url,
      ),
    );

    // Update the frames array with the new image URL
    const updatedFrames = frames.map((frame: Screenshot, i: number) =>
      i === index ? { ...frame, imageUrl: finalUrl } : frame,
    );
    setFrames(updatedFrames);
  };

  return (
    <div
      className={cn(
        "mx-auto flex max-w-full flex-wrap justify-center gap-4 lg:gap-8",
      )}
    >
      {/* Combined Preview */}
      <div className="mx-auto flex w-full min-w-[30vw] max-w-[500px]">
        <Card
          style={{
            boxShadow:
              "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
            transition: "box-shadow 0.2s",
            height: "fit-content",
            padding: "0.5rem",
            marginLeft: "auto",
            marginRight: "auto",
            width: "fit-content",
            maxWidth: frames.length === 4 ? "500px" : undefined,
            minWidth: frames.length === 4 ? undefined : "100%",
          }}
        >
          <div
            ref={combinedRef}
            style={{
              height: "100%",
              width: "100%",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            {frames.length === 4 ? (
              <FrameGrid
                frames={frames}
                captions={frames.map((f: Screenshot) => f.speech)}
                fontSize={fontSize}
                outlineWidth={outlineWidth}
                fontFamily={fontFamily}
              />
            ) : (
              <FrameStack
                frames={frames}
                captions={frames.map((f: Screenshot) => f.speech)}
                fontSize={fontSize}
                outlineWidth={outlineWidth}
                fontFamily={fontFamily}
              />
            )}
          </div>
        </Card>
      </div>

      {/* Updated Controls */}
      <div className="mx-auto flex w-full min-w-[30vw] max-w-[400px] flex-col gap-4">
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
          {frames.map((frame: Screenshot, index: number) => (
            <CaptionFrameControls
              key={`${frame.id}-${index}`}
              imageUrls={[frame.imageUrl, frame.image2Url]}
              selectedImage={selectedImages[index]}
              onSelect={(url: string) => handleFrameSelect(index, url)}
              singleSelection={true}
              caption={frame.speech}
              onCaptionChange={(value: string) =>
                handleCaptionChange(index, value)
              }
              label={`Frame ${index + 1}`}
            />
          ))}
        </EditorControlsCard>
      </div>
    </div>
  );
}
