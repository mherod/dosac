import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import type React from "react";
import { AllSeriesPage } from "@/components/all-series-page";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "The Thick of It Series",
  description:
    "Browse every series and episode of The Thick of It, with searchable quotes and caption-ready frames.",
  path: "/series",
});

/**
 * Main series page component
 * @returns The series page component
 */
export default async function SeriesPage(): Promise<React.ReactElement> {
  "use cache";
  cacheLife("static");

  return <AllSeriesPage />;
}
