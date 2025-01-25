import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getFrameById } from "@/lib/frames.server";
import { CaptionEditor } from "./caption-editor";
import Link from "next/link";
import { MainNav } from "@/components/main-nav";

interface CaptionPageProps {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata({
  params,
  searchParams,
}: CaptionPageProps): Promise<Metadata> {
  const frame = await getFrameById(params.id);
  const text = searchParams.text;
  const caption =
    typeof text === "string" ? decodeURIComponent(text) : frame.speech;

  // Use environment variables or default to localhost for development
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const ogImageUrl = new URL(`${baseUrl}/api/og`);
  ogImageUrl.searchParams.set("caption", caption);
  ogImageUrl.searchParams.set("episode", frame.episode);
  ogImageUrl.searchParams.set("timestamp", frame.timestamp);
  // Ensure the image URL is absolute and publicly accessible
  const imageUrl = new URL(frame.blankImageUrl, baseUrl).toString();
  ogImageUrl.searchParams.set("imageUrl", imageUrl);
  ogImageUrl.searchParams.set("fontSize", "24");
  ogImageUrl.searchParams.set("outlineWidth", "1");
  ogImageUrl.searchParams.set("fontFamily", "Arial");

  return {
    title: `Caption - ${caption}`,
    description: `${frame.episode} - ${frame.timestamp} - ${caption}`,
    openGraph: {
      title: `${frame.episode} - ${frame.timestamp}`,
      description: caption,
      images: [
        {
          url: ogImageUrl.toString(),
          width: 1200,
          height: 630,
          alt: caption,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${frame.episode} - ${frame.timestamp}`,
      description: caption,
      images: [ogImageUrl.toString()],
    },
  };
}

export default async function CaptionPage({
  params,
  searchParams,
}: CaptionPageProps) {
  const frame = await getFrameById(params.id).catch(() => {
    notFound();
  });

  const text = searchParams.text;
  const range = searchParams.range;

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
