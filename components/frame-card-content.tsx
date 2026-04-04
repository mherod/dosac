import { Clapperboard, Clock } from "lucide-react";
import { CaptionedImage } from "@/components/captioned-image";
import { Card } from "@/components/ui/card";
import { getCharacterBlurPlaceholder } from "@/lib/character-colors";
import type { Screenshot } from "@/lib/types";
import { formatEpisodeId, formatTimestamp } from "@/lib/utils";

/**
 * Props for the FrameCardContent component
 */
interface FrameCardContentProps {
  /** Screenshot data to display in the card */
  screenshot: Screenshot;
  /** Whether to prioritize loading this frame's image */
  priority?: boolean;
}

/**
 * Server-renderable content for a frame card
 * Contains the visual card layout: image, reflections, metadata chips
 * Interactive behavior is handled by the parent FrameCard client wrapper
 */
export function FrameCardContent({
  screenshot,
  priority = false,
}: FrameCardContentProps): React.ReactElement {
  return (
    <Card className="relative overflow-hidden bg-black/5 shadow-[0_10px_50px_rgba(0,0,0,0.25)] transition-all duration-300 hover:shadow-[0_20px_80px_rgba(0,0,0,0.3)] dark:bg-white/5 dark:shadow-[0_10px_50px_rgba(0,0,0,0.5)] dark:hover:shadow-[0_20px_80px_rgba(0,0,0,0.6)]">
      <div className="relative overflow-hidden rounded-lg">
        {/* Main glass reflection */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-transparent" />

        {/* Diagonal shimmer effect */}
        <div className="pointer-events-none absolute -inset-full translate-x-[100%] translate-y-[100%] transform-gpu bg-gradient-to-tr from-transparent via-white/[0.1] to-transparent transition-transform duration-1000 ease-in-out group-hover:translate-x-[-50%] group-hover:translate-y-[-50%]" />

        {/* Top edge reflection */}
        <div className="pointer-events-none absolute left-0 right-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        {/* Corner reflection */}
        <div className="pointer-events-none absolute left-0 top-0 h-[100px] w-[100px] rounded-br-full bg-gradient-to-br from-white/[0.15] to-transparent opacity-50" />

        <CaptionedImage
          imageUrl={screenshot.imageUrl}
          image2Url={screenshot.image2Url}
          caption={screenshot.speech}
          priority={priority}
          maintainAspectRatio={true}
          blurDataURL={getCharacterBlurPlaceholder(screenshot.character)}
        />

        {/* Info chips positioned at the top */}
        <div
          suppressHydrationWarning
          className="absolute left-2 right-2 top-2 flex flex-wrap gap-1.5 text-[10px] opacity-75 transition-opacity duration-300 group-hover:opacity-100 sm:text-xs"
        >
          <div className="flex items-center space-x-1 rounded-full bg-background/70 px-1.5 py-0.5 shadow-sm backdrop-blur-[2px] transition-all duration-300 group-hover:bg-background/90 group-hover:backdrop-blur-sm sm:px-2">
            <Clapperboard className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
            <span className="font-medium">
              {formatEpisodeId(screenshot.episode)}
            </span>
          </div>
          <div className="flex items-center space-x-1 rounded-full bg-background/70 px-1.5 py-0.5 shadow-sm backdrop-blur-[2px] transition-all duration-300 group-hover:bg-background/90 group-hover:backdrop-blur-sm sm:px-2">
            <Clock className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
            <span className="font-medium">
              {formatTimestamp(screenshot.timestamp)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
