import type { Metadata } from "next";
import { SITE_NAME } from "./constants";
import type { Frame } from "./frames";

/**
 * Generates optimized metadata for frame pages with streaming support
 */
export async function generateFrameMetadata(
  frame: Frame | null,
  baseUrl: string,
): Promise<Metadata> {
  if (!frame) {
    return {
      title: "Frame Not Found",
      description: "The requested frame could not be found",
    };
  }

  const title = `${frame.speech.slice(0, 50)}${frame.speech.length > 50 ? "..." : ""}`;
  const description = `${frame.speech} - ${SITE_NAME}`;
  const imageUrl = `${baseUrl}/api/og?id=${frame.id}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: frame.speech,
        },
      ],
      type: "website",
      siteName: SITE_NAME,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: `${baseUrl}/caption/${frame.id}`,
    },
  };
}

/**
 * Generates metadata for series pages
 */
export function generateSeriesMetadata(
  seriesNumber: number,
  seriesTitle: string,
  description: string,
): Metadata {
  const title = `Series ${seriesNumber}: ${seriesTitle}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      siteName: SITE_NAME,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

/**
 * Generates metadata for character profile pages
 */
export function generateProfileMetadata(
  characterName: string,
  description: string,
  imageUrl?: string,
): Metadata {
  const title = `${characterName} - Character Profile`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "profile",
      siteName: SITE_NAME,
      ...(imageUrl && {
        images: [
          {
            url: imageUrl,
            width: 400,
            height: 400,
            alt: characterName,
          },
        ],
      }),
    },
    twitter: {
      card: imageUrl ? "summary_large_image" : "summary",
      title,
      description,
      ...(imageUrl && { images: [imageUrl] }),
    },
  };
}
