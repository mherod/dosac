import { HomePage } from "@/components/home-page";
import { parseEpisodeId } from "@/lib/frames";
import { getFrameIndex } from "@/lib/frames.server";
import type { Screenshot } from "@/lib/types";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { generateWebsiteStructuredData } from "@/lib/structured-data";

// Configure page for optimal performance
// Pages will be dynamically rendered on first request then cached with ISR
// This provides the best balance between performance and functionality

// Enable ISR with 1 hour revalidation for all pages
// This means once a page is requested, it will be cached for 1 hour
export const revalidate = 3600;

/**
 * Generates dynamic metadata for the homepage based on search parameters
 * @param props - The page props
 * @param props.searchParams - Promise resolving to search parameters
 * @returns Promise resolving to the page metadata
 */
export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const resolvedParams = await searchParams;
  const season = resolvedParams.season
    ? Number(resolvedParams.season)
    : undefined;
  const episode = resolvedParams.episode
    ? Number(resolvedParams.episode)
    : undefined;
  const query = typeof resolvedParams.q === "string" ? resolvedParams.q : "";
  const page = Number(resolvedParams.page) || 1;

  // Base metadata
  let title = "The Thick of It Memes & Quotes";
  let description =
    "Create and share memes from The Thick of It TV show. Browse thousands of iconic moments and create your own captions.";

  // Dynamic title and description based on filters
  if (season && episode) {
    title = `Series ${season}, Episode ${episode} - The Thick of It Memes`;
    description = `Browse memes and quotes from Series ${season}, Episode ${episode} of The Thick of It. Create your own captions from iconic moments.`;
  } else if (season) {
    title = `Series ${season} - The Thick of It Memes`;
    description = `Browse all memes and quotes from Series ${season} of The Thick of It. Create your own captions from iconic moments.`;
  } else if (query) {
    title = `"${query}" - The Thick of It Memes`;
    description = `Find memes and quotes containing "${query}" from The Thick of It. Create your own captions from these iconic moments.`;
  } else if (page > 1) {
    title = `Page ${page} - The Thick of It Memes`;
    description = `Browse page ${page} of The Thick of It memes and quotes. Create your own captions from iconic moments.`;
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://dosac.uk";
  const currentUrl = new URL("/", baseUrl);

  // Add search parameters to URL for canonical link
  if (season) currentUrl.searchParams.set("season", season.toString());
  if (episode) currentUrl.searchParams.set("episode", episode.toString());
  if (query) currentUrl.searchParams.set("q", query);
  if (page > 1) currentUrl.searchParams.set("page", page.toString());

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: currentUrl.toString(),
      type: "website",
      siteName: "DOSAC.UK",
      locale: "en_GB",
      images: [
        {
          url: `${baseUrl}/og-homepage.jpg`,
          width: 1200,
          height: 630,
          alt: "The Thick of It Memes - Create and share memes from the iconic TV show",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${baseUrl}/og-homepage.jpg`],
    },
    alternates: {
      canonical: currentUrl.toString(),
    },
    other: {
      "og:image:width": "1200",
      "og:image:height": "630",
    },
  };
}

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
  const allScreenshots = await getFrameIndex();
  const resolvedParams = await searchParams;

  // Parse search parameters
  const currentPage = Number(resolvedParams.page) || 1;
  const season = resolvedParams.season
    ? Number(resolvedParams.season)
    : undefined;
  const episode = resolvedParams.episode
    ? Number(resolvedParams.episode)
    : undefined;
  const query = typeof resolvedParams.q === "string" ? resolvedParams.q : "";

  // Apply server-side filtering (same logic as client-side)
  let filteredScreenshots = allScreenshots;
  if (season || episode || query) {
    filteredScreenshots = allScreenshots.filter((screenshot) => {
      try {
        const { season: screenshotSeason, episode: screenshotEpisode } =
          parseEpisodeId(screenshot.episode);

        if (season && screenshotSeason !== season) return false;
        if (episode && screenshotEpisode !== episode) return false;
        if (
          query &&
          !screenshot.speech.toLowerCase().includes(query.toLowerCase())
        )
          return false;

        return true;
      } catch {
        return false;
      }
    });
  }

  // Server-side pagination
  const ITEMS_PER_PAGE = 36;
  const totalItems = filteredScreenshots.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const validPage = Math.min(Math.max(1, currentPage), totalPages || 1);

  // Redirect if the requested page doesn't match the valid page
  if (currentPage !== validPage) {
    const params = new URLSearchParams();

    // Preserve current filters
    if (season) params.set("season", season.toString());
    if (episode) params.set("episode", episode.toString());
    if (query) params.set("q", query);

    // Add page parameter only if not page 1
    if (validPage > 1) {
      params.set("page", validPage.toString());
    }

    const queryString = params.toString();
    const redirectUrl = queryString ? `/?${queryString}` : "/";
    redirect(redirectUrl);
  }

  const startIndex = (validPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);
  const pageScreenshots = filteredScreenshots.slice(startIndex, endIndex);

  // Ranked moments only for homepage (no filters)
  const rankedMoments: Screenshot[] = [];

  const paginationData = {
    currentPage: validPage,
    totalPages,
    totalItems,
    hasNextPage: validPage < totalPages,
    hasPrevPage: validPage > 1,
  };

  const filters = { season, episode, query, page: validPage };

  const structuredData = generateWebsiteStructuredData();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <HomePage
          screenshots={pageScreenshots}
          allScreenshots={allScreenshots}
          rankedMoments={rankedMoments}
          filters={filters}
          paginationData={paginationData}
        />
      </div>
    </>
  );
}
