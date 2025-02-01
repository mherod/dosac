import { getFrameIndex } from "@/lib/frames.server";
import { HomePage } from "@/components/home-page";
import { parseEpisodeId } from "@/lib/frames";

// Add revalidation period (e.g., 1 hour)
export const revalidate = 3600;

type SearchParams = {
  season?: string;
  episode?: string;
  q?: string;
};

type Props = {
  params: Promise<Record<string, never>>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

/**
 *
 * @param root0
 * @param root0.searchParams
 */
export default async function Home({ searchParams }: Props) {
  const [screenshots, rankedMoments] = await Promise.all([
    getFrameIndex(),
    fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/moments`,
    ).then((res) => res.json()),
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
 *
 */
export async function generateStaticParams() {
  const frames = await getFrameIndex();
  const params: Array<{ searchParams: Partial<SearchParams> }> = [
    { searchParams: {} },
  ]; // Default view with no filters

  // Get unique seasons and episodes
  const episodeSet = new Set<string>();
  frames.forEach((frame) => {
    try {
      episodeSet.add(frame.episode);
    } catch (error) {
      console.error("Error parsing episode ID:", error);
    }
  });

  // Generate params for each season/episode combination
  episodeSet.forEach((episodeId) => {
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
