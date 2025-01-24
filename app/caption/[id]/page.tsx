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

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-4 text-center">
      <h1 className="text-2xl font-bold text-red-500">Error</h1>
      <p className="max-w-md text-muted-foreground">{message}</p>
      <div className="text-sm text-muted-foreground">
        <p>If this error persists:</p>
        <ul className="list-disc text-left pl-4 mt-2">
          <li>Check the URL format is correct</li>
          <li>Try refreshing the page</li>
          <li>Return home and select a different frame</li>
        </ul>
      </div>
      <Link href="/" className="text-primary hover:underline">
        Return to Home
      </Link>
    </div>
  );
}

export default async function CaptionPage({ params }: CaptionPageProps) {
  let frame;
  try {
    frame = await getFrameById(params.id);
  } catch (error) {
    notFound();
  }

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
