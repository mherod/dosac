import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { forwardRef } from "react";

/**
 * Props for the SeriesSelect component
 */
interface SeriesSelectProps {
  /** Currently selected season number */
  season?: number;
  /** Currently selected episode number */
  episode?: number;
  /** Callback when season or episode selection changes */
  onFilterChange: (updates: { season?: number; episode?: number }) => void;
  /** Additional CSS classes */
  className?: string;
  /** Whether the component is in search mode */
  isSearchMode?: boolean;
}

/**
 * Props for the SelectOption component
 */
interface SelectOptionProps {
  /** Value for the select option */
  value: string;
  /** Optional href for linking options */
  href?: string;
  /** Content to display in the option */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Component for rendering a select option with optional link functionality
 * @param props - The component props
 * @param props.value - Value for the select option
 * @param props.href - Optional href for linking options
 * @param props.children - Content to display in the option
 * @param props.className - Additional CSS classes
 * @returns A select option component with optional link wrapper
 */
const SelectOption = forwardRef<
  React.ElementRef<typeof SelectItem>,
  SelectOptionProps
>(({ value, href, children, className }, ref) => {
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
});
SelectOption.displayName = "SelectOption";

/**
 *
 * @param root0
 * @param root0.season
 * @param root0.episode
 * @param root0.onFilterChange
 * @param root0.className
 * @param root0.isSearchMode
 */
export function SeriesSelect({
  season,
  episode,
  onFilterChange,
  className = "",
  isSearchMode = false,
}: SeriesSelectProps) {
  const handleSeriesChange = (value: string) => {
    const newSeason = value !== "all" ? parseInt(value, 10) : undefined;

    if (isSearchMode) {
      // In search mode, use filter change callback
      onFilterChange({
        season: newSeason,
        episode: newSeason ? episode : undefined,
      });
    } else {
      // In navigation mode, update the selection and navigate
      const href = newSeason ? `/series/${newSeason}` : "/series";
      window.location.href = href;
    }
  };

  const handleEpisodeChange = (value: string) => {
    const newEpisode = value !== "all" ? parseInt(value, 10) : undefined;

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
      window.location.href = href;
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
              {[1, 2, 3, 4].map((s) => (
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
              {[1, 2, 3, 4].map((s) => (
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
                [1, 2, 3].map((ep) => (
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
                [1, 2, 3].map((ep) => (
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
