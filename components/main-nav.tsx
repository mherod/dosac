"use client";

import Link from "next/link";
import Image from "next/image";
import { Building2, HelpCircle, Lock } from "lucide-react";
import { UKFlag } from "@/components/icons/uk-flag";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useDebounce } from "@/hooks/use-debounce";
import React from "react";
import { CATEGORIES } from "@/lib/categories";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Filters {
  season?: number;
  episode?: number;
  query: string;
}

type FilterUpdates = Partial<Filters>;
type QueryUpdates = Record<string, string | null>;

export function MainNav() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const createQueryString = React.useCallback(
    (updates: QueryUpdates) => {
      const params = new URLSearchParams(searchParams);
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null) {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });
      return params.toString();
    },
    [searchParams],
  );

  // Read filters from URL
  const filters = React.useMemo(
    (): Filters => ({
      season: searchParams.get("season")
        ? Number(searchParams.get("season"))
        : undefined,
      episode: searchParams.get("episode")
        ? Number(searchParams.get("episode"))
        : undefined,
      query: searchParams.get("q") ?? "",
    }),
    [searchParams],
  );

  const [localQuery, setLocalQuery] = React.useState(filters.query);
  const debouncedQuery = useDebounce(localQuery, 300);

  // Update URL when debounced query changes
  React.useEffect(() => {
    const queryString = createQueryString({
      q: debouncedQuery || null,
    });
    router.push(`${pathname}?${queryString}`, { scroll: false });
  }, [debouncedQuery, createQueryString, pathname, router]);

  // Handle filter changes
  const handleFilterChange = React.useCallback(
    (updates: FilterUpdates) => {
      const queryString = createQueryString({
        // Preserve existing values unless they're being updated
        season:
          updates.season?.toString() ?? filters.season?.toString() ?? null,
        episode:
          updates.episode?.toString() ?? filters.episode?.toString() ?? null,
        page: null, // Reset page when filters change
      });
      router.push(`${pathname}?${queryString}`, { scroll: false });
    },
    [createQueryString, pathname, router, filters.season, filters.episode],
  );

  return (
    <header className="bg-[#0b0c0c] text-white">
      {/* Top banner */}
      <div className="mx-auto">
        <div className="flex h-8 items-center justify-between border-b border-[#ffffff1f] bg-[#fd0] text-[#0b0c0c] text-xs">
          <div className="flex items-center gap-2 px-4 lg:px-8">
            <Lock className="h-4 w-4" />
            <span className="hidden sm:inline">
              OFFICIAL-SENSITIVE - FOR INTERNAL USE - RESTRICTED ACCESS
            </span>
            <span className="sm:hidden">RESTRICTED ACCESS</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 px-8">
            <span className="flex items-center gap-1">
              <HelpCircle className="h-4 w-4" />
              Support
            </span>
            <span>|</span>
            <span>GSI: 020 7276 1234</span>
          </div>
        </div>

        {/* Civil Service Digital header */}
        <div className="flex h-12 items-center justify-between px-4 lg:px-8 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <UKFlag className="h-4 w-8" />
            <div className="flex flex-col">
              <span className="text-md font-bold">Civil Service Digital</span>
            </div>
          </div>
          <div className="rounded-sm border border-white/20 bg-[#1d70b8] px-1.5 py-0.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-white">
              Beta
            </span>
          </div>
        </div>
      </div>

      {/* Main navigation */}
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
                    handleFilterChange({
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
                    handleFilterChange({
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
                      handleFilterChange({
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
                      handleFilterChange({
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

      {/* Bottom navigation */}
      <div className="border-t border-[#1d70b8] bg-[#1d70b8] py-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-6">
              <Link
                href="/"
                className="text-sm font-bold text-white hover:underline hover:underline-offset-4"
                suppressHydrationWarning
              >
                Ministerial Database
              </Link>
              <div className="flex flex-wrap gap-4">
                {CATEGORIES.map((category) => (
                  <Link
                    key={category.id}
                    href={`/categories/${category.id}`}
                    className="text-sm font-bold text-white hover:underline hover:underline-offset-4"
                    suppressHydrationWarning
                  >
                    {category.title}
                  </Link>
                ))}
              </div>
            </div>
            <div
              className="text-xs text-white/60 mt-2 sm:mt-0"
              suppressHydrationWarning
            >
              Last updated: {new Date().toLocaleDateString("en-GB")} | System
              ID: DQARS-2024
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
