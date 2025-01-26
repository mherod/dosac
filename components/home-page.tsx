"use client";

import React, { Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useDebounce } from "@/hooks/use-debounce";
import { parseEpisodeId } from "@/lib/frames";
import type { Frame } from "@/lib/frames";
import { ScreenshotGrid } from "@/components/screenshot-grid";
import { MainNav } from "@/components/main-nav";

interface RankedMoment {
  id: string;
  episode: string;
  timestamp: string;
  quote: string;
  context: string;
  rank: number;
}

interface MatchedMoment {
  moment: RankedMoment;
  frame: Frame;
}

interface HomePageProps {
  screenshots: Frame[];
}

interface Filters {
  season?: number;
  episode?: number;
  query: string;
}

type FilterUpdates = Partial<Filters>;
type QueryUpdates = Record<string, string | null>;

function SearchWrapper({ screenshots }: { screenshots: Frame[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Add ranked moments state
  const [rankedMoments, setRankedMoments] = React.useState<Frame[]>([]);

  // Load ranked moments on mount
  React.useEffect(() => {
    console.log("Loading ranked moments...");
    fetch("/api/moments")
      .then((res) => res.json())
      .then((matchedMoments: MatchedMoment[]) => {
        console.log("Received matched moments:", matchedMoments.length);
        setRankedMoments(matchedMoments.map((m) => m.frame));
      })
      .catch((error) => {
        console.error("Error loading ranked moments:", error);
      });
  }, []);

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

  // Modify filteredScreenshots to exclude ranked moments when they're shown separately
  const filteredScreenshots = React.useMemo(() => {
    const isShowingRanked = !filters.season && !filters.episode && !localQuery;
    const screenshotsToFilter = isShowingRanked
      ? screenshots.filter((s) => !rankedMoments.some((r) => r.id === s.id))
      : screenshots;

    return screenshotsToFilter.filter((screenshot) => {
      try {
        const { season, episode } = parseEpisodeId(screenshot.episode);

        if (filters.season && season !== filters.season) return false;
        if (filters.episode && episode !== filters.episode) return false;
        if (localQuery) {
          return screenshot.speech
            .toLowerCase()
            .includes(localQuery.toLowerCase());
        }

        return true;
      } catch (error) {
        console.error("Error parsing episode ID:", error);
        return false;
      }
    });
  }, [screenshots, localQuery, filters.season, filters.episode, rankedMoments]);

  const { seasons, episodes } = React.useMemo(() => {
    const seasonsSet = new Set<number>();
    const episodesSet = new Set<number>();

    screenshots.forEach((screenshot) => {
      try {
        const { season, episode } = parseEpisodeId(screenshot.episode);
        seasonsSet.add(season);
        if (!filters.season || season === filters.season) {
          episodesSet.add(episode);
        }
      } catch (error) {
        console.error("Error parsing episode ID:", error);
      }
    });

    return {
      seasons: Array.from(seasonsSet).sort((a, b) => a - b),
      episodes: Array.from(episodesSet).sort((a, b) => a - b),
    };
  }, [screenshots, filters.season]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() =>
                handleFilterChange({ season: undefined, episode: undefined })
              }
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors duration-200 ${
                !filters.season
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-input hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              <span className="font-medium">All Seasons</span>
            </button>

            <button
              onClick={() =>
                handleFilterChange({ season: 1, episode: undefined })
              }
              className={`relative group inline-flex items-center w-full gap-2 px-4 py-3 rounded-lg border transition-colors duration-200 ${
                filters.season === 1
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-input hover:bg-accent hover:text-accent-foreground"
              } ${filters.season === 1 ? "opacity-80" : "font-semibold"}`}
            >
              <div className="flex items-center gap-3 w-full">
                {filters.season !== 1 && (
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                )}
                <div className="relative w-8 h-8 rounded-full bg-background border border-input overflow-hidden flex-shrink-0">
                  <img
                    src="/characters/malcom.jpg"
                    alt="Malcolm Tucker"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col items-start flex-grow min-w-0">
                  <div className="flex items-center justify-between w-full">
                    <span className="font-medium truncate">
                      URGENT: Personnel Changes at DoSAC (IMMEDIATE ACTION
                      REQUIRED)
                    </span>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                      09:15
                    </span>
                  </div>
                  <div className="flex items-center gap-2 w-full">
                    <span className="text-xs opacity-90 truncate">
                      From: M. Tucker (Director of Communications) via
                      BlackBerry
                    </span>
                    {filters.season !== 1 && (
                      <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-medium bg-red-100 text-red-800 rounded-full whitespace-nowrap ml-auto">
                        URGENT - READ NOW
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="absolute left-0 w-72 p-3 bg-popover text-popover-foreground text-xs rounded-md border shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 delay-500 -translate-y-full -top-2 z-20">
                <div className="absolute -bottom-2 left-4 w-4 h-4 rotate-45 bg-popover border-r border-b border-input"></div>
                <p className="font-medium mb-1">Key Personnel:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>
                    M. Tucker (Director of Communications) - Senior Press Office
                  </li>
                  <li>H. Abbott MP (Secretary of State) - Incoming Minister</li>
                  <li>G. Cullen, O. Reeder - Ministerial Advisory Team</li>
                </ul>
              </div>
            </button>

            <button
              onClick={() =>
                handleFilterChange({ season: 2, episode: undefined })
              }
              className={`relative group inline-flex items-center w-full gap-2 px-4 py-3 rounded-lg border transition-colors duration-200 ${
                filters.season === 2
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-input hover:bg-accent hover:text-accent-foreground"
              } ${filters.season === 2 ? "opacity-80" : "font-semibold"}`}
            >
              <div className="flex items-center gap-3 w-full">
                {filters.season !== 2 && (
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                )}
                <div className="relative w-8 h-8 rounded-full bg-background border border-input overflow-hidden flex-shrink-0">
                  <img
                    src="/characters/jamie.jpg"
                    alt="Jamie McDonald"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col items-start flex-grow min-w-0">
                  <div className="flex items-center justify-between w-full">
                    <span className="font-medium truncate">
                      Re: Leadership Transition (STRICTLY CONFIDENTIAL)
                    </span>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                      11:42
                    </span>
                  </div>
                  <div className="flex items-center gap-2 w-full">
                    <span className="text-xs opacity-90 truncate">
                      From: J. McDonald (Special Advisor) via Secure Terminal
                    </span>
                    {filters.season !== 2 && (
                      <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-medium bg-yellow-100 text-yellow-800 rounded-full whitespace-nowrap ml-auto">
                        EYES ONLY
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="absolute left-0 w-72 p-3 bg-popover text-popover-foreground text-xs rounded-md border shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 delay-500 -translate-y-full -top-2 z-20">
                <div className="absolute -bottom-2 left-4 w-4 h-4 rotate-45 bg-popover border-r border-b border-input"></div>
                <p className="font-medium mb-1">Key Personnel:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>
                    J. McDonald (Special Advisor) - Liaison to Director of
                    Communications
                  </li>
                  <li>
                    Internal Party Group - Ref: Upcoming Leadership Changes
                  </li>
                  <li>
                    B. Swain MP (Junior Minister) - See attached briefing notes
                  </li>
                </ul>
              </div>
            </button>

            <button
              onClick={() =>
                handleFilterChange({ season: 3, episode: undefined })
              }
              className={`relative group inline-flex items-center w-full gap-2 px-4 py-3 rounded-lg border transition-colors duration-200 ${
                filters.season === 3
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-input hover:bg-accent hover:text-accent-foreground"
              } ${filters.season === 3 ? "opacity-80" : "font-semibold"}`}
            >
              <div className="flex items-center gap-3 w-full">
                {filters.season !== 3 && (
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                )}
                <div className="relative w-8 h-8 rounded-full bg-background border border-input overflow-hidden flex-shrink-0">
                  <img
                    src="/characters/nicola.jpg"
                    alt="Nicola Murray"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col items-start flex-grow min-w-0">
                  <div className="flex items-center justify-between w-full">
                    <span className="font-medium truncate">
                      Notice: Ministerial Changes (PRESS EMBARGO 15:00)
                    </span>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                      14:30
                    </span>
                  </div>
                  <div className="flex items-center gap-2 w-full">
                    <span className="text-xs opacity-90 truncate">
                      From: Cabinet Office (RESTRICTED CIRCULATION)
                    </span>
                    {filters.season !== 3 && (
                      <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-medium bg-green-100 text-green-800 rounded-full whitespace-nowrap ml-auto">
                        EMBARGOED
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="absolute left-0 w-72 p-3 bg-popover text-popover-foreground text-xs rounded-md border shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 delay-500 -translate-y-full -top-2 z-20">
                <div className="absolute -bottom-2 left-4 w-4 h-4 rotate-45 bg-popover border-r border-b border-input"></div>
                <p className="font-medium mb-1">Key Personnel:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>N. Murray MP (Secretary of State) - New Appointment</li>
                  <li>T. Coverley (Civil Service) - Permanent Secretary</li>
                  <li>Communications Office - See ongoing correspondence</li>
                </ul>
              </div>
            </button>

            <button
              onClick={() =>
                handleFilterChange({ season: 4, episode: undefined })
              }
              className={`relative group inline-flex items-center w-full gap-2 px-4 py-3 rounded-lg border transition-colors duration-200 ${
                filters.season === 4
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-input hover:bg-accent hover:text-accent-foreground"
              } ${filters.season === 4 ? "opacity-80" : "font-semibold"}`}
            >
              <div className="flex items-center gap-3 w-full">
                {filters.season !== 4 && (
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                )}
                <div className="relative w-8 h-8 rounded-full bg-background border border-input overflow-hidden flex-shrink-0">
                  <img
                    src="/characters/peter.jpg"
                    alt="Peter Mannion"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col items-start flex-grow min-w-0">
                  <div className="flex items-center justify-between w-full">
                    <span className="font-medium truncate">
                      Coalition Framework Document v0.8b (NOT FOR CIRCULATION)
                    </span>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                      16:55
                    </span>
                  </div>
                  <div className="flex items-center gap-2 w-full">
                    <span className="text-xs opacity-90 truncate">
                      From: Opposition Office (INTERNAL USE ONLY)
                    </span>
                    {filters.season !== 4 && (
                      <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-medium bg-purple-100 text-purple-800 rounded-full whitespace-nowrap ml-auto">
                        DRAFT v0.8b
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="absolute left-0 w-72 p-3 bg-popover text-popover-foreground text-xs rounded-md border shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 delay-500 -translate-y-full -top-2 z-20">
                <div className="absolute -bottom-2 left-4 w-4 h-4 rotate-45 bg-popover border-r border-b border-input"></div>
                <p className="font-medium mb-1">Key Personnel:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>P. Mannion MP (Opposition) - Coalition Negotiations</li>
                  <li>S. Pearson (Strategic Comms) - Opposition Liaison</li>
                  <li>Goolding Inquiry - Ref: Internal Documentation</li>
                </ul>
              </div>
            </button>
          </div>
        </div>

        <div className="relative group">
          <select
            value={filters.season || ""}
            onChange={(e) => {
              const newSeason = e.target.value
                ? Number(e.target.value)
                : undefined;
              handleFilterChange({
                season: newSeason,
                episode: newSeason ? filters.episode : undefined,
              });
            }}
            className="w-full rounded-lg border border-input bg-background px-4 py-2 text-sm ring-offset-background"
          >
            <option value="">All Seasons</option>
            <option
              value="1"
              data-tooltip="Meet Malcolm Tucker, Hugh Abbott, and the chaotic world of DoSAC"
            >
              Season 1 - Hugh Abbott's DoSAC
            </option>
            <option
              value="2"
              data-tooltip="Jamie McDonald joins Malcolm's reign of terror"
            >
              Season 2 - Rise of Jamie McDonald
            </option>
            <option
              value="3"
              data-tooltip="Nicola Murray becomes Secretary of State, with predictably catastrophic results"
            >
              Season 3 - Nicola Murray's Reign
            </option>
            <option
              value="4"
              data-tooltip="The coalition government forms and Malcolm faces his greatest challenge"
            >
              Season 4 - Coalition & Inquiry
            </option>
          </select>
          <div className="absolute left-0 w-64 p-2 bg-popover text-popover-foreground text-xs rounded-md border shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 delay-500 -translate-y-full -top-2 z-10">
            <div className="absolute -bottom-2 left-4 w-4 h-4 rotate-45 bg-popover border-r border-b border-input"></div>
            {filters.season === 1 &&
              "The series begins with Hugh Abbott as Secretary of State and Malcolm Tucker establishing his fearsome reputation."}
            {filters.season === 2 &&
              "Jamie McDonald joins as Malcolm's enforcer, while the 'Nutters' plot their takeover of the party."}
            {filters.season === 3 &&
              "Nicola Murray takes over as Secretary of State, bringing her own unique brand of chaos to DoSAC."}
            {filters.season === 4 &&
              "The coalition government forms, leading to the inquiry that will test Malcolm's survival skills."}
            {!filters.season &&
              "Select a season to see memorable moments and character arcs."}
          </div>
        </div>

        <div className="relative group">
          <select
            value={filters.episode || ""}
            onChange={(e) => {
              handleFilterChange({
                episode: e.target.value ? Number(e.target.value) : undefined,
              });
            }}
            disabled={!filters.season}
            className="w-full rounded-lg border border-input bg-background px-4 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 group"
          >
            <option value="">All Episodes</option>
            {episodes.map((episode) => {
              let episodeInfo = "";
              let tooltipInfo = "";
              if (filters.season === 1) {
                switch (episode) {
                  case 1:
                    episodeInfo = "The Spinners and Losers";
                    tooltipInfo =
                      "Hugh Abbott's first day at DoSAC sets the tone for chaos to come";
                    break;
                  case 2:
                    episodeInfo = "Malcolm's Media Nightmare";
                    tooltipInfo =
                      "Malcolm deals with a media crisis while Hugh struggles with policy";
                    break;
                  case 3:
                    episodeInfo = "Hugh's Housing Crisis";
                    tooltipInfo =
                      "A housing policy announcement goes terribly wrong";
                    break;
                }
              } else if (filters.season === 2) {
                switch (episode) {
                  case 1:
                    episodeInfo = "Reshuffle Rumours";
                    tooltipInfo =
                      "Rumours of a reshuffle send DoSAC into panic mode";
                    break;
                  case 2:
                    episodeInfo = "The Rise of the Nutters";
                    tooltipInfo =
                      "The opposition within the party gains strength";
                    break;
                  case 3:
                    episodeInfo = "Jamie's Reign of Terror";
                    tooltipInfo =
                      "Jamie's aggressive tactics reach new heights";
                    break;
                }
              } else if (filters.season === 3) {
                switch (episode) {
                  case 1:
                    episodeInfo = "Nicola's First Day";
                    tooltipInfo =
                      "Nicola Murray's chaotic first day as Secretary of State";
                    break;
                  case 2:
                    episodeInfo = "The Quiet Before the Storm";
                    tooltipInfo = "Calm before a major political crisis erupts";
                    break;
                  case 3:
                    episodeInfo = "Malcolm's Last Stand";
                    tooltipInfo =
                      "Malcolm faces unprecedented challenges to his authority";
                    break;
                }
              } else if (filters.season === 4) {
                switch (episode) {
                  case 1:
                    episodeInfo = "Coalition Chaos";
                    tooltipInfo =
                      "The formation of the coalition government brings new challenges";
                    break;
                  case 2:
                    episodeInfo = "Inquiry Begins";
                    tooltipInfo = "The inquiry into government leaks begins";
                    break;
                  case 3:
                    episodeInfo = "The Final Reckoning";
                    tooltipInfo = "Everything comes to a head in the inquiry";
                    break;
                }
              }
              return (
                <option
                  key={episode}
                  value={episode}
                  data-tooltip={tooltipInfo}
                >
                  Episode {episode}
                  {episodeInfo ? ` - ${episodeInfo}` : ""}
                </option>
              );
            })}
          </select>
          <div className="absolute left-0 w-64 p-2 bg-popover text-popover-foreground text-xs rounded-md border shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 delay-500 -translate-y-full -top-2 z-10">
            <div className="absolute -bottom-2 left-4 w-4 h-4 rotate-45 bg-popover border-r border-b border-input"></div>
            {!filters.season &&
              "Select a season first to see available episodes"}
            {filters.season &&
              !filters.episode &&
              "Choose an episode to explore memorable moments"}
            {filters.season &&
              filters.episode &&
              episodes.find((e) => e === filters.episode) && (
                <>
                  {filters.season === 1 &&
                    filters.episode === 1 &&
                    "Hugh Abbott's first day at DoSAC sets the tone for chaos to come"}
                  {filters.season === 1 &&
                    filters.episode === 2 &&
                    "Malcolm deals with a media crisis while Hugh struggles with policy"}
                  {filters.season === 1 &&
                    filters.episode === 3 &&
                    "A housing policy announcement goes terribly wrong"}
                  {filters.season === 2 &&
                    filters.episode === 1 &&
                    "Rumours of a reshuffle send DoSAC into panic mode"}
                  {filters.season === 2 &&
                    filters.episode === 2 &&
                    "The opposition within the party gains strength"}
                  {filters.season === 2 &&
                    filters.episode === 3 &&
                    "Jamie's aggressive tactics reach new heights"}
                  {filters.season === 3 &&
                    filters.episode === 1 &&
                    "Nicola Murray's chaotic first day as Secretary of State"}
                  {filters.season === 3 &&
                    filters.episode === 2 &&
                    "Calm before a major political crisis erupts"}
                  {filters.season === 3 &&
                    filters.episode === 3 &&
                    "Malcolm faces unprecedented challenges to his authority"}
                  {filters.season === 4 &&
                    filters.episode === 1 &&
                    "The formation of the coalition government brings new challenges"}
                  {filters.season === 4 &&
                    filters.episode === 2 &&
                    "The inquiry into government leaks begins"}
                  {filters.season === 4 &&
                    filters.episode === 3 &&
                    "Everything comes to a head in the inquiry"}
                </>
              )}
          </div>
        </div>

        <div>
          <input
            type="search"
            placeholder="Search quotes..."
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        <div className="text-sm text-muted-foreground">
          Showing {filteredScreenshots.length} of {screenshots.length}{" "}
          screenshots
        </div>
      </div>

      <ScreenshotGrid
        screenshots={filteredScreenshots}
        rankedMoments={
          !filters.season && !filters.episode && !localQuery
            ? rankedMoments
            : undefined
        }
      />
    </div>
  );
}

export function HomePage({ screenshots }: HomePageProps) {
  return (
    <>
      <MainNav />
      <Suspense>
        <SearchWrapper screenshots={screenshots} />
      </Suspense>
    </>
  );
}
