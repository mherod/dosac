"use client";

import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { useImageBounds } from "@/hooks/useImageBounds";

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
}

function getTextShadow(outlineWidth: number = 1, shadowSize: number = 0) {
  const shadows = [];

  // Add outline effect
  for (let x = -outlineWidth; x <= outlineWidth; x++) {
    for (let y = -outlineWidth; y <= outlineWidth; y++) {
      if (x === 0 && y === 0) continue;
      shadows.push(`${x}px ${y}px 0 #000`);
    }
  }

  // Add gaussian-like shadow if enabled
  if (shadowSize > 0) {
    shadows.push(`0 ${shadowSize}px ${shadowSize * 2}px rgba(0,0,0,0.7)`);
  }

  return shadows.join(", ");
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
}: CaptionedImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width } = useImageBounds(containerRef);
  const [showSecondFrame, setShowSecondFrame] = useState(false);

  const captionJoined = caption?.split("\n").join(" ");

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
      className={`min-h-12 relative select-none ${maintainAspectRatio ? "aspect-video" : "h-full w-full"}`}
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
          style={{
            paddingBottom: "4%",
          }}
        >
          <div
            style={{
              fontSize: `${calculatedFontSize}px`,
              color: "#ffffff",
              textShadow: getTextShadow(outlineWidth, shadowSize),
              textAlign: "center",
              maxWidth: "90%",
              margin: "0 auto",
              wordWrap: "break-word",
              lineHeight: 1.2,
              fontWeight: 500,
              fontFamily,
            }}
          >
            {caption.split("\n").map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
