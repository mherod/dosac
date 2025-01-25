import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getFrameById } from "@/lib/frames.server";
import { CaptionEditor } from "./caption-editor";
import Link from "next/link";
import { MainNav } from "@/components/main-nav";

interface CaptionPageProps {
  params: { id: string };
}

export async function generateMetadata({
  params,
}: CaptionPageProps): Promise<Metadata> {
  const frame = await getFrameById(params.id);

  // Use environment variables or default to localhost for development
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const ogImageUrl = new URL(`${baseUrl}/api/og`);
  ogImageUrl.searchParams.set("caption", frame.speech);
  ogImageUrl.searchParams.set("episode", frame.episode);
  ogImageUrl.searchParams.set("timestamp", frame.timestamp);
  ogImageUrl.searchParams.set("imageUrl", `${baseUrl}${frame.blankImageUrl}`);
  ogImageUrl.searchParams.set("fontSize", "24");
  ogImageUrl.searchParams.set("outlineWidth", "1");
  ogImageUrl.searchParams.set("fontFamily", "Arial");

  return {
    title: `Caption - ${frame.speech}`,
    description: `${frame.episode} - ${frame.timestamp} - ${frame.speech}`,
    openGraph: {
      title: `${frame.episode} - ${frame.timestamp}`,
      description: frame.speech,
      images: [
        {
          url: ogImageUrl.toString(),
          width: 1200,
          height: 630,
          alt: frame.speech,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${frame.episode} - ${frame.timestamp}`,
      description: frame.speech,
      images: [ogImageUrl.toString()],
    },
  };
}

export default async function CaptionPage({ params }: CaptionPageProps) {
  const frame = await getFrameById(params.id).catch(() => {
    notFound();
  });

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
        <CaptionEditor screenshot={frame} />
      </div>
    </>
  );
}
