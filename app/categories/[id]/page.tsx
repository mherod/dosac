import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { FileText } from "lucide-react";
import { CATEGORIES } from "@/lib/categories";
import { getFrameIndex } from "@/lib/frames.server";
import { ScreenshotGrid } from "@/components/screenshot-grid";

type Props = {
  params: Promise<{ id: string }>;
};

function CategoryHeader({
  title,
  description,
  itemCount,
}: {
  title: string;
  description: string;
  itemCount: number;
}) {
  return (
    <div className="bg-[#1d70b8] text-white py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-start gap-4">
          <div className="rounded-lg bg-white/10 p-2.5">
            <FileText className="h-7 w-7" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            <p className="text-base text-white/90 leading-relaxed max-w-2xl">
              {description}
            </p>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-sm font-medium">
                {itemCount.toLocaleString()}{" "}
                {itemCount === 1 ? "item" : "items"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const category = CATEGORIES.find((c) => c.id === resolvedParams.id);
  if (!category) return {};

  return {
    title: `${category.title} | DoSAC Digital Archive`,
    description: category.description,
  };
}

export default async function CategoryPage({ params }: Props) {
  const resolvedParams = await params;
  const category = CATEGORIES.find((c) => c.id === resolvedParams.id);
  if (!category) return notFound();

  const allFrames = await getFrameIndex();
  const categoryFrames = allFrames.filter((frame) =>
    category.filter(frame.speech),
  );

  return (
    <>
      <main className="flex-1 bg-[#f3f2f1]">
        <CategoryHeader
          title={category.title}
          description={category.description}
          itemCount={categoryFrames.length}
        />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <ScreenshotGrid screenshots={categoryFrames} />
        </div>
      </main>
    </>
  );
}
