"use client";

import Link from "next/link";
import Image from "next/image";
import { Building2, AlertCircle, Bell, HelpCircle, Lock } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
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
      <div className="mx-auto">
        <div className="flex h-8 items-center justify-between border-b border-[#ffffff1f] bg-[#fd0] text-[#0b0c0c] text-xs">
          <div className="flex items-center gap-2 px-8">
            <Lock className="h-4 w-4" />
            <span>
              OFFICIAL-SENSITIVE - FOR INTERNAL USE - RESTRICTED ACCESS
            </span>
          </div>
          <div className="flex items-center gap-4 px-8">
            <span className="flex items-center gap-1">
              <HelpCircle className="h-4 w-4" />
              Support
            </span>
            <span>|</span>
            <span>GSI: 020 7276 1234</span>
          </div>
        </div>
        <div className="flex h-12 items-center justify-between px-8 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <UKFlag className="h-4 w-8" />
            <div className="flex flex-col">
              <span className="text-md font-bold">Civil Service Digital</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-[#ffffff1f] bg-[#0b0c0c]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
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

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <select
                  value={filters.season ?? ""}
                  onChange={(e) => {
                    const newSeason = e.target.value
                      ? parseInt(e.target.value, 10)
                      : undefined;
                    handleFilterChange({
                      season: newSeason,
                      episode: newSeason ? filters.episode : undefined,
                    });
                  }}
                  className="px-3 py-1.5 rounded-md border border-[#ffffff33] bg-transparent text-sm text-white hover:bg-[#ffffff11] focus:outline-none focus:ring-2 focus:ring-[#1d70b8]"
                >
                  <option value="" className="bg-[#0b0c0c]">
                    All Series
                  </option>
                  {[1, 2, 3, 4].map((season) => (
                    <option
                      key={season}
                      value={season}
                      className="bg-[#0b0c0c]"
                    >
                      Series {season}
                    </option>
                  ))}
                </select>

                <select
                  value={filters.episode ?? ""}
                  onChange={(e) => {
                    handleFilterChange({
                      episode: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    });
                  }}
                  disabled={!filters.season}
                  className="px-3 py-1.5 rounded-md border border-[#ffffff33] bg-transparent text-sm text-white hover:bg-[#ffffff11] focus:outline-none focus:ring-2 focus:ring-[#1d70b8] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="" className="bg-[#0b0c0c]">
                    All Episodes
                  </option>
                  {filters.season &&
                    [1, 2, 3].map((episode) => (
                      <option
                        key={episode}
                        value={episode}
                        className="bg-[#0b0c0c]"
                      >
                        Episode {episode}
                      </option>
                    ))}
                </select>

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
                <div className="rounded-md border border-white/20 bg-[#1d70b8] px-2 py-1">
                  <span className="text-xs font-bold uppercase tracking-wide text-white">
                    Beta
                  </span>
                </div>
                <button className="text-white hover:text-[#fd0] transition-colors">
                  <Bell className="h-5 w-5" />
                </button>
                <div className="text-xs text-[#6f777b] flex items-center gap-2">
                  <span>Welcome back, </span>
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
                <ModeToggle />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-[#1d70b8] bg-[#1d70b8] py-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link
                href="/"
                className="text-sm font-bold text-white hover:underline hover:underline-offset-4"
              >
                Ministerial Database
              </Link>
              {CATEGORIES.map((category) => (
                <Link
                  key={category.id}
                  href={`/categories/${category.id}`}
                  className="text-sm font-bold text-white hover:underline hover:underline-offset-4"
                >
                  {category.title}
                </Link>
              ))}
            </div>
            <div className="text-xs text-white/60">
              Last updated: {new Date().toLocaleDateString("en-GB")} | System
              ID: DQARS-2024
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
