/**
 * Global site configuration constants
 */
export const SITE_NAME = "DOSAC.UK";

/**
 * Returns the page-specific title for use in route `metadata`.
 *
 * The site-name suffix is added centrally by the root layout's
 * `metadata.title.template` (`%s | ${SITE_NAME}`), so this must return the
 * bare title only — appending the suffix here would double it
 * (e.g. "Series | DOSAC.UK | DOSAC.UK").
 * @param title - The page-specific title
 * @returns The bare page title (the root template adds the site name)
 */
export function formatPageTitle(title: string): string {
  return title;
}
