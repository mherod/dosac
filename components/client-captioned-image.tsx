"use client";

import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { useImageBounds } from "@/hooks/useImageBounds";
import { CaptionText } from "./caption-text";

export interface CaptionedImageProps {
  imageUrl: string;
  image2Url?: string;
  caption?: string;
  fontSize?: number;
  outlineWidth?: number;
  shadowSize?: number;
  fontFamily?: string;
  priority?: boolean;
  maintainAspectRatio?: boolean;
  autoToggle?: boolean;
  relaxedLineBreaks?: boolean;
}

export function ClientCaptionedImage({
  imageUrl,
  image2Url,
  caption,
  fontSize = 18,
  outlineWidth = 1,
  shadowSize = 0,
  fontFamily = "Arial",
  priority = false,
  maintainAspectRatio = false,
  autoToggle = false,
  relaxedLineBreaks = false,
}: CaptionedImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width } = useImageBounds(containerRef);
  const [showSecondFrame, setShowSecondFrame] = useState(false);

  // Auto toggle effect
  useEffect(() => {
    if (!autoToggle || !image2Url) return;

    const interval = setInterval(() => {
      setShowSecondFrame((prev) => !prev);
    }, 2000);

    return () => clearInterval(interval);
  }, [autoToggle, image2Url]);

  // Calculate font size based on container width
  const calculatedFontSize = width * (fontSize / 500);

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent text selection
    console.log("Double click detected", { image2Url, showSecondFrame });
    if (image2Url) {
      setShowSecondFrame((prev) => !prev);
    }
  };

  // Ensure we have a valid image URL
  const currentImageUrl = showSecondFrame && image2Url ? image2Url : imageUrl;
  if (!currentImageUrl) {
    return null;
  }

  return (
    <div
      className={`min-h-12 relative select-none ${maintainAspectRatio ? "aspect-video" : "h-full w-fit"}`}
      ref={containerRef}
      onDoubleClick={handleDoubleClick}
      style={{ cursor: image2Url ? "pointer" : "default" }}
    >
      <Image
        src={currentImageUrl}
        alt="Screenshot"
        fill
        className="object-cover pointer-events-none"
        sizes="(max-width: 1200px) 100vw, 1200px"
        priority={priority}
        unoptimized
      />
      {caption && (
        <div
          className="absolute bottom-0 left-0 right-0 flex items-center justify-center"
          style={{ paddingBottom: "4%" }}
        >
          <CaptionText
            caption={caption}
            fontSize={calculatedFontSize}
            outlineWidth={outlineWidth}
            shadowSize={shadowSize}
            fontFamily={fontFamily}
            relaxedLineBreaks={relaxedLineBreaks}
          />
        </div>
      )}
    </div>
  );
}
