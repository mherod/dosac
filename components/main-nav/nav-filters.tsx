"use client";

import Image from "next/image";
import { Building2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebounce } from "@/hooks/use-debounce";
import React from "react";

interface Filters {
  season?: number;
  episode?: number;
  query: string;
}

interface NavFiltersProps {
  filters: Filters;
  onFilterChange: (updates: Partial<Filters>) => void;
  onQueryChange: (query: string) => void;
}

export function NavFilters({
  filters,
  onFilterChange,
  onQueryChange,
}: NavFiltersProps) {
  const [localQuery, setLocalQuery] = React.useState(filters.query);
  const debouncedQuery = useDebounce(localQuery, 300);

  // Update parent when debounced query changes
  React.useEffect(() => {
    onQueryChange(debouncedQuery);
  }, [debouncedQuery, onQueryChange]);

  return (
    <div className="border-t border-[#ffffff1f] bg-[#0b0c0c]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and department name */}
          <div className="flex items-center gap-2">
            <div className="rounded bg-white p-1">
              <Building2 className="h-6 w-6 text-[#0b0c0c]" />
            </div>
            <div className="flex flex-col">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="text-2xl font-bold tracking-tight cursor-help">
                      DoSAC
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-sm font-medium">
                      Department of Social Affairs and Citizenship (formerly
                      Department of Social Affairs)
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* Desktop navigation */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Select
                value={filters.season?.toString() ?? "all"}
                onValueChange={(value) => {
                  const newSeason =
                    value !== "all" ? parseInt(value, 10) : undefined;
                  onFilterChange({
                    season: newSeason,
                    episode: newSeason ? filters.episode : undefined,
                  });
                }}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="All Series" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Series</SelectItem>
                  {[1, 2, 3, 4].map((season) => (
                    <SelectItem key={season} value={season.toString()}>
                      Series {season}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filters.episode?.toString() ?? "all"}
                onValueChange={(value) => {
                  onFilterChange({
                    episode: value !== "all" ? Number(value) : undefined,
                  });
                }}
                disabled={!filters.season}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="All Episodes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Episodes</SelectItem>
                  {filters.season &&
                    [1, 2, 3].map((episode) => (
                      <SelectItem key={episode} value={episode.toString()}>
                        Episode {episode}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>

              <div className="relative">
                <input
                  type="search"
                  placeholder="Search ministerial quotes..."
                  value={localQuery}
                  onChange={(e) => setLocalQuery(e.target.value)}
                  className="px-3 py-1.5 rounded-md border border-[#ffffff33] bg-transparent text-sm text-white placeholder:text-[#ffffff66] w-64 focus:outline-none focus:ring-2 focus:ring-[#1d70b8]"
                />
              </div>
            </div>

            <div className="flex items-center gap-4 border-l border-[#ffffff33] pl-4">
              <div className="text-xs text-[#6f777b] flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <Image
                    src="/characters/terri.webp"
                    alt="Terri Coverley"
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                  <span className="font-medium text-white">Terri C</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className="lg:hidden py-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <div className="flex gap-2">
                <Select
                  value={filters.season?.toString() ?? "all"}
                  onValueChange={(value) => {
                    const newSeason =
                      value !== "all" ? parseInt(value, 10) : undefined;
                    onFilterChange({
                      season: newSeason,
                      episode: newSeason ? filters.episode : undefined,
                    });
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Series" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Series</SelectItem>
                    {[1, 2, 3, 4].map((season) => (
                      <SelectItem key={season} value={season.toString()}>
                        Series {season}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={filters.episode?.toString() ?? "all"}
                  onValueChange={(value) => {
                    onFilterChange({
                      episode: value !== "all" ? Number(value) : undefined,
                    });
                  }}
                  disabled={!filters.season}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Episodes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Episodes</SelectItem>
                    {filters.season &&
                      [1, 2, 3].map((episode) => (
                        <SelectItem key={episode} value={episode.toString()}>
                          Episode {episode}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <input
                type="search"
                placeholder="Search ministerial quotes..."
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                className="w-full px-3 py-1.5 rounded-md border border-[#ffffff33] bg-transparent text-sm text-white"
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#ffffff33]">
              <div className="flex items-center gap-2">
                <Image
                  src="/characters/terri.webp"
                  alt="Terri Coverley"
                  width={24}
                  height={24}
                  className="rounded-full"
                />
                <span className="text-sm">Terri C</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
