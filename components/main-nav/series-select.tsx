"use client";

import { useRouter } from "next/navigation";
import type React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

/**
 * Props for the SeriesSelect component
 * @interface SeriesSelectProps
 */
interface SeriesSelectProps {
  /** Currently selected season number (1-4) or undefined for all seasons */
  season?: number;
  /** Currently selected episode number (1-3) or undefined for all episodes */
  episode?: number;
  /** Callback fired when season or episode selection changes */
  onFilterChange: (updates: { season?: number; episode?: number }) => void;
  /** Additional CSS classes to apply to the container */
  className?: string;
  /** When true, uses filter callbacks instead of navigation */
  isSearchMode?: boolean;
}

/**
 * A dual select component for choosing series and episode numbers
 * @component
 * @param props - Component props
 * @param props.season - Currently selected season number
 * @param props.episode - Currently selected episode number
 * @param props.onFilterChange - Callback when selection changes
 * @param props.className - Additional CSS classes
 * @param props.isSearchMode - Whether to use filter mode instead of navigation
 * @returns A component with two select dropdowns for series and episode selection
 *
 * @example
 * // Navigation mode (default)
 * <SeriesSelect
 *   season={1}
 *   episode={2}
 *   onFilterChange={(updates) => console.log(updates)}
 * />
 *
 * @example
 * // Search/filter mode
 * <SeriesSelect
 *   season={1}
 *   episode={2}
 *   onFilterChange={handleFilterChange}
 *   isSearchMode={true}
 * />
 */
export function SeriesSelect({
  season,
  episode,
  onFilterChange,
  className = "",
  isSearchMode = false,
}: SeriesSelectProps): React.ReactElement {
  const router = useRouter();

  /**
   * Handles changes to the series selection
   * @param value - The new series value
   */
  const handleSeriesChange = (value: string): void => {
    const newSeason = value !== "all" ? Number.parseInt(value, 10) : undefined;

    if (isSearchMode) {
      // In search mode, use filter change callback
      onFilterChange({
        season: newSeason,
        episode: newSeason ? episode : undefined,
      });
    } else {
      // In navigation mode, navigate to the appropriate route
      if (value === "all") {
        router.push("/series", { scroll: false });
      } else {
        router.push(`/series/${value}`, { scroll: false });
      }
    }
  };

  /**
   * Handles changes to the episode selection
   * @param value - The new episode value
   */
  const handleEpisodeChange = (value: string): void => {
    const newEpisode = value !== "all" ? Number.parseInt(value, 10) : undefined;

    if (isSearchMode) {
      // In search mode, use filter change callback
      onFilterChange({
        season,
        episode: newEpisode,
      });
    } else {
      // In navigation mode, navigate to the appropriate route
      if (value === "all") {
        router.push(season ? `/series/${season}` : "/series", {
          scroll: false,
        });
      } else {
        router.push(`/series/${season}/episode/${value}`, { scroll: false });
      }
    }
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Select
        value={season?.toString() ?? "all"}
        onValueChange={handleSeriesChange}
      >
        <SelectTrigger className="w-[100px] truncate">
          <SelectValue placeholder="All Series" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Series</SelectItem>
          {[1, 2, 3, 4].map((s: number) => (
            <SelectItem key={s} value={s.toString()}>
              Series {s}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={episode?.toString() ?? "all"}
        onValueChange={handleEpisodeChange}
        disabled={!season}
      >
        <SelectTrigger className="w-[120px] truncate">
          <SelectValue placeholder="All Episodes" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Episodes</SelectItem>
          {season &&
            [1, 2, 3].map((ep: number) => (
              <SelectItem key={ep} value={ep.toString()}>
                Episode {ep}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    </div>
  );
}
