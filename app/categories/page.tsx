import type { Metadata } from "next";
import { ScreenshotGrid } from "@/components/screenshot-grid";
import { getFrameIndex } from "@/lib/frames.server";
import { MainNav } from "@/components/main-nav";
import { FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Categories | DoSAC Digital Archive",
  description: "Browse the ministerial archive by category",
};

const CATEGORIES = [
  {
    id: "policy-disasters",
    title: "Policy Disasters",
    description: "When initiatives go spectacularly wrong",
    filter: (speech: string) =>
      speech.toLowerCase().includes("policy") ||
      speech.toLowerCase().includes("initiative") ||
      speech.toLowerCase().includes("programme") ||
      speech.toLowerCase().includes("strategy"),
  },
  {
    id: "malcolm-fury",
    title: "Malcolm's Greatest Hits",
    description: "The creative vocabulary of Malcolm Tucker",
    filter: (speech: string) =>
      speech.toLowerCase().includes("malcolm") ||
      speech.toLowerCase().includes("tucker") ||
      speech.includes("*"),
  },
  {
    id: "press-office",
    title: "Press Office Panic",
    description: "Media management at its finest",
    filter: (speech: string) =>
      speech.toLowerCase().includes("press") ||
      speech.toLowerCase().includes("media") ||
      speech.toLowerCase().includes("newspaper") ||
      speech.toLowerCase().includes("journalist"),
  },
  {
    id: "ministerial-gaffes",
    title: "Ministerial Gaffes",
    description: "When our leaders shine brightest",
    filter: (speech: string) =>
      speech.toLowerCase().includes("minister") ||
      speech.toLowerCase().includes("nicola") ||
      speech.toLowerCase().includes("hugh") ||
      speech.toLowerCase().includes("peter"),
  },
  {
    id: "incidents",
    title: "Incident Reports",
    description: "Official documentation of various crises",
    filter: (speech: string) =>
      speech.toLowerCase().includes("crisis") ||
      speech.toLowerCase().includes("disaster") ||
      speech.toLowerCase().includes("fuck") ||
      speech.toLowerCase().includes("shit"),
  },
];

export default async function CategoriesPage() {
  const allFrames = await getFrameIndex();

  return (
    <>
      <MainNav />
      <main className="flex-1 bg-[#f3f2f1]">
        <div className="bg-[#1d70b8] text-white py-6">
          <div className="container">
            <div className="flex items-center gap-3">
              <div className="rounded bg-white/10 p-1">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">
                  Ministerial Archive Categories
                </h1>
                <p className="text-sm text-white/80">
                  Official categorisation of ministerial communications and
                  incidents
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="container py-8">
          <div className="grid gap-8">
            {CATEGORIES.map((category) => {
              const categoryFrames = allFrames.filter((frame) =>
                category.filter(frame.speech),
              );

              return (
                <section
                  key={category.id}
                  id={category.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                >
                  <div className="border-b border-gray-200 bg-white px-6 py-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {category.title}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {category.description}
                    </p>
                    <div className="mt-2 inline-flex items-center rounded-full bg-[#1d70b8]/10 px-2.5 py-0.5 text-xs font-medium text-[#1d70b8]">
                      {categoryFrames.length} items
                    </div>
                  </div>
                  <div className="px-6 py-4">
                    <ScreenshotGrid screenshots={categoryFrames} />
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </main>
    </>
  );
}
