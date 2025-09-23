import { HomePage } from "@/components/home-page";
import { getFrameIndex } from "@/lib/frames.server";
import type { Screenshot } from "@/lib/types";

// Enable ISR with 1 hour revalidation
export const revalidate = 3600; // Revalidate every hour

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
  const screenshots = await getFrameIndex();

  // Use empty array for ranked moments during build to avoid fetch issues
  const rankedMoments: Screenshot[] = [];

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
    page:
      typeof resolvedParams.page === "string" ? resolvedParams.page : undefined,
  };

  return (
    <HomePage
      screenshots={screenshots}
      rankedMoments={rankedMoments}
      initialSearchParams={initialSearchParams}
    />
  );
}
