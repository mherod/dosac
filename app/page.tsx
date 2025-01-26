import { getFrameIndex } from "@/lib/frames.server";
import { HomePage } from "@/components/home-page";
import { parseEpisodeId } from "@/lib/frames";

// Force dynamic rendering since we need to handle search params
export const dynamic = "force-dynamic";

type SearchParams = {
  season?: string;
  episode?: string;
  q?: string;
};

type Props = {
  params: Promise<Record<string, never>>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Home({ searchParams }: Props) {
  const screenshots = await getFrameIndex();
  const resolvedParams = await searchParams;

  return (
    <HomePage
      screenshots={screenshots}
      initialSearchParams={{
        season:
          typeof resolvedParams.season === "string"
            ? resolvedParams.season
            : undefined,
        episode:
          typeof resolvedParams.episode === "string"
            ? resolvedParams.episode
            : undefined,
        q: typeof resolvedParams.q === "string" ? resolvedParams.q : undefined,
      }}
    />
  );
}

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
