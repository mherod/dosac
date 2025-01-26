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

  const baseUrl = "https://dosac.herod.dev";

  const title = `${frames[0].episode} - ${frames.length}-Panel Meme`;
  const description = `Create a ${frames.length}-panel meme from ${frames[0].episode} with frames from ${frames
    .map((f) => f.timestamp)
    .join(", ")}`;

  // Construct OG image URL
  const ogImageUrl = new URL("api/og", baseUrl);
  ogImageUrl.searchParams.set("caption", frames[0].speech);
  ogImageUrl.searchParams.set("episode", frames[0].episode);
  ogImageUrl.searchParams.set("timestamp", frames[0].timestamp);
  ogImageUrl.searchParams.set("imageUrl", frames[0].blankImageUrl);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: ogImageUrl.toString(),
          width: 1200,
          height: 630,
          alt: `First frame from ${frames[0].episode} at ${frames[0].timestamp} - ${frames[0].speech}`,
        },
      ],
      type: "website",
      siteName: "Thick of It Quotes",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl.toString()],
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
