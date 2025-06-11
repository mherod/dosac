"use client";

import { CaptionedImage } from "@/components/captioned-image";
import type { Frame } from "@/lib/frames";

interface FrameStackProps {
  frames: Frame[];
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
}: FrameStackProps): React.ReactElement {
  return (
    <div
      className="m-auto flex h-full min-h-96 flex-col"
      style={{
        aspectRatio: 16 / (9 * frames.length),
        maxHeight: `${900}px`,
      }}
    >
      {frames.map((frame: Frame, index: number) => (
        <div key={frame.id} className="flex-1">
          <CaptionedImage
            imageUrl={frame.imageUrl}
            image2Url={frame.image2Url}
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
