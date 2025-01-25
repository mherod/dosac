"use client";

import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import * as htmlToImage from "html-to-image";
import { CaptionedImage } from "@/components/captioned-image";
import { Download, Share2 } from "lucide-react";
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

interface CaptionEditorProps {
  screenshot: Screenshot;
}

export function CaptionEditor({ screenshot }: CaptionEditorProps) {
  const imageRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  // Default values
  const defaultCaption = screenshot.speech;
  const defaultFontSize = 24;
  const defaultOutlineWidth = 1;
  const defaultFontFamily = "system-ui";

  const [caption, setCaption] = useState(
    searchParams?.get("caption") ?? defaultCaption,
  );
  const [fontSize, setFontSize] = useState([
    Number(searchParams?.get("fontSize")) || defaultFontSize,
  ]);
  const [outlineWidth, setOutlineWidth] = useState([
    Number(searchParams?.get("outlineWidth")) || defaultOutlineWidth,
  ]);
  const [fontFamily, setFontFamily] = useState(
    searchParams?.get("fontFamily") ?? defaultFontFamily,
  );

  const fonts = [
    "Arial",
    "Impact",
    "Helvetica",
    "Verdana",
    "Times New Roman",
    "Comic Sans MS",
  ];

  // Update URL only when values differ from defaults
  useEffect(() => {
    const params = new URLSearchParams();

    if (caption !== defaultCaption) {
      params.set("caption", caption);
    }
    if (fontSize.length > 0 && fontSize[0] !== defaultFontSize) {
      params.set("fontSize", fontSize[0].toString());
    }
    if (outlineWidth.length > 0 && outlineWidth[0] !== defaultOutlineWidth) {
      params.set("outlineWidth", outlineWidth[0].toString());
    }
    if (fontFamily !== defaultFontFamily) {
      params.set("fontFamily", fontFamily);
    }

    const queryString = params.toString();
    const newUrl = queryString ? `?${queryString}` : window.location.pathname;
    router.replace(newUrl, { scroll: false });
  }, [
    caption,
    fontSize,
    outlineWidth,
    fontFamily,
    router,
    defaultCaption,
    defaultFontSize,
    defaultOutlineWidth,
    defaultFontFamily,
  ]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
  };

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
    <div className="p-4">
      <div className="container max-w-5xl">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-4">
            <Card className="overflow-hidden shadow-lg transition-shadow hover:shadow-xl">
              <div ref={imageRef}>
                <CaptionedImage
                  imageUrl={screenshot.blankImageUrl}
                  caption={caption}
                  fontSize={fontSize[0]}
                  outlineWidth={outlineWidth[0]}
                  fontFamily={fontFamily}
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

                <div className="space-y-4">
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
                      <label className="text-sm font-medium">
                        Outline Width
                      </label>
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

                <div className="flex gap-4">
                  <Button
                    className="flex-1 shadow-sm transition-all hover:shadow-md"
                    onClick={handleDownload}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 shadow-sm transition-all hover:shadow-md"
                    onClick={handleShare}
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
