import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getFrameById } from "@/lib/frames.server";
import { generateSingleFrameMetadata } from "@/lib/metadata";
import { CaptionEditor } from "./caption-editor";
import Link from "next/link";
import { MainNav } from "@/components/main-nav";

type PageParams = {
  id: string;
};

type PageSearchParams = {
  text?: string;
  range?: string;
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
  const frame = await getFrameById(resolvedParams.id);
  const text = resolvedSearch.text;
  const caption =
    typeof text === "string" ? decodeURIComponent(text) : frame.speech;

  return generateSingleFrameMetadata(frame, caption);
}

interface PageProps {
  params: Promise<PageParams>;
  searchParams: Promise<PageSearchParams>;
}

export default async function Page({ params, searchParams }: PageProps) {
  const [resolvedParams, resolvedSearch] = await Promise.all([
    params,
    searchParams,
  ]);

  const frame = await getFrameById(resolvedParams.id).catch(() => {
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
        <CaptionEditor screenshot={combinedFrame} />
      </div>
    </>
  );
}
