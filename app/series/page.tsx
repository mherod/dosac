import type { Metadata } from "next";
import { formatPageTitle } from "@/lib/constants";
import { AllSeriesPage } from "@/components/all-series-page";

export const metadata: Metadata = {
  title: formatPageTitle("Series"),
  description: "Browse all series of The Thick of It",
};

/**
 * Main series page component
 * @returns The series page component
 */
export default function SeriesPage() {
  return <AllSeriesPage />;
}
