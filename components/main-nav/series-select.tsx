"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { forwardRef } from "react";

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
 * Props for the SelectOption component
 * @interface SelectOptionProps
 */
interface SelectOptionProps {
  /** Value to be passed to the select component on selection */
  value: string;
  /** Optional URL for linking the option to a route */
  href?: string;
  /** Content to display within the option */
  children: React.ReactNode;
  /** Additional CSS classes to apply to the option */
  className?: string;
}

/**
 * Renders a select option that can optionally be wrapped in a link
 * @component
 * @param props - Component props
 * @param props.value - Value for the select option
 * @param props.href - Optional href for linking the option
 * @param props.children - Content to display in the option
 * @param props.className - Additional CSS classes
 * @param ref - Forwarded ref for the select item
 * @returns A select option component, optionally wrapped in a link
 */
const SelectOption = forwardRef<
  React.ComponentRef<typeof SelectItem>,
  SelectOptionProps
>(
  (
    { value, href, children, className }: SelectOptionProps,
    ref: React.ForwardedRef<React.ComponentRef<typeof SelectItem>>,
  ): React.ReactElement => {
    if (href) {
      return (
        <SelectItem ref={ref} value={value} className={className}>
          {children}
        </SelectItem>
      );
    }

    return (
      <SelectItem ref={ref} value={value} className={className}>
        {children}
      </SelectItem>
    );
  },
);
SelectOption.displayName = "SelectOption";

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
      // In navigation mode, update the selection and navigate
      const href = newSeason ? `/series/${newSeason}` : "/series";
      router.push(href);
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
    } else if (season) {
      // In navigation mode, update the selection and navigate
      const href = newEpisode
        ? `/series/${season}/episode/${newEpisode}`
        : `/series/${season}`;
      router.push(href);
    }
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Select
        value={season?.toString() ?? "all"}
        onValueChange={handleSeriesChange}
      >
        <SelectTrigger className="w-[100px] truncate">
          <SelectValue placeholder="All Series" />
        </SelectTrigger>
        <SelectContent>
          {isSearchMode ? (
            <>
              <SelectOption value="all">All Series</SelectOption>
              {[1, 2, 3, 4].map((s: number) => (
                <SelectOption key={s} value={s.toString()}>
                  Series {s}
                </SelectOption>
              ))}
            </>
          ) : (
            <>
              <Link href="/series" scroll={false} className="block w-full">
                <SelectOption value="all">All Series</SelectOption>
              </Link>
              {[1, 2, 3, 4].map((s: number) => (
                <Link
                  key={s}
                  href={`/series/${s}`}
                  scroll={false}
                  className="block w-full"
                >
                  <SelectOption value={s.toString()}>Series {s}</SelectOption>
                </Link>
              ))}
            </>
          )}
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
          {isSearchMode ? (
            <>
              <SelectOption value="all">All Episodes</SelectOption>
              {season &&
                [1, 2, 3].map((ep: number) => (
                  <SelectOption key={ep} value={ep.toString()}>
                    Episode {ep}
                  </SelectOption>
                ))}
            </>
          ) : (
            <>
              <Link
                href={season ? `/series/${season}` : "/series"}
                scroll={false}
                className="block w-full"
              >
                <SelectOption value="all">All Episodes</SelectOption>
              </Link>
              {season &&
                [1, 2, 3].map((ep: number) => (
                  <Link
                    key={ep}
                    href={`/series/${season}/episode/${ep}`}
                    scroll={false}
                    className="block w-full"
                  >
                    <SelectOption value={ep.toString()}>
                      Episode {ep}
                    </SelectOption>
                  </Link>
                ))}
            </>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
