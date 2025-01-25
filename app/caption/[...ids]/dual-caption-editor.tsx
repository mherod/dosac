"use client";

import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import * as htmlToImage from "html-to-image";
import { Download, Share2, ArrowUpDown } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { FrameGrid } from "@/components/frame-grid";
import { FrameStack } from "@/components/frame-stack";

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

interface MultiCaptionEditorProps {
  frames: Screenshot[];
}

export function DualCaptionEditor({ frames }: MultiCaptionEditorProps) {
  const combinedRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  // Default values
  const defaultFontSize = 18;
  const defaultOutlineWidth = 1;
  const defaultFontFamily = "system-ui";

  // State for all frames
  const [captions, setCaptions] = useState(frames.map((frame) => frame.speech));
  const [fontSize, setFontSize] = useState<number[]>([defaultFontSize]);
  const [outlineWidth, setOutlineWidth] = useState<number[]>([
    defaultOutlineWidth,
  ]);
  const [fontFamily, setFontFamily] = useState(defaultFontFamily);

  const fonts = [
    "Arial",
    "Impact",
    "Helvetica",
    "Verdana",
    "Times New Roman",
    "Comic Sans MS",
  ];

  // Update URL with style parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (fontSize[0] !== defaultFontSize) {
      params.set("fontSize", fontSize[0]!.toString());
    } else {
      params.delete("fontSize");
    }
    if (outlineWidth[0] !== defaultOutlineWidth) {
      params.set("outlineWidth", outlineWidth[0]!.toString());
    } else {
      params.delete("outlineWidth");
    }
    if (fontFamily !== defaultFontFamily) {
      params.set("fontFamily", fontFamily);
    } else {
      params.delete("fontFamily");
    }

    const queryString = params.toString();
    const newUrl = queryString ? `?${queryString}` : window.location.pathname;
    router.replace(newUrl, { scroll: false });
  }, [fontSize, outlineWidth, fontFamily, router, searchParams]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
  };

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
    <div className="grid gap-4 lg:gap-8 lg:grid-cols-[1fr,400px] xl:grid-cols-[2fr,500px] h-[calc(100vh-12rem)] min-h-fit overflow-visible pb-8 w-fit mx-auto">
      {/* Combined Preview */}
      <div className="space-y-4">
        <Card className="shadow-lg transition-shadow hover:shadow-xl h-fit p-2 w-fit">
          <div ref={combinedRef} className="h-full w-fit m-auto min-w-[500px]">
            {frames.length === 4 ? (
              <FrameGrid
                frames={frames}
                captions={captions}
                fontSize={fontSize[0] ?? defaultFontSize}
                outlineWidth={outlineWidth[0] ?? defaultOutlineWidth}
                fontFamily={fontFamily}
              />
            ) : (
              <FrameStack
                frames={frames}
                captions={captions}
                fontSize={fontSize[0] ?? defaultFontSize}
                outlineWidth={outlineWidth[0] ?? defaultOutlineWidth}
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

            <div>
              <label className="text-sm font-medium">Font Family</label>
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              >
                {fonts.map((font) => (
                  <option key={font} value={font}>
                    {font}
                  </option>
                ))}
              </select>
            </div>

            <div>
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

            <div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Outline Width</label>
                <span className="text-sm text-muted-foreground">
                  {outlineWidth}px
                </span>
              </div>
              <Slider
                value={outlineWidth}
                onValueChange={setOutlineWidth}
                min={1}
                max={4}
                step={1}
                className="py-2"
              />
            </div>
          </div>

          <div className="flex gap-2 mt-6 pt-4 border-t">
            <Button
              className="flex-1 shadow-sm transition-all hover:shadow-md"
              onClick={handleDownload}
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button
              className="shadow-sm transition-all hover:shadow-md"
              onClick={handleShare}
              variant="outline"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
