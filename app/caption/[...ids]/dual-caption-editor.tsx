"use client";

import * as React from "react";
import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import * as htmlToImage from "html-to-image";
import { FrameGrid } from "@/components/frame-grid";
import { FrameStack } from "@/components/frame-stack";
import { useCaptionState } from "@/lib/hooks/use-caption-state";
import { EditorControlsCard } from "@/components/caption-controls/editor-controls-card";
import type { Screenshot } from "@/lib/types";
import { handleShare } from "@/lib/share";
import { cn } from "@/lib/utils";

interface MultiCaptionEditorProps {
  frames: Screenshot[];
}

export function DualCaptionEditor({
  frames: initialFrames,
}: MultiCaptionEditorProps) {
  const combinedRef = useRef<HTMLDivElement>(null);

  // State for frames and captions
  const [frames, setFrames] = useState(initialFrames);
  const [captions, setCaptions] = useState(
    initialFrames.map((frame) => frame.speech),
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
    defaultOutlineWidth: 1,
    defaultShadowSize: 0,
    defaultFontFamily: "system-ui",
  });

  const handleDownload = async () => {
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

  const handleCaptionChange = (index: number, value: string) => {
    const newCaptions = [...captions];
    newCaptions[index] = value;
    setCaptions(newCaptions);
  };

  const onShare = async () => {
    if (!frames.length || !frames[0]) return;
    const path = `/caption/${frames.map((f) => f.id).join("/")}`;
    await handleShare(path, captions.join("\n"));
  };

  return (
    <div className={cn("flex flex-wrap justify-center gap-4 lg:gap-8")}>
      {/* Combined Preview */}
      <div className="flex mx-auto min-w-[40vw] w-full max-w-[620px]">
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
            maxWidth: frames.length === 4 ? "620px" : undefined,
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
                captions={captions}
                fontSize={fontSize[0] ?? 18}
                outlineWidth={outlineWidth[0] ?? 1}
                fontFamily={fontFamily}
              />
            ) : (
              <FrameStack
                frames={frames}
                captions={captions}
                fontSize={fontSize[0] ?? 18}
                outlineWidth={outlineWidth[0] ?? 1}
                fontFamily={fontFamily}
              />
            )}
          </div>
        </Card>
      </div>

      {/* Controls */}
      <div className="mx-auto flex flex-col gap-4 w-full min-w-[30vw] max-w-[400px]">
        <EditorControlsCard
          captions={captions}
          onCaptionChange={handleCaptionChange}
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
        />
      </div>
    </div>
  );
}
