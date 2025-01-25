import Image from "next/image";
import { useRef } from "react";
import { useImageBounds } from "@/hooks/useImageBounds";

interface CaptionedImageProps {
  imageUrl: string;
  caption?: string;
  fontSize?: number;
  outlineWidth?: number;
  fontFamily?: string;
  priority?: boolean;
}

export function CaptionedImage({
  imageUrl,
  caption,
  fontSize = 18,
  outlineWidth = 1,
  fontFamily = "Arial",
  priority = false,
}: CaptionedImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width } = useImageBounds(containerRef);

  const getTextShadow = (width: number = 1) => {
    const shadows = [];
    for (let x = -width; x <= width; x++) {
      for (let y = -width; y <= width; y++) {
        if (x === 0 && y === 0) continue;
        shadows.push(`${x}px ${y}px 0 #000`);
      }
    }
    return shadows.join(", ");
  };

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
          <p
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
            {caption}
          </p>
        </div>
      )}
    </div>
  );
}
