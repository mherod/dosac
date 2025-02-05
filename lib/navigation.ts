import type { LucideIcon } from "lucide-react";

/**
 * Types for breadcrumb navigation items
 */
export interface BreadcrumbItem {
  /** Label to display */
  label: string;
  /** Optional href for the item */
  href?: string;
  /** Whether this is the current page (active) */
  current?: boolean;
  /** Optional icon component */
  icon?: LucideIcon;
}

/**
 * Creates the base breadcrumb hierarchy starting from home
 * @returns Array of base breadcrumb items
 */
export function getBaseBreadcrumbs(): BreadcrumbItem[] {
  return [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Series",
      href: "/series",
    },
  ];
}

/**
 * Adds series level to breadcrumb hierarchy
 * @param seriesNumber - The series number
 * @param isCurrent - Whether this is the current page
 * @returns Array of breadcrumb items including series level
 */
export function getSeriesBreadcrumbs(
  seriesNumber: number,
  isCurrent = false,
): BreadcrumbItem[] {
  return [
    ...getBaseBreadcrumbs(),
    {
      label: `Series ${seriesNumber}`,
      href: `/series/${seriesNumber}`,
      current: isCurrent,
    },
  ];
}

/**
 * Adds episode list level to breadcrumb hierarchy
 * @param seriesNumber - The series number
 * @param isCurrent - Whether this is the current page
 * @returns Array of breadcrumb items including episodes level
 */
export function getEpisodeListBreadcrumbs(
  seriesNumber: number,
  isCurrent = false,
): BreadcrumbItem[] {
  return [
    ...getSeriesBreadcrumbs(seriesNumber),
    {
      label: "Episodes",
      href: `/series/${seriesNumber}/episode`,
      current: isCurrent,
    },
  ];
}

/**
 * Adds specific episode level to breadcrumb hierarchy
 * @param seriesNumber - The series number
 * @param episodeNumber - The episode number
 * @param isCurrent - Whether this is the current page
 * @returns Array of breadcrumb items including specific episode
 */
export function getEpisodeBreadcrumbs(
  seriesNumber: number,
  episodeNumber: number,
  isCurrent = false,
): BreadcrumbItem[] {
  return [
    ...getEpisodeListBreadcrumbs(seriesNumber),
    {
      label: `Episode ${episodeNumber}`,
      href: `/series/${seriesNumber}/episode/${episodeNumber}`,
      current: isCurrent,
    },
  ];
}

/**
 * Creates complete breadcrumb hierarchy for caption pages
 * @param seriesNumber - The series number
 * @param episodeNumber - The episode number
 * @param pageTitle - The caption page title
 * @returns Array of breadcrumb items including caption page
 */
export function getCaptionBreadcrumbs(
  seriesNumber: number,
  episodeNumber: number,
  pageTitle: string,
): BreadcrumbItem[] {
  return [
    ...getEpisodeBreadcrumbs(seriesNumber, episodeNumber),
    {
      label: pageTitle,
      current: true,
    },
  ];
}
