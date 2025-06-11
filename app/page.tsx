import { getFrameIndex } from "@/lib/frames.server";
import { HomePage } from "@/components/home-page";
import { parseEpisodeId } from "@/lib/frames";
import type { Screenshot } from "@/lib/types";

// Add revalidation period (e.g., 1 hour)
export const revalidate = 3600;

/**
 * Interface for search parameters
 */
type SearchParams = {
  /** Optional series number to filter by */
  season?: string;
  /** Optional episode number to filter by */
  episode?: string;
  /** Optional search query */
  q?: string;
};

/**
 * Interface for page component props
 */
type Props = {
  /** Promise resolving to empty route parameters */
  params: Promise<Record<string, never>>;
  /** Promise resolving to search parameters */
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

/**
 * Home page component that displays a grid of screenshots and ranked moments
 * Supports filtering by series, episode, and search query
 * @param props - The component props
 * @param props.searchParams - Promise resolving to search parameters for filtering content
 * @returns The home page with filtered screenshot grid and ranked moments
 */
export default async function Home({
  searchParams,
}: Props): Promise<React.ReactElement> {
  const [screenshots, rankedMoments] = await Promise.all([
    getFrameIndex(),
    fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/moments`,
    ).then((res: Response) => res.json()),
  ]);

  const resolvedParams = await searchParams;

  // Convert search params to the expected format
  const initialSearchParams = {
    season:
      typeof resolvedParams.season === "string"
        ? resolvedParams.season
        : undefined,
    episode:
      typeof resolvedParams.episode === "string"
        ? resolvedParams.episode
        : undefined,
    q: typeof resolvedParams.q === "string" ? resolvedParams.q : undefined,
  };

  // If there's a search query, we need to force dynamic rendering
  if (initialSearchParams.q) {
    const dynamicConfig = {
      dynamic: "force-dynamic" as const,
    };
    Object.assign(exports, dynamicConfig);
  }

  return (
    <HomePage
      screenshots={screenshots}
      rankedMoments={rankedMoments.map((m: { frame: Screenshot }) => m.frame)}
      initialSearchParams={initialSearchParams}
    />
  );
}

/**
 * Generate static parameters for all possible season and episode combinations
 *
 * @returns Array of search parameter combinations for static generation
 */
export async function generateStaticParams(): Promise<
  { searchParams: Partial<SearchParams> }[]
> {
  const frames = await getFrameIndex();
  const params: Array<{ searchParams: Partial<SearchParams> }> = [
    { searchParams: {} },
  ]; // Default view with no filters

  // Get unique seasons and episodes
  const episodeSet = new Set<string>();
  frames.forEach((frame: Screenshot) => {
    try {
      episodeSet.add(frame.episode);
    } catch (error) {
      console.error("Error parsing episode ID:", error);
    }
  });

  // Generate params for each season/episode combination
  episodeSet.forEach((episodeId: string) => {
    try {
      const { season, episode } = parseEpisodeId(episodeId);
      // Add season-only view
      params.push({
        searchParams: { season: season.toString() },
      });
      // Add season+episode view
      params.push({
        searchParams: {
          season: season.toString(),
          episode: episode.toString(),
        },
      });
    } catch (error) {
      console.error("Error parsing episode ID:", error);
    }
  });

  return params;
}
