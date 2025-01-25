import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getFrameById } from "@/lib/frames.server";
import Link from "next/link";
import { MainNav } from "@/components/main-nav";
import { DualCaptionEditor } from "./dual-caption-editor";
import { Suspense } from "react";

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

  if (!frames.length || !frames[0]) {
    return {
      title: "Create Meme",
      description: "Create a meme from multiple frames",
    };
  }

  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  return {
    title: `Create Meme - ${frames[0].episode}`,
    description: `Creating a meme from ${frames[0].episode} using ${frames.length} frames`,
    openGraph: {
      title: `Create Meme - ${frames[0].episode}`,
      description: `${frames.length}-panel meme from ${frames[0].episode}`,
      images: [
        {
          url: new URL(frames[0].blankImageUrl, baseUrl).toString(),
          width: 1200,
          height: 630,
          alt: frames[0].speech,
        },
      ],
    },
  };
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
      <MainNav />
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
