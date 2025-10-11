import { AllSeriesPage } from "@/components/all-series-page";
import { formatPageTitle } from "@/lib/constants";
import { unstable_cacheLife } from "next/cache";
import type { Metadata } from "next";
import type React from "react";

export const metadata: Metadata = {
  title: formatPageTitle("Series"),
  description: "Browse all series of The Thick of It",
};

/**
 * Main series page component
 * @returns The series page component
 */
export default async function SeriesPage(): Promise<React.ReactElement> {
  "use cache";
  unstable_cacheLife("static");

  return <AllSeriesPage />;
}
