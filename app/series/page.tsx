import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import type React from "react";
import { AllSeriesPage } from "@/components/all-series-page";
import { formatPageTitle } from "@/lib/constants";

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
  cacheLife("static");

  return <AllSeriesPage />;
}
