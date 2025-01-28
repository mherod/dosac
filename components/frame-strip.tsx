"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { type Screenshot } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CaptionedImage } from "@/components/captioned-image";
import { useAutoAnimate } from "@formkit/auto-animate/react";

interface FrameStripProps {
  screenshots: Screenshot[];
  rankedMoments?: Screenshot[];
}

export function FrameStrip({ screenshots }: FrameStripProps) {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  const [hoverIndex, setHoverIndex] = React.useState<number | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragStartId, setDragStartId] = React.useState<string | null>(null);
  const [lastSelectedId, setLastSelectedId] = React.useState<string | null>(
    null,
  );
  const stripRef = React.useRef<HTMLDivElement>(null);
  const [framesParent] = useAutoAnimate<HTMLDivElement>({
    duration: 150,
    easing: "ease-in-out",
  });

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

  return (
    <div className="relative bg-black/95 backdrop-blur-lg p-2 rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.3)]">
      <div className="max-w-7xl mx-auto">
        {/* Yellow border frame */}
        <div className="relative rounded-xl overflow-hidden shadow-[inset_0_0_30px_rgba(0,0,0,0.2)]">
          {/* Yellow border */}
          <div className="absolute inset-0 border-[5px] border-yellow-400/90 rounded-xl pointer-events-none" />

          <div
            ref={stripRef}
            className="relative h-40 overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
          >
            {/* Solid dark background */}
            <div className="absolute inset-0 bg-black/90" />

            {/* Frames */}
            <div ref={framesParent} className="flex gap-[1px] p-1">
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
                    "group relative flex-shrink-0 w-64 h-36 transition-all duration-150",
                    selectedIds.has(screenshot.id) &&
                      "ring-4 ring-yellow-400/90",
                  )}
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

            {/* Edge fades */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black to-transparent pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-black to-transparent pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
}
