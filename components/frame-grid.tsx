"use client";

import type { Screenshot } from "@/lib/types";
import Image from "next/image";
import { useRef } from "react";
import { CaptionText } from "./caption-text";

interface FrameGridProps {
  frames: Screenshot[];
  captions: string[];
  fontSize: number;
  outlineWidth: number;
  fontFamily: string;
  relaxedLineBreaks?: boolean;
}

export function FrameGrid({
  frames,
  captions,
  fontSize,
  outlineWidth,
  fontFamily,
  relaxedLineBreaks,
}: FrameGridProps): React.ReactElement {
  const maxWidth = 600;
  const frameW = 4;
  const frameH = 3;
  const rootRef = useRef<HTMLDivElement>(null);

  // Simplified dimension calculations
  const cellWidth = maxWidth / 2;
  const cellHeight = (cellWidth * frameH) / frameW; // Maintain 16:9 aspect ratio per cell
  const gridHeight = cellHeight * 2; // Total height for 2 rows

  const FrameRow = ({
    frames,
    startIndex,
    priorityIndex,
  }: {
    frames: Screenshot[];
    startIndex: number;
    priorityIndex: number;
  }): React.ReactElement => {
    const rowRef = useRef<HTMLDivElement>(null);
    const rowRect = rowRef.current?.getBoundingClientRect();
    const frameCount = frames.length;
    const rowWidth = rowRect?.width || cellWidth * frameCount;
    const rowHeight = rowRect?.height || cellHeight;

    return (
      <div
        ref={rowRef}
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          width: rowWidth,
          height: rowHeight,
          aspectRatio: (frameW * frameCount) / frameH,
          maxWidth: maxWidth,
          overflow: "hidden",
          userSelect: "none",
        }}
      >
        {frames.map((frame: Screenshot, index: number) => (
          <div
            key={frame.id}
            style={{
              position: "relative",
              width: "100%",
              height: rowHeight,
              aspectRatio: frameW / frameH,
              userSelect: "none",
            }}
          >
            <Image
              src={frame.imageUrl}
              alt="Screenshot"
              fill
              draggable={false}
              style={{
                objectFit: "cover",
                width: "100%",
                height: "100%",
                aspectRatio: frameW / frameH,
                userSelect: "none",
              }}
              sizes="(max-width: 600px) 50vw, 300px"
              priority={index === priorityIndex}
            />
            {captions[startIndex + index] && (
              <div
                className="absolute bottom-0 left-0 right-0 flex items-center justify-center"
                style={{ paddingBottom: "4%" }}
              >
                <CaptionText
                  caption={captions[startIndex + index]}
                  fontSize={fontSize}
                  outlineWidth={outlineWidth}
                  fontFamily={fontFamily}
                  relaxedLineBreaks={relaxedLineBreaks}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div
      ref={rootRef}
      style={{
        display: "grid",
        width: "100%",
        maxWidth: `${maxWidth}px`,
        height: `${gridHeight}px`,
        gap: "4px", // Add spacing between rows
        backgroundColor: "black",
        aspectRatio: frameW / frameH,
        userSelect: "none",
      }}
    >
      <FrameRow frames={frames.slice(0, 2)} startIndex={0} priorityIndex={0} />
      <FrameRow frames={frames.slice(2, 4)} startIndex={2} priorityIndex={0} />
    </div>
  );
}
