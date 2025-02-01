/**
 * Global site configuration constants
 */
export const SITE_NAME = "DOSAC.UK";

/**
 * Formats a page title with the site name
 * @param title - The page-specific title
 * @returns The formatted title with site name
 */
export function formatPageTitle(title: string): string {
  return `${title} | ${SITE_NAME}`;
}
