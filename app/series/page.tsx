import { AllSeriesPage } from "@/components/all-series-page";
import { formatPageTitle } from "@/lib/constants";
import type { Metadata } from "next";
import type React from "react";

// Force static rendering for series list page
export const dynamic = "force-static";

export const metadata: Metadata = {
  title: formatPageTitle("Series"),
  description: "Browse all series of The Thick of It",
};

/**
 * Main series page component
 * @returns The series page component
 */
export default function SeriesPage(): React.ReactElement {
  return <AllSeriesPage />;
}
