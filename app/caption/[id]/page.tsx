import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { notFound } from "next/navigation";
import type React from "react";
import {
  AnimatedCaptionEditorWrapper,
  AnimatedCaptionPage,
  AnimatedFrameStripWrapper,
} from "@/components/animated-caption-page";
import { DynamicCaptionEditor } from "@/components/dynamic-caption-editor";
import { FrameStrip } from "@/components/frame-strip";
import { CaptionPageLayout } from "@/components/layout/caption-page-layout";
import { getCharactersForFrame } from "@/lib/frame-characters.server";
import { getFrameById, getNearbyFrames } from "@/lib/frames.server";
import { generateSingleFrameMetadata } from "@/lib/metadata";
import { generateMemeStructuredData } from "@/lib/structured-data";
import type { Screenshot } from "@/lib/types";

/**
 * Generates static parameters for the most important frame pages at build time
 * Limited to 600 pages for faster builds, with dynamic fallback for remaining pages
 */
export async function generateStaticParams(): Promise<Array<{ id: string }>> {
  try {
    const { getFrameIndex } = await import("@/lib/frames.server");
    const frames = await getFrameIndex();

    // Limit to 600 most important frames for static generation
    // Sort by episode order and take first 600 for better coverage
    return frames.slice(0, 600).map((frame) => ({
      id: frame.id,
    }));
  } catch {
    // Return empty array if frame index fails to load during build
    return [];
  }
}

/**
 * Interface for page route parameters
 */
interface PageParams {
  /** ID of the frame to display */
  id: string;
}

/**
 * Interface for page search parameters
 */
interface PageSearchParams {
  /** Optional text to display instead of the frame's speech */
  text?: string;
  /** Optional range end ID for multi-frame captions */
  range?: string;
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
 * Generates metadata for the caption page
 * @param props - The page props
 * @param props.params - Promise resolving to route parameters
 * @param props.searchParams - Promise resolving to search parameters
 * @returns Promise resolving to the page metadata
 */
export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<PageParams>;
  searchParams: Promise<PageSearchParams>;
}): Promise<Metadata> {
  try {
    const [resolvedParams, _resolvedSearch] = await Promise.all([
      params,
      searchParams,
    ]);
    const frame = await getFrameById(resolvedParams.id);

    // Use original frame speech for metadata to ensure consistency
    // Custom text is handled client-side for better caching
    return generateSingleFrameMetadata(frame, frame.speech);
  } catch {
    notFound();
  }
}

/**
 * Server component that renders the caption page content
 * Composes server-rendered layout with client interactive leaves
 */
function CaptionPageContent({
  frame,
  characters,
  nearbyFrames,
}: {
  frame: Screenshot;
  characters: Array<{ name: string; confidence: number }>;
  nearbyFrames: Screenshot[];
}): React.ReactElement {
  const structuredData = generateMemeStructuredData(frame, frame.speech);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <CaptionPageLayout episodeId={frame.episode} pageTitle="Caption">
        <AnimatedCaptionPage>
          <AnimatedFrameStripWrapper>
            <FrameStrip
              screenshots={nearbyFrames}
              centerScreenshot={frame}
              frameWidth={200}
            />
          </AnimatedFrameStripWrapper>
          <AnimatedCaptionEditorWrapper>
            <DynamicCaptionEditor frame={frame} characters={characters} />
          </AnimatedCaptionEditorWrapper>
        </AnimatedCaptionPage>
      </CaptionPageLayout>
    </>
  );
}

/**
 * Cached inner component for rendering the caption page
 * Marked with "use cache" and accepts only serializable props
 */
async function CaptionPageCached({
  id,
}: {
  id: string;
}): Promise<React.ReactElement> {
  "use cache";
  cacheLife("static");

  let frame: Screenshot;
  let characters: Array<{ name: string; confidence: number }>;
  let nearbyFrames: Screenshot[];

  try {
    // Parallelize data fetching — all three run simultaneously
    // getNearbyFrames returns only ~13 frames instead of the full 12K index
    const [frameData, charactersData, nearby] = await Promise.all([
      getFrameById(id),
      getCharactersForFrame(id),
      getNearbyFrames(id),
    ]);

    frame = frameData;
    characters = charactersData ?? [];
    nearbyFrames = nearby;
  } catch {
    notFound();
  }

  return (
    <CaptionPageContent
      frame={frame}
      characters={characters}
      nearbyFrames={nearbyFrames}
    />
  );
}

export default async function Page({
  params,
}: Pick<PageProps, "params">): Promise<React.ReactElement> {
  const resolvedParams = await params;
  return <CaptionPageCached id={resolvedParams.id} />;
}
