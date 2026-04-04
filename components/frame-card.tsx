"use client";

import { Check } from "lucide-react";
import type React from "react";
import { FrameCardContent } from "@/components/frame-card-content";
import { formatEpisodeId, formatTimestamp } from "@/lib/utils";
import type { Screenshot } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Props for the FrameCard component
 */
interface FrameCardProps {
  /** Screenshot data to display in the card */
  screenshot: Screenshot;
  /** Whether to prioritize loading this frame's image */
  priority?: boolean;
  /** Whether this frame is currently selected */
  isSelected?: boolean;
  /** Callback when the frame is selected with modifier keys */
  onSelect?: (e: React.MouseEvent | React.KeyboardEvent) => void;
  /** Callback when drag interaction starts */
  onDragStart?: () => void;
  /** Callback when drag interaction moves */
  onDragMove?: () => void;
  /** Callback when touch interaction starts */
  onTouchStart?: () => void;
  /** Callback when touch interaction moves */
  onTouchMove?: () => void;
  /** Callback when touch interaction ends */
  onTouchEnd?: () => void;
}

/**
 * Client wrapper that adds interactive behavior (selection, drag, touch)
 * around server-rendered FrameCardContent
 * @param props - The component props
 * @returns An interactive card component displaying the frame and its metadata
 */
export function FrameCard({
  screenshot,
  priority = false,
  isSelected = false,
  onSelect,
  onDragStart,
  onDragMove,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
}: FrameCardProps): React.ReactElement {
  const handleClick = (e: React.MouseEvent): void => {
    if (e.ctrlKey || e.metaKey || e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();
      onSelect?.(e);
    }
  };

  const handleSelectClick = (e: React.MouseEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    onSelect?.(e);
  };

  const handleMouseDown = (e: React.MouseEvent): void => {
    if (e.button === 0) {
      e.preventDefault();
      e.stopPropagation();
      onDragStart?.();
    }
  };

  const handleMouseEnter = (e: React.MouseEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    onDragMove?.();
  };

  const handleTouchStart = (e: React.TouchEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    onTouchStart?.();
  };

  const handleTouchMove = (e: React.TouchEvent): void => {
    e.preventDefault();
    e.stopPropagation();

    const touch = e.touches[0];
    if (!touch) return;

    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    if (!element) return;

    const frameCard = element.closest("[data-frame-card]");
    if (frameCard) {
      onTouchMove?.();
    }
  };

  const handleTouchEnd = (e: React.TouchEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    onTouchEnd?.();
  };

  const episodeLabel = formatEpisodeId(screenshot.episode);
  const timestampLabel = formatTimestamp(screenshot.timestamp);
  const cardLabel = `${screenshot.speech || "Frame"} from ${episodeLabel} at ${timestampLabel}`;

  return (
    <article
      suppressHydrationWarning
      data-frame-card
      className={cn(
        "group relative block transform touch-none select-none transition-transform duration-300 hover:scale-[1.02]",
        isSelected && "z-10 rounded-lg ring-2 ring-primary ring-offset-2",
      )}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (onSelect) {
            onSelect(e);
          }
        }
      }}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      tabIndex={onSelect ? 0 : -1}
      aria-label={cardLabel}
      aria-selected={onSelect ? isSelected : undefined}
    >
      <FrameCardContent screenshot={screenshot} priority={priority} />

      {/* Selection button */}
      {onSelect && (
        <button
          type="button"
          onClick={handleSelectClick}
          aria-label={
            isSelected ? `Deselect ${cardLabel}` : `Select ${cardLabel}`
          }
          aria-pressed={isSelected}
          className={cn(
            "absolute right-2 top-2 z-10 rounded-full p-1.5 transition-all",
            isSelected
              ? "bg-primary text-primary-foreground"
              : "bg-background/80 opacity-0 backdrop-blur-sm group-hover:opacity-100",
          )}
        >
          <Check className="h-4 w-4" aria-hidden="true" />
          <span className="sr-only">
            {isSelected ? "Selected" : "Not selected"}
          </span>
        </button>
      )}
    </article>
  );
}
