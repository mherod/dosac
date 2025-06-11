import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getFrameById, getFrameIndex } from "@/lib/frames.server";
import { generateSingleFrameMetadata } from "@/lib/metadata";
import { CaptionEditor } from "./caption-editor";
import { FrameStrip } from "@/components/frame-strip";
import type { Screenshot } from "@/lib/types";
import { parseEpisodeId } from "@/lib/frames";
import { CaptionPageLayout } from "@/components/layout/caption-page-layout";

// Enable static generation with dynamic fallback
export const dynamicParams = true;

/**
 *
 */
export async function generateStaticParams(): Promise<Array<{ id: string }>> {
  const frames = await getFrameIndex();
  return frames.map((frame: Screenshot) => ({
    id: frame.id,
  }));
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
 *
 * @param root0
 * @param root0.params
 * @param root0.searchParams
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
  const frame = await getFrameById(resolvedParams.id);
  const text = resolvedSearch.text;
  const caption =
    typeof text === "string" ? decodeURIComponent(text) : frame.speech;

  return generateSingleFrameMetadata(frame, caption);
}

/**
 * Page component for displaying a single frame with caption editing capabilities
 * @param props - The component props
 * @param props.params - Promise resolving to route parameters containing frame ID
 * @param props.searchParams - Promise resolving to search parameters for text and range
 * @returns The frame display page with caption editor and frame strip
 */
export default async function Page({
  params,
  searchParams,
}: PageProps): Promise<React.ReactElement> {
  const [resolvedParams, resolvedSearch] = await Promise.all([
    params,
    searchParams,
  ]);

  const frame = await getFrameById(resolvedParams.id).catch(() => {
    notFound();
  });

  // Parse the episode ID to get series and episode numbers
  const { season: seriesNumber, episode: episodeNumber } = parseEpisodeId(
    frame.episode,
  );

  const [previousFrames, nextFrames] = await Promise.all([
    getFrameIndex().then((index: Screenshot[]) => {
      const i = index.findIndex((f: Screenshot) => f.id === frame.id);
      return i > 0 ? index.slice(Math.max(0, i - 3), i) : [];
    }),
    getFrameIndex().then((index: Screenshot[]) => {
      const i = index.findIndex((f: Screenshot) => f.id === frame.id);
      return i < index.length - 1 ? index.slice(i + 1, i + 10) : [];
    }),
  ]).catch(() => {
    notFound();
  });

  const text = resolvedSearch.text;
  const range = resolvedSearch.range;

  // If we have a text parameter, create an extended frame with the combined text
  const combinedFrame =
    typeof text === "string"
      ? {
          ...frame,
          speech: decodeURIComponent(text),
          isMultiFrame: true,
          rangeEndId: range,
          originalSpeech: frame.speech, // Keep the original speech for comparison
        }
      : frame;

  const _breadcrumbItems = [
    { label: "Series", href: "/series" },
    { label: `Series ${seriesNumber}`, href: `/series/${seriesNumber}` },
    {
      label: `Episode ${episodeNumber}`,
      href: `/series/${seriesNumber}/episode/${episodeNumber}`,
    },
    { label: "Caption", current: true },
  ];

  return (
    <CaptionPageLayout episodeId={frame.episode} pageTitle="Caption">
      <div className="flex items-center justify-center">
        <FrameStrip
          screenshots={[...previousFrames, frame, ...nextFrames].filter(
            (f: Screenshot | null | undefined): f is Screenshot =>
              f !== null &&
              f !== undefined &&
              typeof f.id === "string" &&
              typeof f.speech === "string",
          )}
          centerScreenshot={frame}
          frameWidth={200}
        />
      </div>
      <CaptionEditor screenshot={combinedFrame} />
    </CaptionPageLayout>
  );
}
