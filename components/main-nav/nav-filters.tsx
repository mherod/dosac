"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";
import { SeriesSelect } from "./series-select";
import { SearchBar } from "./search-bar";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ProfileImageBadge } from "../profile-image-badge";
import { FEATURED_CHARACTERS } from "@/lib/profiles";

/**
 * Filter state interface for navigation
 */
interface Filters {
  /** Selected season number */
  season?: number;
  /** Selected episode number */
  episode?: number;
  /** Search query string */
  query: string;
}

/**
 * Props for the NavFilters component
 */
interface NavFiltersProps {
  /** Current filter state */
  filters: Filters;
  /** Callback when filter values change */
  onFilterChange: (updates: Partial<Filters>) => void;
  /** Callback when search query changes */
  onQueryChange: (query: string) => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Component for displaying navigation filters and search
 * Includes series selection and search bar with debounced input
 * @param props - The component props
 * @param props.filters - Current filter state
 * @param props.onFilterChange - Callback when filter values change
 * @param props.onQueryChange - Callback when search query changes
 * @param props.className - Additional CSS classes
 * @returns The navigation filters section with series select and search bar
 */
export function NavFilters({
  filters,
  onFilterChange,
  onQueryChange,
  className = "",
}: NavFiltersProps): React.ReactElement {
  const [localQuery, setLocalQuery] = useState(filters.query);
  const debouncedQuery = useDebounce(localQuery, 300);
  const queryString = useSearchParams();

  // Only consider it search mode if there's actual search text
  const isSearchMode = filters.query.trim() !== "";

  // Update parent when debounced query changes
  useEffect(() => {
    onQueryChange(debouncedQuery);
  }, [debouncedQuery, onQueryChange]);

  useEffect(() => {
    const query = queryString.get("q") || "";
    setLocalQuery(query);
    onQueryChange(query);
  }, [onQueryChange, queryString]);

  const handleSearchChange = (value: string): void => {
    setLocalQuery(value);
  };

  return (
    <div className={cn("border-t border-[#ffffff1f] bg-[#0b0c0c]", className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto min-w-0">
            <div className="min-w-0 flex-shrink-0">
              <SeriesSelect
                season={filters.season}
                episode={filters.episode}
                onFilterChange={onFilterChange}
                isSearchMode={isSearchMode}
              />
            </div>
            <div className="min-w-0 flex-1 sm:flex-none">
              <SearchBar
                value={localQuery}
                onChange={handleSearchChange}
                className="sm:w-64"
              />
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex -space-x-2">
              {FEATURED_CHARACTERS.map(
                (character: { id: string; name: string }) => (
                  <Link
                    key={character.id}
                    href={`/profiles/${character.id}`}
                    className="group relative hover:z-10"
                    title={character.name}
                  >
                    <ProfileImageBadge
                      characterId={character.id}
                      size="sm"
                      className="border-2 border-[#1d70b8] group-hover:border-white transition-colors"
                    />
                  </Link>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
