import { getFrameIndex } from "@/lib/frames.server";
import { HomePage } from "@/components/home-page";
import type { Screenshot } from "@/lib/types";

// Force dynamic rendering to prevent static generation timeout
export const dynamic = "force-dynamic";

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
