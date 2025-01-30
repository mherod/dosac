import { cn } from "@/lib/utils";
import Image from "next/image";

interface FrameStripProps {
  imageUrls: string[];
  centerImageUrl?: string;
  frameWidth?: number;
  onFrameSelect?: (imageUrl: string) => void;
}

export function VerticalFrameStrip({
  imageUrls,
  centerImageUrl,
  frameWidth = 256,
  onFrameSelect,
}: FrameStripProps) {
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
              {imageUrls.map((imageUrl, index) => (
                <button
                  key={imageUrl}
                  onClick={() => onFrameSelect?.(imageUrl)}
                  className={cn(
                    "group relative flex-shrink-0 snap-start cursor-pointer transition-all duration-200 hover:scale-105",
                    centerImageUrl === imageUrl
                      ? "ring-2 ring-yellow-400/80 scale-105 z-10"
                      : "ring-1 ring-white/10 hover:ring-white/30",
                  )}
                  style={{
                    width: `${frameWidth}px`,
                    height: `${frameHeight}px`,
                  }}
                >
                  <Image
                    src={imageUrl}
                    alt={`Frame ${index}`}
                    width={frameWidth}
                    height={frameHeight}
                    className="object-cover"
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
