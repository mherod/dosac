"use client";

import Image from "next/image";
import { useRef } from "react";
import { useImageBounds } from "@/hooks/useImageBounds";

export interface CaptionedImageProps {
  imageUrl: string;
  caption?: string;
  fontSize?: number;
  outlineWidth?: number;
  fontFamily?: string;
  priority?: boolean;
}

function getTextShadow(width: number = 1) {
  const shadows = [];
  for (let x = -width; x <= width; x++) {
    for (let y = -width; y <= width; y++) {
      if (x === 0 && y === 0) continue;
      shadows.push(`${x}px ${y}px 0 #000`);
    }
  }
  return shadows.join(", ");
}

export function ClientCaptionedImage({
  imageUrl,
  caption,
  fontSize = 18,
  outlineWidth = 1,
  fontFamily = "Arial",
  priority = false,
}: CaptionedImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width } = useImageBounds(containerRef);

  // Calculate font size based on container width
  const calculatedFontSize = width * (fontSize / 500); // fontSize becomes a proportion of image width

  return (
    <div className="relative aspect-video" ref={containerRef}>
      <Image
        src={imageUrl}
        alt="Screenshot"
        fill
        className="object-cover"
        sizes="(max-width: 1200px) 100vw, 1200px"
        priority={priority}
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
              textShadow: getTextShadow(outlineWidth),
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
