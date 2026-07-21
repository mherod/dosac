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
  /** Destination for opening the caption editor. */
  href: string;
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
}

/**
 * Client wrapper that adds interactive behavior (selection, drag, touch)
 * around server-rendered FrameCardContent
 * @param props - The component props
 * @returns An interactive card component displaying the frame and its metadata
 */
export function FrameCard({
  screenshot,
  href,
  priority = false,
  isSelected = false,
  onSelect,
  onDragStart,
  onDragMove,
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

  const episodeLabel = formatEpisodeId(screenshot.episode);
  const timestampLabel = formatTimestamp(screenshot.timestamp);
  const cardLabel = `${screenshot.speech || "Frame"} from ${episodeLabel} at ${timestampLabel}`;

  return (
    <article
      suppressHydrationWarning
      data-frame-card
      className={cn(
        "group relative block transform select-none transition-[transform,box-shadow] duration-150 motion-reduce:transform-none motion-reduce:transition-none [@media(hover:hover)]:hover:scale-[1.015]",
        isSelected && "z-10 rounded-lg ring-2 ring-primary ring-offset-2",
      )}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
    >
      <a
        href={href}
        onClick={handleClick}
        aria-label={cardLabel}
        className="block touch-manipulation rounded-lg [-webkit-tap-highlight-color:transparent] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 active:opacity-90"
      >
        <FrameCardContent screenshot={screenshot} priority={priority} />
      </a>

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
            "absolute right-1 top-1 z-10 flex min-h-11 min-w-11 touch-manipulation select-none items-center justify-center rounded-full transition-[color,background-color,opacity,box-shadow,transform] duration-150 [-webkit-tap-highlight-color:transparent] focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 active:scale-95 motion-reduce:transform-none motion-reduce:transition-none sm:right-2 sm:top-2",
            isSelected
              ? "bg-primary text-primary-foreground"
              : "bg-background/85 opacity-0 shadow-sm backdrop-blur-sm group-focus-within:opacity-100 [@media(hover:hover)]:group-hover:opacity-100 [@media(pointer:coarse)]:opacity-100",
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
