"use client";

import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import * as htmlToImage from "html-to-image";
import { CaptionedImage } from "@/components/captioned-image";
import { Download, Share2, ArrowUpDown } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

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

interface DualCaptionEditorProps {
  frame1: Screenshot;
  frame2: Screenshot;
}

export function DualCaptionEditor({ frame1, frame2 }: DualCaptionEditorProps) {
  const combinedRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  // Default values
  const defaultFontSize = 24;
  const defaultOutlineWidth = 1;
  const defaultFontFamily = "system-ui";

  // State for both frames
  const [caption1, setCaption1] = useState(frame1.speech);
  const [caption2, setCaption2] = useState(frame2.speech);
  const [fontSize, setFontSize] = useState([defaultFontSize]);
  const [outlineWidth, setOutlineWidth] = useState([defaultOutlineWidth]);
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

    // Preserve the compare parameter if it exists
    const compareId = searchParams.get("compare");
    if (compareId) {
      params.set("compare", compareId);
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

      const link = document.createElement("a");
      link.download = `${frame1.episode}-meme.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Error generating image:", error);
    }
  };

  const handleSwapFrames = () => {
    const tempCaption = caption1;
    setCaption1(caption2);
    setCaption2(tempCaption);
  };

  return (
    <div className="grid gap-4 lg:gap-8 lg:grid-cols-[1fr,400px] xl:grid-cols-[2fr,500px] h-[calc(100vh-12rem)]">
      {/* Combined Preview */}
      <div className="space-y-4 min-h-0">
        <Card className="overflow-hidden shadow-lg transition-shadow hover:shadow-xl h-[calc(100%-4rem)]">
          <div ref={combinedRef} className="h-full">
            <div className="h-1/2">
              <CaptionedImage
                imageUrl={frame1.blankImageUrl}
                caption={caption1}
                fontSize={fontSize[0]}
                outlineWidth={outlineWidth[0]}
                fontFamily={fontFamily}
              />
            </div>
            <div className="h-1/2">
              <CaptionedImage
                imageUrl={frame2.blankImageUrl}
                caption={caption2}
                fontSize={fontSize[0]}
                outlineWidth={outlineWidth[0]}
                fontFamily={fontFamily}
              />
            </div>
          </div>
        </Card>
        <div className="flex gap-2">
          <Button
            className="flex-1 shadow-sm transition-all hover:shadow-md"
            onClick={handleDownload}
          >
            <Download className="mr-2 h-4 w-4" />
            Download Meme
          </Button>
          <Button
            className="shadow-sm transition-all hover:shadow-md"
            onClick={handleShare}
            variant="outline"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-4 overflow-y-auto">
        <Card className="p-4 shadow-md">
          <div className="space-y-4">
            {/* Top Frame Caption */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Top Frame Caption</label>
              <Textarea
                value={caption1}
                onChange={(e) => setCaption1(e.target.value)}
                placeholder="Enter caption for top frame..."
                className="min-h-[80px] resize-none transition-colors focus:border-primary"
              />
            </div>

            {/* Bottom Frame Caption */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Bottom Frame Caption
              </label>
              <Textarea
                value={caption2}
                onChange={(e) => setCaption2(e.target.value)}
                placeholder="Enter caption for bottom frame..."
                className="min-h-[80px] resize-none transition-colors focus:border-primary"
              />
            </div>

            <Button
              className="w-full shadow-sm transition-all hover:shadow-md"
              onClick={handleSwapFrames}
              variant="outline"
            >
              <ArrowUpDown className="mr-2 h-4 w-4" />
              Swap Frames
            </Button>

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
        </Card>
      </div>
    </div>
  );
}
