"use client";

import * as React from "react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import * as htmlToImage from "html-to-image";
import { ArrowUpDown } from "lucide-react";
import { FrameGrid } from "@/components/frame-grid";
import { FrameStack } from "@/components/frame-stack";
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

interface MultiCaptionEditorProps {
  frames: Screenshot[];
}

export function DualCaptionEditor({ frames }: MultiCaptionEditorProps) {
  const combinedRef = useRef<HTMLDivElement>(null);

  // State for all frames
  const [captions, setCaptions] = useState(frames.map((frame) => frame.speech));

  const {
    fontSize,
    setFontSize,
    outlineWidth,
    setOutlineWidth,
    fontFamily,
    setFontFamily,
    handleShare,
  } = useCaptionState({
    defaultFontSize: 18,
    defaultOutlineWidth: 1,
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

  const handleSwapFrames = (index1: number, index2: number) => {
    const newCaptions = [...captions];
    if (
      index1 >= 0 &&
      index1 < newCaptions.length &&
      index2 >= 0 &&
      index2 < newCaptions.length &&
      typeof newCaptions[index1] === "string" &&
      typeof newCaptions[index2] === "string"
    ) {
      const temp = newCaptions[index1];
      newCaptions[index1] = newCaptions[index2];
      newCaptions[index2] = temp;
      setCaptions(newCaptions);
    }
  };

  return (
    <div className="container mx-auto max-w-[1400px] pt-8">
      <div className="grid gap-4 lg:gap-8 lg:grid-cols-[1fr,400px] xl:grid-cols-[2fr,500px]">
        {/* Combined Preview */}
        <div className="space-y-4">
          <Card className="shadow-lg transition-shadow hover:shadow-xl h-fit p-2 mx-auto">
            <div ref={combinedRef} className="h-full w-fit min-w-[500px]">
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
        <div className="flex flex-col gap-4">
          <Card className="p-4 shadow-md">
            <div className="space-y-4">
              {frames.map((frame, index) => (
                <div key={frame.id} className="space-y-2">
                  <label className="text-sm font-medium">
                    Frame {index + 1} Caption
                  </label>
                  <Textarea
                    value={captions[index]}
                    onChange={(e) => handleCaptionChange(index, e.target.value)}
                    placeholder={`Enter caption for frame ${index + 1}...`}
                    className="min-h-[80px] resize-none transition-colors focus:border-primary"
                  />
                </div>
              ))}

              {frames.length > 1 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Swap Frames</label>
                  <div className="grid grid-cols-2 gap-2">
                    {frames.map(
                      (_, index) =>
                        index < frames.length - 1 && (
                          <Button
                            key={`swap-${index}`}
                            className="w-full shadow-sm transition-all hover:shadow-md"
                            onClick={() => handleSwapFrames(index, index + 1)}
                            variant="outline"
                          >
                            <ArrowUpDown className="mr-2 h-4 w-4" />
                            Swap {index + 1} & {index + 2}
                          </Button>
                        ),
                    )}
                  </div>
                </div>
              )}

              <FontControls
                fontSize={fontSize}
                setFontSize={setFontSize}
                outlineWidth={outlineWidth}
                setOutlineWidth={setOutlineWidth}
                fontFamily={fontFamily}
                setFontFamily={setFontFamily}
              />

              <div className="border-t pt-4">
                <ActionButtons
                  onDownload={handleDownload}
                  onShare={() => handleShare(captions.join("\n"))}
                />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
