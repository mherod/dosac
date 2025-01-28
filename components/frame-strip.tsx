"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";
import React from "react";
import { type Screenshot } from "@/lib/types";
import { cn } from "@/lib/utils";

interface FrameStripProps {
  screenshots: Screenshot[];
  rankedMoments?: Screenshot[];
}

export function FrameStrip({ screenshots }: FrameStripProps) {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [hoverIndex, setHoverIndex] = React.useState<number | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragStartId, setDragStartId] = React.useState<string | null>(null);
  const [lastSelectedId, setLastSelectedId] = React.useState<string | null>(
    null,
  );
  const stripRef = React.useRef<HTMLDivElement>(null);

  // Calculate visible frames based on container width
  const FRAME_WIDTH = 160; // Width of each thumbnail
  const visibleFrames = Math.floor(
    (stripRef.current?.clientWidth || 0) / FRAME_WIDTH,
  );

  const handleFrameClick = (id: string, e: React.MouseEvent) => {
    let newSelectedIds = new Set(selectedIds);

    if (e.ctrlKey || e.metaKey) {
      // Toggle selection
      if (newSelectedIds.has(id)) {
        newSelectedIds.delete(id);
      } else {
        newSelectedIds.add(id);
      }
      setLastSelectedId(id);
    } else if (e.shiftKey && lastSelectedId) {
      // Range selection
      const lastIndex = screenshots.findIndex((s) => s.id === lastSelectedId);
      const currentIndex = screenshots.findIndex((s) => s.id === id);
      const start = Math.min(lastIndex, currentIndex);
      const end = Math.max(lastIndex, currentIndex);
      newSelectedIds = new Set(
        screenshots.slice(start, end + 1).map((s) => s.id),
      );
    } else {
      // Single click behavior
      if (selectedIds.has(id) && selectedIds.size > 1) {
        // If clicking an already selected frame with multiple selected,
        // keep existing selection but update URL
        updateUrl(selectedIds);
        return;
      }
      // Otherwise replace selection
      newSelectedIds = new Set([id]);
      setLastSelectedId(id);
    }

    setSelectedIds(newSelectedIds);
    updateUrl(newSelectedIds);
  };

  const updateUrl = (ids: Set<string>) => {
    if (ids.size === 0) {
      router.push(`/caption`);
      return;
    }

    const frames = Array.from(ids).slice(0, 4);
    const combinedText = frames
      .map((id) => screenshots.find((s) => s.id === id)?.speech)
      .filter(Boolean)
      .join("\n");

    const [first, second, ...rest] = frames;
    const basePath = second ? `${first}/${second}` : first;
    const compareIds = rest.length > 0 ? `?compare=${rest.join(",")}` : "";
    const textParam = combinedText
      ? `${compareIds ? "&" : "?"}text=${encodeURIComponent(combinedText)}`
      : "";

    router.push(`/caption/${basePath}${compareIds}${textParam}`);
  };

  const handleDragStart = (id: string) => {
    setIsDragging(true);
    setDragStartId(id);
  };

  const handleDragMove = (id: string) => {
    if (isDragging && dragStartId) {
      const startIndex = screenshots.findIndex((s) => s.id === dragStartId);
      const endIndex = screenshots.findIndex((s) => s.id === id);

      if (startIndex !== -1 && endIndex !== -1) {
        const start = Math.min(startIndex, endIndex);
        const end = Math.max(startIndex, endIndex);
        const selectedFrames = screenshots
          .slice(start, end + 1)
          .map((s) => s.id);
        setSelectedIds(new Set(selectedFrames));
      }
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDragStartId(null);
  };

  // Update selected frame display
  React.useEffect(() => {
    const selected = Array.from(selectedIds)
      .map((id) => screenshots.find((s) => s.id === id))
      .filter(Boolean);

    if (selected.length > 0) {
      // Update display logic if needed
    }
  }, [selectedIds, screenshots]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-lg p-4">
      <div className="max-w-7xl mx-auto space-y-2">
        {/* Controls */}
        <div className="flex items-center gap-4 px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePlayPause}
            className="text-white/90 hover:bg-white/10"
          >
            {isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5" />
            )}
          </Button>

          <div className="text-white/70 text-sm font-medium">
            {selectedIds.size > 0
              ? screenshots
                  .filter((s) => selectedIds.has(s.id))
                  .map((s) => s.timestamp)
                  .join(", ")
              : "00:00"}
          </div>
        </div>

        {/* Film strip container */}
        <div
          ref={stripRef}
          className="relative h-24 overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
        >
          {/* Film strip background */}
          <div className="absolute inset-0 bg-black/90" />

          {/* Continuous film strip */}
          <div className="relative flex py-1">
            {/* Sprocket holes - left */}
            <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col justify-between py-1 pointer-events-none">
              {[0, 1].map((i) => (
                <div
                  key={i}
                  className="h-3 w-3 rounded-sm bg-black/95 mx-auto"
                />
              ))}
            </div>

            {/* Frames */}
            <div className="flex ml-8 mr-8">
              {screenshots.map((screenshot, index) => (
                <button
                  key={screenshot.id}
                  onClick={(e) => handleFrameClick(screenshot.id, e)}
                  onMouseEnter={() => setHoverIndex(index)}
                  onMouseLeave={() => setHoverIndex(null)}
                  onMouseDown={() => handleDragStart(screenshot.id)}
                  onMouseMove={() => handleDragMove(screenshot.id)}
                  onMouseUp={handleDragEnd}
                  className={cn(
                    "group relative flex-shrink-0 w-32 h-[4.5rem] transition-all duration-200",
                    "border-x-2 border-black first:border-l-0 last:border-r-0",
                    selectedIds.has(screenshot.id) && "ring-2 ring-white/80",
                  )}
                  style={{
                    transformOrigin: "center center",
                  }}
                >
                  {/* Frame content */}
                  <div className="absolute inset-0 overflow-hidden">
                    <Image
                      src={screenshot.imageUrl}
                      alt={screenshot.speech}
                      width={128}
                      height={72}
                      className={cn(
                        "w-full h-full object-cover transition-transform duration-200",
                        "group-hover:scale-105",
                      )}
                      priority={index < visibleFrames}
                      quality={90}
                    />

                    {/* Glossy overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-50" />

                    {/* Frame info on hover */}
                    {hoverIndex === index && (
                      <div className="absolute inset-0 flex items-end">
                        <div className="w-full p-1 bg-gradient-to-t from-black/90 to-transparent">
                          <div className="text-white/90 text-[10px] font-medium truncate">
                            {screenshot.timestamp}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Sprocket holes - right */}
            <div className="absolute right-0 top-0 bottom-0 w-8 flex flex-col justify-between py-1 pointer-events-none">
              {[0, 1].map((i) => (
                <div
                  key={i}
                  className="h-3 w-3 rounded-sm bg-black/95 mx-auto"
                />
              ))}
            </div>
          </div>

          {/* Edge gradients */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-black to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-black to-transparent pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
