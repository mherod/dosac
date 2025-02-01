import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getFrameById, getFrameIndex } from "@/lib/frames.server";
import { generateMultiFrameMetadata } from "@/lib/metadata";
import { DualCaptionEditor } from "./dual-caption-editor";
import { Suspense } from "react";
import Link from "next/link";
import { parseEpisodeId } from "@/lib/frames";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { PageHeader } from "@/components/layout/page-header";
import { PageContainer } from "@/components/layout/page-container";

// Enable static generation with dynamic fallback
export const dynamicParams = true;

/**
 * Generates static params for consecutive frame pairs at build time
 * Creates paths for comparing adjacent frames in the sequence
 * @returns Array of objects containing frame ID pairs for static generation
 */
export async function generateStaticParams() {
  const frames = await getFrameIndex();
  const params = [];

  // Generate pairs of consecutive frames
  for (let i = 0; i < frames.length - 1; i++) {
    const frame1 = frames[i];
    const frame2 = frames[i + 1];

    if (frame1?.id && frame2?.id) {
      params.push({
        ids: [frame1.id, frame2.id],
      });
    }
  }

  return params;
}

/**
 * Interface for page route parameters
 */
interface PageParams {
  /** Array of frame IDs from the URL path */
  ids: string[];
}

/**
 * Interface for page search parameters
 */
interface PageSearchParams {
  /** Optional comma-separated list of additional frame IDs to compare */
  compare?: string;
  /** Optional text to display instead of the frames' speeches */
  text?: string;
}

/**
 * Interface for page component props
 */
interface PageProps {
  /** Promise resolving to route parameters */
  params: Promise<PageParams>;
  /** Promise resolving to search parameters */
  searchParams: Promise<PageSearchParams>;
}

/**
 * Generates metadata for the multi-frame comparison page
 * @param props - The component props
 * @param props.params - Promise resolving to route parameters containing frame IDs
 * @param props.searchParams - Promise resolving to search parameters for additional frames
 * @returns Metadata object with title and description based on the frames being compared
 */
export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<PageParams>;
  searchParams: Promise<PageSearchParams>;
}): Promise<Metadata> {
  const [resolvedParams, resolvedSearch] = await Promise.all([
    params,
    searchParams,
  ]);

  // Get all IDs from both path and query params
  const pathIds = resolvedParams.ids;
  const compareIds = resolvedSearch.compare?.split(",") || [];
  const allIds = [...pathIds, ...compareIds].slice(0, 4); // Limit to 4 frames

  if (allIds.length < 2) {
    return {
      title: "Invalid Meme Format",
      description: "Please provide at least two frame IDs to create a meme",
    };
  }

  // Validate all IDs are strings
  if (!allIds.every((id): id is string => typeof id === "string")) {
    return {
      title: "Invalid Frame IDs",
      description: "All frame IDs must be strings",
    };
  }

  // Fetch all frames in parallel
  const frames = await Promise.all(
    allIds.map((id) => getFrameById(id).catch(() => null)),
  ).then((results) =>
    results.filter(
      (frame): frame is NonNullable<typeof frame> => frame !== null,
    ),
  );

  if (!frames.length) {
    return {
      title: "Frames Not Found",
      description: "Could not find the requested frames",
    };
  }

  return generateMultiFrameMetadata(frames);
}

/**
 * Page component for comparing and editing multiple frames with captions
 * @param props - The component props
 * @param props.params - Promise resolving to route parameters containing frame IDs
 * @param props.searchParams - Promise resolving to search parameters for additional frames and text
 * @returns The frame comparison page with dual caption editor
 */
export default async function Page({ params, searchParams }: PageProps) {
  const [resolvedParams, resolvedSearch] = await Promise.all([
    params,
    searchParams,
  ]);

  // Get all IDs from both path and query params
  const pathIds = resolvedParams.ids;
  const compareIds = resolvedSearch.compare?.split(",") || [];
  const allIds = [...pathIds, ...compareIds].slice(0, 4); // Limit to 4 frames

  if (allIds.length < 2) {
    notFound();
  }

  // Validate all IDs are strings
  if (!allIds.every((id): id is string => typeof id === "string")) {
    notFound();
  }

  // Fetch all frames in parallel
  const frames = await Promise.all(
    allIds.map((id) =>
      getFrameById(id).catch(() => {
        notFound();
      }),
    ),
  );

  // Ensure we have at least one frame
  if (!frames.length || !frames[0]) {
    notFound();
  }

  // Get series and episode info for the first frame
  const { season: seriesNumber, episode: episodeNumber } = parseEpisodeId(
    frames[0].episode,
  );

  const breadcrumbItems = [
    { label: "Series", href: "/series" },
    { label: `Series ${seriesNumber}`, href: `/series/${seriesNumber}` },
    {
      label: `Episode ${episodeNumber}`,
      href: `/series/${seriesNumber}/episode/${episodeNumber}`,
    },
    { label: "Multi-Frame Caption", current: true },
  ];

  return (
    <>
      <PageHeader>
        <BreadcrumbNav items={breadcrumbItems} />
      </PageHeader>

      <div className="space-y-6">
        <Suspense>
          <DualCaptionEditor frames={frames} />
        </Suspense>
      </div>
    </>
  );
}
