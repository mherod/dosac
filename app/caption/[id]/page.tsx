import {
  AnimatedCaptionEditorWrapper,
  AnimatedCaptionPage,
  AnimatedFrameStripWrapper,
} from "@/components/animated-caption-page";
import { FrameStrip } from "@/components/frame-strip";
import { CaptionPageLayout } from "@/components/layout/caption-page-layout";
import { generateSingleFrameMetadata } from "@/lib/metadata";
import { getFrameById, getFrameIndex } from "@/lib/frames.server";
import type { Screenshot } from "@/lib/types";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type React from "react";
import { DynamicCaptionEditor } from "@/components/dynamic-caption-editor";

// Enable static generation with dynamic fallback
export const dynamicParams = true;

// Force static rendering for better prerendering
export const dynamic = "force-static";

// Enable streaming for better performance
export const revalidate = 3600; // Revalidate every hour

/**
 * Generates static parameters for all frame pages at build time
 * This enables static generation for better performance and SEO
 */
export async function generateStaticParams(): Promise<Array<{ id: string }>> {
  try {
    const { getFrameIndex } = await import("@/lib/frames.server");
    const frames = await getFrameIndex();
    return frames.map((frame) => ({
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
    // Return basic metadata if frame fetch fails
    return {
      title: "Caption Editor",
      description: "Create and edit captions for The Thick of It frames",
    };
  }
}

/**
 * Optimized server component that delivers maximum prerenderable content
 * Uses efficient batched data fetching and React 18 concurrent features
 * @param props - The component props
 * @param props.params - Promise resolving to route parameters containing frame ID
 * @returns Fully server-rendered page with efficient data loading
 */
export default async function Page({
  params,
}: Pick<PageProps, "params">): Promise<React.ReactElement> {
  const resolvedParams = await params;

  try {
    // Optimize data fetching with a single frame lookup followed by efficient index operations
    const frame = await getFrameById(resolvedParams.id);

    // Pre-calculate frame strip data server-side for maximum prerendering
    const index = await getFrameIndex();
    const currentIndex = index.findIndex((f: Screenshot) => f.id === frame.id);

    let previousFrames: Screenshot[] = [];
    let nextFrames: Screenshot[] = [];

    if (currentIndex !== -1) {
      previousFrames =
        currentIndex > 0
          ? index.slice(Math.max(0, currentIndex - 3), currentIndex)
          : [];
      nextFrames =
        currentIndex < index.length - 1
          ? index.slice(currentIndex + 1, currentIndex + 10)
          : [];
    }

    // Combine all frames for the strip
    const allFrames = [...previousFrames, frame, ...nextFrames].filter(
      (f: Screenshot | null | undefined): f is Screenshot =>
        f !== null &&
        f !== undefined &&
        typeof f.id === "string" &&
        typeof f.speech === "string",
    );

    return (
      <CaptionPageLayout episodeId={frame.episode} pageTitle="Caption">
        <AnimatedCaptionPage>
          <AnimatedFrameStripWrapper>
            <FrameStrip
              screenshots={allFrames}
              centerScreenshot={frame}
              frameWidth={200}
            />
          </AnimatedFrameStripWrapper>
          <AnimatedCaptionEditorWrapper>
            <DynamicCaptionEditor frame={frame} />
          </AnimatedCaptionEditorWrapper>
        </AnimatedCaptionPage>
      </CaptionPageLayout>
    );
  } catch {
    notFound();
  }
}
