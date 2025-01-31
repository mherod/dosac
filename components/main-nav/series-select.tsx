import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { forwardRef } from "react";

interface SeriesSelectProps {
  season?: number;
  episode?: number;
  onFilterChange: (updates: { season?: number; episode?: number }) => void;
  className?: string;
  isSearchMode?: boolean;
}

interface SelectOptionProps {
  value: string;
  href?: string;
  children: React.ReactNode;
  className?: string;
}

const SelectOption = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  SelectOptionProps
>(({ value, href, children, className }, _ref) => {
  if (href) {
    return (
      <SelectItem value={value} className={className}>
        {children}
      </SelectItem>
    );
  }

  return (
    <SelectItem value={value} className={className}>
      {children}
    </SelectItem>
  );
});
SelectOption.displayName = "SelectOption";

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
