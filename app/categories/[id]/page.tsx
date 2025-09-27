import { ScreenshotGrid } from "@/components/screenshot-grid";
import { CATEGORIES } from "@/lib/categories";
import { formatPageTitle } from "@/lib/constants";
import { getFrameIndex } from "@/lib/frames.server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

/**
 * Interface for page component props
 */
type Props = {
  /** Promise resolving to route parameters */
  params: Promise<{ id: string }>;
};

/**
 * Generates metadata for the category page
 * @param props - The component props
 * @param props.params - Promise resolving to route parameters containing category ID
 * @returns Metadata object with title and description
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const category = CATEGORIES.find(
    (c: { id: string }) => c.id === resolvedParams.id,
  );
  if (!category) return {};

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://dosac.uk";
  const pageUrl = new URL(`/categories/${category.id}`, baseUrl);

  return {
    title: formatPageTitle(category.title),
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
 * Page component for displaying frames filtered by a specific category
 * @param props - The component props
 * @param props.params - Promise resolving to route parameters containing category ID
 * @returns The category page with filtered screenshot grid
 */
export default async function CategoryPage({
  params,
}: Props): Promise<React.ReactElement> {
  const resolvedParams = await params;
  const category = CATEGORIES.find(
    (c: { id: string }) => c.id === resolvedParams.id,
  );
  if (!category) return notFound();

  const allFrames = await getFrameIndex();
  const categoryFrames = allFrames.filter((frame: { speech: string }) =>
    category.filter(frame.speech),
  );

  // Create pagination data for category display (single page for now)
  const paginationData = {
    currentPage: 1,
    totalPages: 1,
    totalItems: categoryFrames.length,
    hasNextPage: false,
    hasPrevPage: false,
  };

  const filters = {
    query: "",
    page: 1,
  };

  return (
    <main className="flex-1 bg-[#f3f2f1]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <ScreenshotGrid
          screenshots={categoryFrames}
          allScreenshots={allFrames}
          filters={filters}
          paginationData={paginationData}
        />
      </div>
    </main>
  );
}
