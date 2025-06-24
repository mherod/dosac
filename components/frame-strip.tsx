"use client";

import { CaptionedImage } from "@/components/captioned-image";
import type { Screenshot } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type React from "react";

/**
 * Props for the FrameStrip component
 */
interface FrameStripProps {
  /** Array of screenshots to display in the strip */
  screenshots: Screenshot[];
  /** Optional array of ranked moments to highlight */
  rankedMoments?: Screenshot[];
  /** Screenshot to center in the strip */
  centerScreenshot?: Screenshot;
  /** Width of each frame in pixels (defaults to 256) */
  frameWidth?: number;
}

/**
 * Component that displays a horizontal strip of frame screenshots with animation
 * @param props - The component props
 * @param props.screenshots - Array of screenshots to display in the strip
 * @param props.centerScreenshot - Screenshot to center in the strip
 * @param props.frameWidth - Width of each frame in pixels
 * @returns An animated horizontal strip of frame screenshots
 */
export function FrameStrip({
  screenshots,
  centerScreenshot,
  frameWidth = 256, // Default to 256px width (original size)
}: FrameStripProps): React.ReactElement | null {
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
      .map((id: string) => screenshots.find((s: Screenshot) => s.id === id))
      .filter((s: Screenshot | undefined): s is Screenshot => Boolean(s));

    if (selected.length > 0) {
      // Update display logic if needed
    }
  }, [selectedIds, screenshots]);

  useEffect(() => {
    if (centerScreenshot && stripRef.current) {
      const index = screenshots.findIndex(
        (s: Screenshot) => s.id === centerScreenshot.id,
      );
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

  const handleFrameClick = (id: string, e: React.MouseEvent): void => {
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
      const lastIndex = screenshots.findIndex(
        (s: Screenshot) => s.id === lastSelectedId,
      );
      const currentIndex = screenshots.findIndex(
        (s: Screenshot) => s.id === id,
      );
      const start = Math.min(lastIndex, currentIndex);
      const end = Math.max(lastIndex, currentIndex);
      newSelectedIds = new Set(
        screenshots.slice(start, end + 1).map((s: Screenshot) => s.id),
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

  const updateUrl = (ids: Set<string>): void => {
    if (ids.size === 0) {
      router.push("/caption", { scroll: false });
      return;
    }

    const frames = Array.from(ids).slice(0, 4);
    const combinedText = frames
      .map(
        (id: string) =>
          screenshots.find((s: Screenshot) => s.id === id)?.speech,
      )
      .filter((speech: string | undefined): speech is string => Boolean(speech))
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

  const handleDragStart = (id: string): void => {
    setIsDragging(true);
    setDragStartId(id);
  };

  const handleDragMove = (id: string): void => {
    if (isDragging && dragStartId) {
      const startIndex = screenshots.findIndex(
        (s: Screenshot) => s.id === dragStartId,
      );
      const endIndex = screenshots.findIndex((s: Screenshot) => s.id === id);

      if (startIndex !== -1 && endIndex !== -1) {
        const start = Math.min(startIndex, endIndex);
        const end = Math.max(startIndex, endIndex);
        const selectedFrames = screenshots
          .slice(start, end + 1)
          .map((s: Screenshot) => s.id);
        setSelectedIds(new Set(selectedFrames));
      }
    }
  };

  const handleDragEnd = (): void => {
    setIsDragging(false);
    setDragStartId(null);
  };

  const margin = 10;
  const frameHeight = Math.round(frameWidth * (9 / 16));

  return (
    <div
      className="max-w-screen relative overflow-x-hidden rounded-2xl bg-black/95 p-2 shadow-[0_0_15px_rgba(0,0,0,0.3)] backdrop-blur-lg"
      role="region"
      aria-label="Frame selection strip"
    >
      <div className="mx-auto max-w-7xl">
        {/* Yellow border frame */}
        <motion.div
          className="relative rounded-xl shadow-[inset_0_0_30px_rgba(0,0,0,0.2)]"
          style={{ height: `${frameHeight + margin}px` }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div
            ref={stripRef}
            className="scrollbar-custom relative snap-x snap-mandatory scroll-pl-[8px] scroll-pr-[8px] overflow-x-scroll whitespace-nowrap"
            role="tablist"
            aria-label="Video frames"
          >
            {/* Frames */}
            <div
              ref={framesParent}
              className="flex min-w-full items-center justify-center gap-[1px] p-1"
              style={{
                width: `${frameWidth * screenshots.length}px`,
                height: `${frameHeight + margin}px`,
              }}
            >
              <div
                className="flex scroll-px-[8px] gap-2"
                style={{ height: `${frameHeight}px` }}
              >
                <AnimatePresence>
                  {screenshots.map((screenshot: Screenshot, index: number) => (
                    <motion.button
                      key={`frame-${screenshot.id}-${index}`}
                      onClick={(e: React.MouseEvent) =>
                        handleFrameClick(screenshot.id, e)
                      }
                      onMouseEnter={() => setHoverIndex(index)}
                      onMouseLeave={() => setHoverIndex(null)}
                      onMouseDown={() => handleDragStart(screenshot.id)}
                      onMouseMove={() => handleDragMove(screenshot.id)}
                      onMouseUp={handleDragEnd}
                      className={cn(
                        "group relative z-10 flex-shrink-0 snap-start focus:outline-none focus:ring-2 focus:ring-yellow-400",
                        centerScreenshot?.id === screenshot.id &&
                          "ring-2 ring-yellow-400/80",
                        selectedIds.has(screenshot.id) &&
                          "ring-4 ring-yellow-400/90",
                      )}
                      style={{
                        width: `${frameWidth}px`,
                        height: `${frameHeight}px`,
                        transformOrigin: "center center",
                      }}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        y: hoverIndex === index ? -2 : 0,
                      }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      whileHover={{
                        scale: 1.01,
                        y: -2,
                        transition: { duration: 0.2 },
                      }}
                      whileTap={{ scale: 0.99 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
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
                    </motion.button>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Edge fades - now using sticky positioning with motion */}
            <motion.div
              className="pointer-events-none sticky bottom-0 left-0 top-0 h-full w-8 bg-gradient-to-r from-black to-transparent"
              style={{ position: "sticky" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
