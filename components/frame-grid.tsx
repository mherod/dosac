"use client";

import Image from "next/image";

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

interface FrameGridProps {
  frames: Screenshot[];
  captions: string[];
  fontSize: number;
  outlineWidth: number;
  fontFamily: string;
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

export function FrameGrid({
  frames,
  captions,
  fontSize,
  outlineWidth,
  fontFamily,
}: FrameGridProps) {
  return (
    <div className="grid h-fit" style={{ gridTemplateRows: "1fr 1fr" }}>
      <div
        className="grid w-full h-fit aspect-video"
        style={{ gridTemplateColumns: "1fr 1fr" }}
      >
        {frames.slice(0, 2).map((frame, index) => (
          <div key={frame.id} className="relative w-full h-full max-h-[400px]">
            <Image
              src={frame.blankImageUrl}
              alt="Screenshot"
              fill
              className="object-cover"
              sizes="50vw"
              priority={index === 0}
            />
            {captions[index] && (
              <div className="absolute inset-0 flex items-end justify-center pb-[4%]">
                <div
                  style={{
                    fontSize: `${fontSize}px`,
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
                  {captions[index]
                    ?.split("\n")
                    .map((line, i) => <p key={i}>{line}</p>)}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div
        className="grid w-full h-fit aspect-video"
        style={{ gridTemplateColumns: "1fr 1fr" }}
      >
        {frames.slice(2, 4).map((frame, index) => (
          <div key={frame.id} className="relative w-full h-full max-h-[400px]">
            <Image
              src={frame.blankImageUrl}
              alt="Screenshot"
              fill
              className="object-cover"
              sizes="50vw"
              priority={index === 0}
            />
            {captions[index + 2] && (
              <div className="absolute inset-0 flex items-end justify-center pb-[4%]">
                <div
                  style={{
                    fontSize: `${fontSize}px`,
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
                  {captions[index + 2]
                    ?.split("\n")
                    .map((line, i) => <p key={i}>{line}</p>)}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
