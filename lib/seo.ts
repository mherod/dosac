import type { Metadata } from "next";
import { SITE_NAME } from "./constants";

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://dosac.uk";
export const DEFAULT_OG_IMAGE_URL = new URL("/og-image", BASE_URL).toString();

const TITLE_SUFFIX_LENGTH = ` | ${SITE_NAME}`.length;
const MAX_PAGE_TITLE_LENGTH = 60 - TITLE_SUFFIX_LENGTH;

/**
 * Constrains a child-route title so the root site-name suffix remains under
 * the recommended 60-character search-result limit.
 * @param value - Page-specific title
 * @returns Length-safe page title
 */
export function truncatePageTitle(value: string): string {
  return truncateMetadataText(value, MAX_PAGE_TITLE_LENGTH);
}

/**
 * Truncates metadata text without splitting the final word where practical.
 * @param value - Source text
 * @param maxLength - Maximum output length, including the ellipsis
 * @returns Text constrained to the requested length
 */
export function truncateMetadataText(value: string, maxLength: number): string {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) return normalized;

  const candidate = normalized.slice(0, maxLength - 1);
  const lastSpace = candidate.lastIndexOf(" ");
  const boundary =
    lastSpace >= Math.floor(maxLength * 0.65) ? lastSpace : candidate.length;

  return `${candidate.slice(0, boundary).trimEnd()}…`;
}

/**
 * Resolves a site path to an absolute production URL.
 * @param path - Absolute or site-relative URL
 * @returns Fully-qualified URL
 */
export function absoluteUrl(path: string): string {
  return new URL(path, BASE_URL).toString();
}

interface PageMetadataOptions {
  title: string;
  description: string;
  path: string;
  robots?: Metadata["robots"];
}

/**
 * Creates consistent metadata for a public, non-article landing page.
 * @param options - Page metadata inputs
 * @returns Next.js metadata with canonical and social-card fields
 */
export function createPageMetadata({
  title,
  description,
  path,
  robots,
}: PageMetadataOptions): Metadata {
  const safeTitle = truncatePageTitle(title);
  const safeDescription = truncateMetadataText(description, 155);
  const canonical = absoluteUrl(path);

  return {
    title: safeTitle,
    description: safeDescription,
    alternates: { canonical },
    robots,
    openGraph: {
      title: safeTitle,
      description: safeDescription,
      url: canonical,
      type: "website",
      siteName: SITE_NAME,
      locale: "en_GB",
      images: [
        {
          url: DEFAULT_OG_IMAGE_URL,
          width: 1200,
          height: 630,
          alt: `${safeTitle} on ${SITE_NAME}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: safeTitle,
      description: safeDescription,
      images: [DEFAULT_OG_IMAGE_URL],
    },
  };
}

/**
 * Serializes JSON-LD while escaping markup-significant characters.
 * @param value - Structured data object to serialize
 * @returns XSS-safe JSON text for an application/ld+json script
 */
export function serializeStructuredData(value: object): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
