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
}) {
  return (
    <div className="bg-[#1d70b8] text-white py-6 w-[100vw] relative left-[50%] right-[50%] ml-[-50vw] mr-[-50vw]">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
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

type Props = {
  params: { id: string };
};

export default async function CategoryLayout({
  children,
  params,
}: PropsWithChildren<Props>) {
  const category = CATEGORIES.find((c) => c.id === params.id);
  if (!category) return notFound();

  const allFrames = await getFrameIndex();
  const categoryFrames = allFrames.filter((frame) =>
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
