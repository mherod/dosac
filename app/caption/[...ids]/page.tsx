import { CaptionPageLayout } from "@/components/layout/caption-page-layout";
import { getFrameById, getFrameIndex } from "@/lib/frames.server";
import { generateMultiFrameMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { DualCaptionEditor } from "./dual-caption-editor";

// Enable static generation with dynamic fallback
export const dynamicParams = true;

/**
 * Generates static params for consecutive frame pairs at build time
 * Creates paths for comparing adjacent frames in the sequence
 * @returns Array of objects containing frame ID pairs for static generation
 */
export async function generateStaticParams(): Promise<{ ids: string[] }[]> {
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

  // Validate all IDs are non-empty strings
  if (
    !allIds.every((id): id is string => typeof id === "string" && id.length > 0)
  ) {
    return {
      title: "Invalid Frame IDs",
      description: "All frame IDs must be strings",
    };
  }

  // Fetch all frames in parallel
  const frameResults = await Promise.all(
    allIds.map((id: string) => getFrameById(id).catch(() => null)),
  );
  const frames = frameResults.filter(
    (frame): frame is NonNullable<typeof frame> => frame !== null,
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
export default async function Page({
  params,
  searchParams,
}: PageProps): Promise<React.ReactElement> {
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

  // Validate all IDs are non-empty strings
  if (
    !allIds.every((id): id is string => typeof id === "string" && id.length > 0)
  ) {
    notFound();
  }

  // Fetch all frames in parallel
  const frames = await Promise.all(
    allIds.map((id: string) =>
      getFrameById(id).catch(() => {
        notFound();
      }),
    ),
  );

  // Ensure we have at least one frame
  if (!frames.length || !frames[0]) {
    notFound();
  }

  return (
    <CaptionPageLayout
      episodeId={frames[0].episode}
      pageTitle="Multi-Frame Caption"
    >
      <Suspense>
        <DualCaptionEditor frames={frames} />
      </Suspense>
    </CaptionPageLayout>
  );
}
