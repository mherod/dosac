import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

interface FrameStripProps {
  imageUrls: string[];
  selectedImage?: string;
  frameWidth?: number;
  onFrameSelect?: (imageUrl: string) => void;
  singleSelection?: boolean;
}

export function VerticalFrameStrip({
  imageUrls,
  selectedImage,
  frameWidth = 256,
  onFrameSelect,
  singleSelection = true,
}: FrameStripProps) {
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

  if (!imageUrls?.length) {
    return null;
  }

  const margin = 8;
  const frameHeight = Math.round(frameWidth * (9 / 16));

  return (
    <div className="relative max-h-fit mx-auto group">
      <div
        style={{
          width: `${frameWidth + margin * 2}px`,
          height: `${frameHeight * imageUrls.length + margin * 2}px`,
        }}
      >
        <div className="m-auto whitespace-nowrap scrollbar-custom snap-y snap-mandatory scroll-pt-[8px] scroll-pb-[8px]">
          <div
            className="flex flex-col items-center justify-center m-auto"
            style={{
              height: `${frameHeight * imageUrls.length + margin * 2}px`,
              width: `${frameWidth + margin * 2}px`,
            }}
          >
            <div
              className="flex flex-col gap-2 scroll-py-[8px]"
              style={{ width: `${frameWidth}px` }}
            >
              {imageUrls.filter(Boolean).map((imageUrl, index) => (
                <button
                  key={`${imageUrl}-${index}`}
                  onClick={() => {
                    if (singleSelection) {
                      onFrameSelect?.(imageUrl);
                    } else {
                      onFrameSelect?.(
                        selectedImage === imageUrl ? "" : imageUrl,
                      );
                    }
                  }}
                  className={cn(
                    "group relative flex-shrink-0 snap-start cursor-pointer transition-all duration-200 hover:scale-105",
                    selectedImage === imageUrl
                      ? "ring-2 ring-yellow-400/80 scale-105 z-10"
                      : "ring-1 ring-white/10 hover:ring-white/30",
                  )}
                  style={{
                    width: `${frameWidth}px`,
                    height: `${frameHeight}px`,
                  }}
                >
                  {!loadedImages[imageUrl] && (
                    <div className="absolute inset-0 bg-gray-800 animate-pulse" />
                  )}
                  <Image
                    src={imageUrl}
                    alt={`Frame ${index}`}
                    width={frameWidth}
                    height={frameHeight}
                    className={cn(
                      "object-cover transition-opacity duration-300",
                      !loadedImages[imageUrl] ? "opacity-0" : "opacity-100",
                    )}
                    onLoad={() =>
                      setLoadedImages((prev) => ({ ...prev, [imageUrl]: true }))
                    }
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
