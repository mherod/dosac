import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { withQuery } from "ufo";
import { ScreenshotGrid } from "@/components/screenshot-grid";
import { CATEGORIES } from "@/lib/categories";
import { formatPageTitle } from "@/lib/constants";
import { getFrameIndex } from "@/lib/frames.server";

/**
 * Interface for page component props
 */
type Props = {
  /** Promise resolving to route parameters */
  params: Promise<{ id: string }>;
  /** Promise resolving to search parameters */
  searchParams?: Promise<CategorySearchParams>;
};

type CategorySearchParams = {
  page?: string;
};

const ITEMS_PER_PAGE = 36;
const EMPTY_SEARCH_PARAMS: CategorySearchParams = {};

/**
 * Parses a positive page number from a query parameter.
 * @param page - The raw page query parameter
 * @returns A valid positive page number
 */
function parseRequestedPage(page: string | undefined): number {
  const parsedPage = Number.parseInt(page || "1", 10);
  return Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
}

/**
 * Generate static params for all category pages
 */
export function generateStaticParams(): Array<{ id: string }> {
  return CATEGORIES.map((category) => ({
    id: category.id,
  }));
}

/**
 * Generates metadata for the category page
 * @param props - The component props
 * @param props.params - Promise resolving to route parameters containing category ID
 * @param props.searchParams - Promise resolving to pagination parameters
 * @returns Metadata object with title and description
 */
export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const [resolvedParams, resolvedSearchParams] = await Promise.all([
    params,
    searchParams ?? Promise.resolve(EMPTY_SEARCH_PARAMS),
  ]);
  const category = CATEGORIES.find(
    (c: { id: string }) => c.id === resolvedParams.id,
  );
  if (!category) return {};

  const page = parseRequestedPage(resolvedSearchParams.page);
  const pageSuffix = page > 1 ? ` - Page ${page}` : "";
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://dosac.uk";
  const pageUrl = new URL(
    withQuery(`/categories/${category.id}`, {
      ...(page > 1 && { page: page.toString() }),
    }),
    baseUrl,
  );

  return {
    title: formatPageTitle(`${category.title}${pageSuffix}`),
    description: `${category.description} Browse and create memes from The Thick of It quotes in this category.`,
    openGraph: {
      title: `${category.title} - The Thick of It Memes`,
      description: `${category.description} Create memes from The Thick of It quotes in this category.`,
      url: pageUrl.toString(),
      type: "website",
      siteName: "DOSAC.UK",
      locale: "en_GB",
      images: [
        {
          url: `${baseUrl}/og-category-${category.id}.jpg`,
          width: 1200,
          height: 630,
          alt: `${category.title} - The Thick of It Memes`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${category.title} - The Thick of It Memes`,
      description: `${category.description} Create memes from The Thick of It quotes in this category.`,
      images: [`${baseUrl}/og-category-${category.id}.jpg`],
    },
    alternates: {
      canonical: pageUrl.toString(),
    },
    other: {
      "og:image:width": "1200",
      "og:image:height": "630",
    },
  };
}

/**
 * Dynamic category content that handles params, filtering, and pagination
 * @param props - The component props
 * @param props.params - Promise resolving to route parameters containing category ID
 * @returns The category page with filtered screenshot grid
 */
async function CategoryPageContent({
  params,
  searchParams,
}: Props): Promise<React.ReactElement> {
  const [resolvedParams, resolvedSearchParams] = await Promise.all([
    params,
    searchParams ?? Promise.resolve(EMPTY_SEARCH_PARAMS),
  ]);
  const category = CATEGORIES.find(
    (c: { id: string }) => c.id === resolvedParams.id,
  );
  if (!category) return notFound();

  const allFrames = await getFrameIndex();
  const categoryFrames = allFrames.filter((frame: { speech: string }) =>
    category.filter(frame.speech),
  );

  const requestedPage = parseRequestedPage(resolvedSearchParams.page);
  const totalPages = Math.ceil(categoryFrames.length / ITEMS_PER_PAGE);
  const validPage = Math.min(requestedPage, Math.max(1, totalPages));
  const canonicalPageParam = validPage > 1 ? validPage.toString() : undefined;

  if (resolvedSearchParams.page !== canonicalPageParam) {
    redirect(
      withQuery(`/categories/${category.id}`, {
        ...(validPage > 1 && { page: validPage.toString() }),
      }),
    );
  }

  const startIndex = (validPage - 1) * ITEMS_PER_PAGE;
  const pageFrames = categoryFrames.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  const paginationData = {
    currentPage: validPage,
    totalPages,
    totalItems: categoryFrames.length,
    hasNextPage: validPage < totalPages,
    hasPrevPage: validPage > 1,
  };

  const filters = {
    query: "",
    page: validPage,
  };

  return (
    <main className="flex-1 bg-[#f3f2f1]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <ScreenshotGrid
          screenshots={pageFrames}
          allScreenshots={allFrames}
          filters={filters}
          paginationData={paginationData}
        />
      </div>
    </main>
  );
}

/**
 * Page component for displaying frames filtered by a specific category
 * Fully static page generated at build time using generateStaticParams
 * @param props - The component props
 * @returns The category page wrapped in a Suspense boundary
 */
export default function CategoryPage(props: Props): React.ReactElement {
  return (
    <Suspense
      fallback={
        <main className="flex-1 bg-[#f3f2f1]">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="h-96 animate-pulse rounded-lg bg-gray-200" />
          </div>
        </main>
      }
    >
      <CategoryPageContent {...props} />
    </Suspense>
  );
}
