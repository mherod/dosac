import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getFrameById } from "@/lib/frames.server";
import { CaptionEditor } from "./caption-editor";
import Link from "next/link";
import { MainNav } from "@/components/main-nav";

interface CaptionPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({
  params,
}: CaptionPageProps): Promise<Metadata> {
  const frame = await getFrameById(params.id);
  return {
    title: `Caption - ${frame.speech}`,
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
