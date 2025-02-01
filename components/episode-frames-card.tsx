import Link from "next/link";
import { PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { ScreenshotGrid } from "@/components/screenshot-grid";
import type { Frame } from "@/lib/frames";

interface EpisodeFramesCardProps {
  /** The series number */
  seriesNumber: number;
  /** The episode number */
  episodeNumber: number;
  /** Array of frames for this episode */
  frames: Frame[];
  /** Optional className for styling */
  className?: string;
}

/**
 * Card component for displaying episode frames with navigation
 * @param props - The component props
 * @param props.seriesNumber - The series number
 * @param props.episodeNumber - The episode number
 * @param props.frames - Array of frames for this episode
 * @param props.className - Optional className for styling
 * @returns The episode frames card component
 */
export function EpisodeFramesCard({
  seriesNumber,
  episodeNumber,
  frames,
  className,
}: EpisodeFramesCardProps) {
  return (
    <Card
      className={cn(
        "group relative overflow-hidden rounded-xl p-6",
        "bg-gradient-to-b from-background to-background/80",
        "transition-all duration-300 ease-in-out",
        "hover:shadow-xl hover:shadow-primary/5",
        "hover:scale-[1.02] hover:-translate-y-0.5",
        "border border-border/50",
        className,
      )}
    >
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0",
          "group-hover:opacity-100 transition-opacity duration-500",
        )}
      />
      <div className="relative flex items-start justify-between mb-8">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight mb-2">
            Episode {episodeNumber}
          </h2>
          <p className="text-sm text-muted-foreground/80 font-medium">
            {frames.length} captions
          </p>
        </div>
        <Link
          href={`/series/${seriesNumber}/episode/${episodeNumber}`}
          className={cn(
            "inline-flex items-center gap-2 px-4 py-2",
            "text-sm font-medium text-primary",
            "rounded-lg bg-primary/5",
            "hover:bg-primary/10 hover:text-primary/90",
            "transition-all duration-300 ease-in-out",
            "group/link",
          )}
        >
          <span>View all</span>
          <PlayCircle
            className={cn(
              "h-4 w-4 transition-transform duration-300",
              "group-hover/link:translate-x-0.5",
            )}
          />
        </Link>
      </div>
      <div className="relative">
        <ScreenshotGrid screenshots={frames.slice(0, 6)} multiselect={true} />
      </div>
    </Card>
  );
}
