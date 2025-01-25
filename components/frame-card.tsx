import { Card } from "@/components/ui/card";
import { Clapperboard, Clock, Check } from "lucide-react";
import { CaptionedImage } from "@/components/captioned-image";
import { cn } from "@/lib/utils";

function formatEpisodeString(episodeId: string): string {
  // Format from "s01e02" to "Series 1 Episode 2"
  const match = episodeId.match(/^s(\d{2})e(\d{2})$/i);
  if (!match || !match[1] || !match[2]) return episodeId;

  return `Series ${parseInt(match[1])} Episode ${parseInt(match[2])}`;
}

function formatTimestamp(timestamp: string): string {
  // Format from "00-03.120" to "0:03"
  const match = timestamp.match(/^(\d{2})-(\d{2})\.\d{3}$/);
  if (!match || !match[1] || !match[2]) return timestamp;

  const minutes = parseInt(match[1]);
  const seconds = parseInt(match[2]);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

type Screenshot = {
  id: string;
  imageUrl: string;
  blankImageUrl: string;
  timestamp: string;
  subtitle: string;
  speech: string;
  episode: string;
};

interface FrameCardProps {
  screenshot: Screenshot;
  priority?: boolean;
  isSelected?: boolean;
  onSelect?: (e: React.MouseEvent) => void;
  onDragStart?: () => void;
  onDragMove?: () => void;
}

export function FrameCard({
  screenshot,
  priority = false,
  isSelected = false,
  onSelect,
  onDragStart,
  onDragMove,
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

  return (
    <div
      className={cn(
        "group block select-none",
        isSelected && "ring-2 ring-primary ring-offset-2 rounded-lg",
      )}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
    >
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg dark:hover:shadow-primary/5">
        <div className="relative">
          <CaptionedImage
            imageUrl={screenshot.blankImageUrl}
            caption={screenshot.speech}
            priority={priority}
            maintainAspectRatio={true}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          {onSelect && (
            <button
              onClick={handleSelectClick}
              className={cn(
                "absolute right-2 top-2 rounded-full p-1.5 transition-all",
                isSelected
                  ? "bg-primary text-primary-foreground"
                  : "bg-background/80 opacity-0 group-hover:opacity-100",
              )}
            >
              <Check className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="p-5">
          <div className="flex flex-col space-y-3">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2 rounded-full bg-primary/10 px-3 py-1">
                <Clapperboard className="h-3.5 w-3.5" />
                <span className="font-medium">
                  {formatEpisodeString(screenshot.episode)}
                </span>
              </div>
              <div className="flex items-center space-x-2 rounded-full bg-primary/10 px-3 py-1">
                <Clock className="h-3.5 w-3.5" />
                <span className="font-medium">
                  {formatTimestamp(screenshot.timestamp)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
