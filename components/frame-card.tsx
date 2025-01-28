import { Card } from "@/components/ui/card";
import { Clapperboard, Clock, Check } from "lucide-react";
import { CaptionedImage } from "@/components/captioned-image";
import { cn } from "@/lib/utils";
import { type Screenshot } from "@/lib/types";

function formatEpisodeString(episodeId: string): string {
  // Format from "s01e02" to "S1 E2"
  const match = episodeId.match(/^s(\d{2})e(\d{2})$/i);
  if (!match || !match[1] || !match[2]) return episodeId;

  return `S${parseInt(match[1])} E${parseInt(match[2])}`;
}

function formatTimestamp(timestamp: string): string {
  // Format from "00-03.120" to "0:03"
  const match = timestamp.match(/^(\d{2})-(\d{2})\.\d{3}$/);
  if (!match || !match[1] || !match[2]) return timestamp;

  const minutes = parseInt(match[1]);
  const seconds = parseInt(match[2]);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

interface FrameCardProps {
  screenshot: Screenshot;
  priority?: boolean;
  isSelected?: boolean;
  onSelect?: (e: React.MouseEvent) => void;
  onDragStart?: () => void;
  onDragMove?: () => void;
  onTouchStart?: () => void;
  onTouchMove?: () => void;
  onTouchEnd?: () => void;
}

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
}: FrameCardProps) {
  const handleClick = (e: React.MouseEvent) => {
    // Only handle selection if using modifier keys
    if (e.ctrlKey || e.metaKey || e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();
      onSelect?.(e);
    }
    // Otherwise let the link handle it
  };

  const handleSelectClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSelect?.(e);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      // Left click only
      e.preventDefault();
      e.stopPropagation();
      onDragStart?.();
    }
  };

  const handleMouseEnter = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDragMove?.();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onTouchStart?.();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Get the touch point coordinates
    const touch = e.touches[0];
    if (!touch) return;

    // Get the element under the touch point
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    if (!element) return;

    // Find the closest FrameCard parent
    const frameCard = element.closest("[data-frame-card]");
    if (frameCard) {
      onTouchMove?.();
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onTouchEnd?.();
  };

  return (
    <div
      suppressHydrationWarning
      data-frame-card
      className={cn(
        "group block select-none touch-none relative transform transition-transform duration-300 hover:scale-[1.02]",
        isSelected && "ring-2 ring-primary ring-offset-2 rounded-lg z-10",
      )}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <Card className="overflow-hidden relative bg-black/5 dark:bg-white/5 shadow-[0_10px_50px_rgba(0,0,0,0.25)] dark:shadow-[0_10px_50px_rgba(0,0,0,0.5)] hover:shadow-[0_20px_80px_rgba(0,0,0,0.3)] dark:hover:shadow-[0_20px_80px_rgba(0,0,0,0.6)] transition-all duration-300">
        <div className="relative rounded-lg overflow-hidden">
          {/* Main glass reflection */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-transparent pointer-events-none" />

          {/* Diagonal shimmer effect */}
          <div className="absolute -inset-full bg-gradient-to-tr from-transparent via-white/[0.1] to-transparent translate-x-[100%] translate-y-[100%] transition-transform duration-1000 ease-in-out group-hover:translate-x-[-50%] group-hover:translate-y-[-50%] pointer-events-none transform-gpu" />

          {/* Top edge reflection */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

          {/* Corner reflection */}
          <div className="absolute top-0 left-0 w-[100px] h-[100px] bg-gradient-to-br from-white/[0.15] to-transparent rounded-br-full opacity-50 pointer-events-none" />

          <CaptionedImage
            imageUrl={screenshot.imageUrl}
            image2Url={screenshot.image2Url}
            caption={screenshot.speech}
            priority={priority}
            maintainAspectRatio={true}
          />

          {/* Info chips positioned at the top */}
          <div
            suppressHydrationWarning
            className="absolute top-2 left-2 right-2 flex flex-wrap gap-1.5 text-[10px] sm:text-xs opacity-75 transition-opacity duration-300 group-hover:opacity-100"
          >
            <div className="flex items-center space-x-1 rounded-full bg-background/70 shadow-sm backdrop-blur-[2px] px-1.5 sm:px-2 py-0.5 transition-all duration-300 group-hover:bg-background/90 group-hover:backdrop-blur-sm">
              <Clapperboard className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
              <span className="font-medium">
                {formatEpisodeString(screenshot.episode)}
              </span>
            </div>
            <div className="flex items-center space-x-1 rounded-full bg-background/70 shadow-sm backdrop-blur-[2px] px-1.5 sm:px-2 py-0.5 transition-all duration-300 group-hover:bg-background/90 group-hover:backdrop-blur-sm">
              <Clock className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
              <span className="font-medium">
                {formatTimestamp(screenshot.timestamp)}
              </span>
            </div>
          </div>

          {/* Selection button */}
          {onSelect && (
            <button
              onClick={handleSelectClick}
              className={cn(
                "absolute right-2 top-2 rounded-full p-1.5 transition-all",
                isSelected
                  ? "bg-primary text-primary-foreground"
                  : "bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100",
              )}
            >
              <Check className="h-4 w-4" />
            </button>
          )}
        </div>
      </Card>
    </div>
  );
}
