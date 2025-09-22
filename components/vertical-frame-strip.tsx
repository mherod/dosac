"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import type React from "react";
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
}: FrameStripProps): React.ReactElement | null {
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

  if (!imageUrls?.length) {
    return null;
  }

  const margin = 8;
  const frameHeight = Math.round(frameWidth * (9 / 16));

  return (
    <div className="group relative mx-auto max-h-fit">
      <div
        style={{
          width: `${frameWidth + margin * 2}px`,
          height: `${frameHeight * imageUrls.length + margin * 2}px`,
        }}
      >
        <div className="scrollbar-custom m-auto snap-y snap-mandatory scroll-pb-[8px] scroll-pt-[8px] whitespace-nowrap">
          <div
            className="m-auto flex flex-col items-center justify-center"
            style={{
              height: `${frameHeight * imageUrls.length + margin * 2}px`,
              width: `${frameWidth + margin * 2}px`,
            }}
          >
            <div
              className="flex scroll-py-[8px] flex-col gap-2"
              style={{ width: `${frameWidth}px` }}
            >
              {imageUrls.filter(Boolean).map((imageUrl: string) => (
                <button
                  type="button"
                  key={imageUrl}
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
                    "group relative flex-shrink-0 cursor-pointer snap-start transition-all duration-200 hover:scale-105",
                    selectedImage === imageUrl
                      ? "z-10 scale-105 ring-2 ring-yellow-400/80"
                      : "ring-1 ring-white/10 hover:ring-white/30",
                  )}
                  style={{
                    width: `${frameWidth}px`,
                    height: `${frameHeight}px`,
                  }}
                >
                  {!loadedImages[imageUrl] && (
                    <div className="absolute inset-0 animate-pulse bg-gray-800" />
                  )}
                  <Image
                    src={imageUrl}
                    alt="Frame"
                    width={frameWidth}
                    height={frameHeight}
                    className={cn(
                      "object-cover transition-opacity duration-300",
                      !loadedImages[imageUrl] ? "opacity-0" : "opacity-100",
                    )}
                    onLoad={(): void =>
                      setLoadedImages((prev: Record<string, boolean>) => ({
                        ...prev,
                        [imageUrl]: true,
                      }))
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
