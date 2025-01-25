import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getFrameById } from "@/lib/frames.server";
import Link from "next/link";
import { MainNav } from "@/components/main-nav";
import { DualCaptionEditor } from "./dual-caption-editor";

type PageProps = {
  params: { ids: string[] };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({
  params,
  searchParams,
}: PageProps): Promise<Metadata> {
  // Handle both /[id1]/[id2] and /[id]/compare?compare=[id2] formats
  const id1 = params.ids[0];
  const id2 = params.ids[1] || searchParams.compare;

  if (!id2 || typeof id2 !== "string") {
    return {
      title: "Invalid Meme Format",
      description: "Please provide two frame IDs to create a meme",
    };
  }

  const [frame1, frame2] = await Promise.all([
    getFrameById(id1),
    getFrameById(id2),
  ]);

  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  return {
    title: `Create Meme - ${frame1.episode}`,
    description: `Creating a meme from ${frame1.episode} using frames at ${frame1.timestamp} and ${frame2.timestamp}`,
    openGraph: {
      title: `Create Meme - ${frame1.episode}`,
      description: `Two-panel meme from ${frame1.episode}`,
      images: [
        {
          url: new URL(frame1.blankImageUrl, baseUrl).toString(),
          width: 1200,
          height: 630,
          alt: frame1.speech,
        },
      ],
    },
  };
}

export default async function Page({ params, searchParams }: PageProps) {
  // Handle both /[id1]/[id2] and /[id]/compare?compare=[id2] formats
  const id1 = params.ids[0];
  const id2 = params.ids[1] || searchParams.compare;

  if (!id2 || typeof id2 !== "string") {
    notFound();
  }

  const [frame1, frame2] = await Promise.all([
    getFrameById(id1).catch(() => {
      notFound();
    }),
    getFrameById(id2).catch(() => {
      notFound();
    }),
  ]);

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
        <DualCaptionEditor frame1={frame1} frame2={frame2} />
      </div>
    </>
  );
}
