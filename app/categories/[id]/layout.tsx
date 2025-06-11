import { type PropsWithChildren } from "react";
import { notFound } from "next/navigation";
import { FileText } from "lucide-react";
import { CATEGORIES } from "@/lib/categories";
import { getFrameIndex } from "@/lib/frames.server";

function CategoryHeader({
  title,
  description,
  itemCount,
}: {
  title: string;
  description: string;
  itemCount: number;
}): React.ReactElement {
  return (
    <div className="relative left-[50%] right-[50%] ml-[-50vw] mr-[-50vw] w-[100vw] bg-[#1d70b8] py-6 text-white">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="flex items-start gap-4">
          <div className="rounded-lg bg-white/10 p-2.5">
            <FileText className="h-7 w-7" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            <p className="max-w-2xl text-base leading-relaxed text-white/90">
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

type Props = {
  params: Promise<{ id: string }>;
};

export default async function CategoryLayout({
  children,
  params,
}: PropsWithChildren<Props>): Promise<React.ReactElement> {
  const resolvedParams = await params;
  const category = CATEGORIES.find(
    (c: { id: string }) => c.id === resolvedParams.id,
  );
  if (!category) return notFound();

  const allFrames = await getFrameIndex();
  const categoryFrames = allFrames.filter((frame: { speech: string }) =>
    category.filter(frame.speech),
  );

  return (
    <div className="relative">
      <CategoryHeader
        title={category.title}
        description={category.description}
        itemCount={categoryFrames.length}
      />
      {children}
    </div>
  );
}
