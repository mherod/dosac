"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";
import { DosacLogo } from "./dosac-logo";
import { SeriesSelect } from "./series-select";
import { TextInput } from "@/components/ui/text-input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface Filters {
  season?: number;
  episode?: number;
  query: string;
}

interface NavFiltersProps {
  filters: Filters;
  onFilterChange: (updates: Partial<Filters>) => void;
  onQueryChange: (query: string) => void;
  className?: string;
}

export function NavFilters({
  filters,
  onFilterChange,
  onQueryChange,
  className = "",
}: NavFiltersProps) {
  const [localQuery, setLocalQuery] = useState(filters.query);
  const debouncedQuery = useDebounce(localQuery, 300);

  const router = useRouter();
  const queryString = useSearchParams();

  // Update parent when debounced query changes
  useEffect(() => {
    onQueryChange(debouncedQuery);
  }, [debouncedQuery, onQueryChange]);

  useEffect(() => {
    const query = queryString.get("q") || "";
    setLocalQuery(query);
    onQueryChange(query);
  }, [onQueryChange, queryString]);

  return (
    <div className={cn("border-t border-[#ffffff1f] bg-[#0b0c0c]", className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4">
          <div className="flex-shrink-0 min-w-0">
            <DosacLogo />
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto min-w-0">
            <div className="min-w-0 flex-shrink-0">
              <SeriesSelect
                season={filters.season}
                episode={filters.episode}
                onFilterChange={onFilterChange}
                className="w-full sm:w-auto"
              />
            </div>
            <div className="min-w-0 flex-1 sm:flex-none">
              <TextInput
                type="search"
                placeholder="Search ministerial quotes..."
                value={localQuery}
                onChange={(e) => {
                  const newQuery = e.target.value;
                  setLocalQuery(newQuery);
                  if (newQuery) {
                    const newQueryString = new URLSearchParams(queryString);
                    newQueryString.set("q", newQuery);
                    router.push(`/?${newQueryString.toString()}`, {
                      scroll: false,
                    });
                  }
                }}
                className={cn(
                  "w-full sm:w-64 border-[#ffffff33] bg-transparent text-white placeholder:text-[#ffffff66] focus-visible:ring-[#1d70b8] truncate",
                )}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
