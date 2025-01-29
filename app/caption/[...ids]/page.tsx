import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getFrameById, getFrameIndex } from "@/lib/frames.server";
import { generateMultiFrameMetadata } from "@/lib/metadata";
import Link from "next/link";
import { MainNav } from "@/components/main-nav";
import { DualCaptionEditor } from "./dual-caption-editor";
import { Suspense } from "react";

// Enable static generation with dynamic fallback
export const dynamicParams = true;

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

function assertString(value: unknown): asserts value is string {
  if (typeof value !== "string") {
    throw new Error("Expected string");
  }
}

type PageParams = {
  ids: string[];
};

type PageSearchParams = {
  compare?: string;
  [key: string]: string | string[] | undefined;
};

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
  allIds.forEach(assertString);

  // Fetch all frames in parallel
  const frames = await Promise.all(allIds.map((id) => getFrameById(id)));

  return generateMultiFrameMetadata(frames);
}

interface PageProps {
  params: Promise<PageParams>;
  searchParams: Promise<PageSearchParams>;
}

const Page = async ({ params, searchParams }: PageProps) => {
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
  allIds.forEach(assertString);

  // Fetch all frames in parallel
  const frames = await Promise.all(
    allIds.map((id) =>
      getFrameById(id).catch(() => {
        notFound();
      }),
    ),
  );

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <Link
          href="/"
          className="mb-4 inline-block text-blue-500 hover:underline"
        >
          ← Back to search
        </Link>
        <Suspense>
          <DualCaptionEditor frames={frames} />
        </Suspense>
      </div>
    </>
  );
};

export default Page;
