"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, useEffect, type MouseEvent } from "react";
import { type Screenshot } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CaptionedImage } from "@/components/captioned-image";
import { useAutoAnimate } from "@formkit/auto-animate/react";

interface FrameStripProps {
  screenshots: Screenshot[];
  rankedMoments?: Screenshot[];
  centerScreenshot?: Screenshot;
  frameWidth?: number;
}

export function FrameStrip({
  screenshots,
  centerScreenshot,
  frameWidth = 256, // Default to 256px width (original size)
}: FrameStripProps) {
  // All Hooks must be called unconditionally first
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartId, setDragStartId] = useState<string | null>(null);
  const [lastSelectedId, setLastSelectedId] = useState<string | null>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const [framesParent] = useAutoAnimate<HTMLDivElement>({
    duration: 150,
    easing: "ease-in-out",
  });

  // Move useEffect before any conditional returns
  useEffect(() => {
    const selected = Array.from(selectedIds)
      .map((id) => screenshots.find((s) => s.id === id))
      .filter(Boolean);

    if (selected.length > 0) {
      // Update display logic if needed
    }
  }, [selectedIds, screenshots]);

  useEffect(() => {
    if (centerScreenshot && stripRef.current) {
      const index = screenshots.findIndex((s) => s.id === centerScreenshot.id);
      if (index === -1) return;

      // Calculate after layout with proper gap accounting
      requestAnimationFrame(() => {
        const container = stripRef.current;
        if (!container) return;

        const gap = 8; // Matches Tailwind's gap-2 (0.5rem = 8px)
        const frameCenter = index * (frameWidth + gap);
        const containerCenter = container.clientWidth / 2;
        const scrollPosition = frameCenter - containerCenter + frameWidth / 2;

        // Smooth scroll with CSS transition fallback
        if ("scrollBehavior" in document.documentElement.style) {
          container.scrollTo({
            left: scrollPosition,
            behavior: "smooth",
          });
        } else {
          container.style.transition = "scroll-left 0.5s ease-in-out";
          container.scrollLeft = scrollPosition;
          setTimeout(() => (container.style.transition = ""), 500);
        }
      });
    }
  }, [centerScreenshot, frameWidth, screenshots]);

  // Now place conditional return AFTER all Hooks
  if (!screenshots?.length) {
    return null;
  }

  // Calculate visible frames based on container width
  const visibleFrames = Math.floor(
    (stripRef.current?.clientWidth || 0) / frameWidth,
  );

  const handleFrameClick = (id: string, e: MouseEvent) => {
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
      router.push(`/caption`, { scroll: false });
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

    router.push(`/caption/${basePath}${compareIds}${textParam}`, {
      scroll: false,
    });
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

  const margin = 10;
  const frameHeight = Math.round(frameWidth * (9 / 16));

  return (
    <div className="relative bg-black/95 backdrop-blur-lg p-2 rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.3)] max-w-screen overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Yellow border frame */}
        <div
          className="relative rounded-xl overflow-hidden shadow-[inset_0_0_30px_rgba(0,0,0,0.2)]"
          style={{ height: `${frameHeight + margin}px` }}
        >
          <div
            ref={stripRef}
            className="relative overflow-x-scroll overflow-y-hidden whitespace-nowrap scrollbar-custom snap-x snap-mandatory scroll-pl-[8px] scroll-pr-[8px]"
          >
            {/* Frames */}
            <div
              ref={framesParent}
              className="flex gap-[1px] p-1 min-w-full items-center justify-center"
              style={{
                width: `${frameWidth * screenshots.length}px`,
                height: `${frameHeight + margin}px`,
              }}
            >
              <div
                className="flex gap-2 scroll-px-[8px]"
                style={{ height: `${frameHeight}px` }}
              >
                {screenshots.map((screenshot, index) => (
                  <button
                    key={screenshot.id}
                    onClick={(e) =>
                      handleFrameClick(screenshot.id, e as MouseEvent)
                    }
                    onMouseEnter={() => setHoverIndex(index)}
                    onMouseLeave={() => setHoverIndex(null)}
                    onMouseDown={() => handleDragStart(screenshot.id)}
                    onMouseMove={() => handleDragMove(screenshot.id)}
                    onMouseUp={handleDragEnd}
                    className={cn(
                      "group relative flex-shrink-0 transition-all duration-150 snap-start",
                      centerScreenshot?.id === screenshot.id &&
                        "ring-2 ring-yellow-400/80",
                      selectedIds.has(screenshot.id) &&
                        "ring-4 ring-yellow-400/90",
                    )}
                    style={{
                      width: `${frameWidth}px`,
                      height: `${frameHeight}px`,
                    }}
                  >
                    <CaptionedImage
                      imageUrl={screenshot.imageUrl}
                      image2Url={screenshot.image2Url}
                      caption={screenshot.speech}
                      fontSize={28}
                      outlineWidth={1}
                      maintainAspectRatio
                      priority={index < visibleFrames}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Edge fades - now using sticky positioning */}
            <div
              className="sticky left-0 top-0 bottom-0 w-8 h-full bg-gradient-to-r from-black to-transparent pointer-events-none"
              style={{ position: "sticky" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
