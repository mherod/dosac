import { type ReactNode } from "react";
import { PageLayout } from "./page-layout";
import { parseEpisodeId } from "@/lib/frames";
import { getCaptionBreadcrumbs } from "@/lib/navigation";

interface CaptionPageLayoutProps {
  /** The main content to render inside the container */
  children: ReactNode;
  /** The episode ID (e.g., "s01e01") */
  episodeId: string;
  /** The page title to show in breadcrumbs */
  pageTitle: string;
}

/**
 * A standardized layout component for caption pages
 * Provides consistent breadcrumb navigation and layout
 * @param props - Component props
 * @param props.children - The main content to render inside the container
 * @param props.episodeId - The episode ID (e.g., "s01e01")
 * @param props.pageTitle - The page title to show in breadcrumbs
 * @returns A consistent page layout for caption pages
 */
export function CaptionPageLayout({
  children,
  episodeId,
  pageTitle,
}: CaptionPageLayoutProps) {
  const { season: seriesNumber, episode: episodeNumber } =
    parseEpisodeId(episodeId);

  const breadcrumbItems = getCaptionBreadcrumbs(
    seriesNumber,
    episodeNumber,
    pageTitle,
  );

  return (
    <PageLayout breadcrumbs={breadcrumbItems}>
      <div className="space-y-4">{children}</div>
    </PageLayout>
  );
}
