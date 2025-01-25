"use client";

import { CaptionedImage } from "@/components/captioned-image";
import { type Screenshot } from "@/lib/types";

interface FrameStackProps {
  frames: Screenshot[];
  captions: string[];
  fontSize: number;
  outlineWidth: number;
  fontFamily: string;
}

export function FrameStack({
  frames,
  captions,
  fontSize,
  outlineWidth,
  fontFamily,
}: FrameStackProps) {
  return (
    <div className="flex flex-col h-full">
      {frames.map((frame, index) => (
        <div key={frame.id} className="flex-1">
          <CaptionedImage
            imageUrl={frame.blankImageUrl}
            caption={captions[index]}
            fontSize={fontSize}
            outlineWidth={outlineWidth}
            fontFamily={fontFamily}
            maintainAspectRatio={true}
          />
        </div>
      ))}
    </div>
  );
}
