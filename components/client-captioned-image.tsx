"use client";

import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { useImageBounds } from "@/hooks/useImageBounds";
import { CaptionText } from "./caption-text";

/**
 * Props for the CaptionedImage component
 */
export interface CaptionedImageProps {
  /** URL of the primary image to display */
  imageUrl: string;
  /** Optional URL of a secondary image for toggling */
  image2Url?: string;
  /** Text caption to overlay on the image */
  caption?: string;
  /** Font size of the caption in pixels */
  fontSize?: number;
  /** Width of the text outline in pixels */
  outlineWidth?: number;
  /** Size of the text shadow in pixels */
  shadowSize?: number;
  /** Font family to use for the caption */
  fontFamily?: string;
  /** Whether to prioritize loading this image */
  priority?: boolean;
  /** Whether to maintain the image's aspect ratio */
  maintainAspectRatio?: boolean;
  /** Whether to automatically toggle between images */
  autoToggle?: boolean;
  /** Whether to use relaxed line break rules */
  relaxedLineBreaks?: boolean;
}

/**
 * Client-side component for displaying an image with an overlaid caption
 * Supports image toggling, caption styling, and responsive layout
 * @param props - The component props
 * @param props.imageUrl - URL of the primary image
 * @param props.image2Url - Optional URL of a secondary image
 * @param props.caption - Text caption to overlay
 * @param props.fontSize - Font size in pixels (default: 18)
 * @param props.outlineWidth - Text outline width in pixels (default: 1)
 * @param props.shadowSize - Text shadow size in pixels (default: 0)
 * @param props.fontFamily - Font family for caption (default: "Arial")
 * @param props.priority - Whether to prioritize loading
 * @param props.maintainAspectRatio - Whether to maintain aspect ratio
 * @param props.autoToggle - Whether to auto-toggle images
 * @param props.relaxedLineBreaks - Whether to use relaxed line breaks
 * @returns A container with the image and overlaid caption
 */
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
}: CaptionedImageProps): React.ReactElement | null {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width } = useImageBounds(containerRef);
  const [showSecondFrame, setShowSecondFrame] = useState(false);

  // Auto toggle effect
  useEffect(() => {
    if (!autoToggle || !image2Url) return;

    const interval = setInterval(() => {
      setShowSecondFrame((prev: boolean) => !prev);
    }, 2000);

    return () => clearInterval(interval);
  }, [autoToggle, image2Url]);

  // Calculate font size based on container width
  const calculatedFontSize = width * (fontSize / 500);

  const handleDoubleClick = (e: React.MouseEvent): void => {
    e.preventDefault(); // Prevent text selection
    console.log("Double click detected", { image2Url, showSecondFrame });
    if (image2Url) {
      setShowSecondFrame((prev: boolean) => !prev);
    }
  };

  // Ensure we have a valid image URL
  const currentImageUrl = showSecondFrame && image2Url ? image2Url : imageUrl;
  if (!currentImageUrl) {
    return null;
  }

  return (
    <div
      className={`relative min-h-12 select-none ${maintainAspectRatio ? "aspect-video" : "h-full w-fit"}`}
      ref={containerRef}
      onDoubleClick={handleDoubleClick}
      style={{ cursor: image2Url ? "pointer" : "default" }}
    >
      <Image
        src={currentImageUrl}
        alt="Screenshot"
        fill
        className="pointer-events-none object-cover"
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
