import { SITE_NAME } from "./constants";
import { formatEpisodeId, formatTimestamp } from "./format-utils";
import {
  absoluteUrl,
  BASE_URL,
  truncateMetadataText,
  truncatePageTitle,
} from "./seo";
import type { Screenshot } from "./types";

interface OpenGraphMetadata {
  title: string;
  description: string;
  openGraph: {
    title: string;
    description: string;
    images: {
      url: string;
      width: number;
      height: number;
      alt: string;
      secure_url?: string;
    }[];
    type?: string;
    siteName?: string;
    url?: string;
    locale?: string;
    logo?: string;
  };
  twitter: {
    card: "summary_large_image";
    title: string;
    description: string;
    images: string[];
  };
  alternates: {
    canonical: string;
  };
  other?: {
    "og:logo"?: string;
  };
}

/**
 * Constructs an OG image URL with the provided parameters
 * @param params - The parameters for the OG image
 * @param params.caption - The caption text to display on the image
 * @param params.episode - The episode identifier
 * @param params.timestamp - The timestamp from the episode
 * @param params.imageUrl - The URL of the base image
 * @param params.fontSize - Optional font size for the caption
 * @param params.outlineWidth - Optional outline width for the caption
 * @param params.fontFamily - Optional font family for the caption
 * @returns The constructed URL for the OG image
 */
export function constructOgImageUrl(params: {
  caption: string;
  episode: string;
  timestamp: string;
  imageUrl: string;
  fontSize?: string;
  outlineWidth?: string;
  fontFamily?: string;
}): URL {
  const ogImageUrl = new URL("/api/og", BASE_URL);
  ogImageUrl.searchParams.set("caption", params.caption);
  ogImageUrl.searchParams.set("episode", params.episode);
  ogImageUrl.searchParams.set("timestamp", params.timestamp);

  // Ensure the image URL is absolute and publicly accessible
  const imageUrl = absoluteUrl(params.imageUrl);
  ogImageUrl.searchParams.set("imageUrl", imageUrl);

  if (params.fontSize) ogImageUrl.searchParams.set("fontSize", params.fontSize);
  if (params.outlineWidth)
    ogImageUrl.searchParams.set("outlineWidth", params.outlineWidth);
  if (params.fontFamily)
    ogImageUrl.searchParams.set("fontFamily", params.fontFamily);

  return ogImageUrl;
}

/**
 * Generates metadata for a single frame with caption
 * @param frame - The screenshot frame to generate metadata for
 * @param caption - The caption text for the frame
 * @returns The OpenGraph metadata object
 */
export function generateSingleFrameMetadata(
  frame: Screenshot,
  caption: string,
): OpenGraphMetadata {
  const ogImageUrl = constructOgImageUrl({
    caption,
    episode: frame.episode,
    timestamp: frame.timestamp,
    imageUrl: frame.imageUrl,
    fontSize: "24",
    outlineWidth: "1",
    fontFamily: "Arial",
  });

  const imageUrlString = ogImageUrl.toString();
  const pageUrl = absoluteUrl(`/caption/${frame.id}`);
  const title = truncatePageTitle(`Caption: ${caption}`);
  const episodeLabel = formatEpisodeId(frame.episode);
  const timestampLabel = formatTimestamp(frame.timestamp);
  const socialTitle = `${episodeLabel} – ${timestampLabel}`;
  const description = truncateMetadataText(
    `${episodeLabel} at ${timestampLabel}: ${caption}`,
    155,
  );
  const socialDescription = truncateMetadataText(caption, 155);

  return {
    title,
    description,
    openGraph: {
      title: socialTitle,
      description: socialDescription,
      url: pageUrl,
      type: "website",
      siteName: SITE_NAME,
      locale: "en_GB",
      images: [
        {
          url: imageUrlString,
          secure_url: imageUrlString,
          width: 1200,
          height: 630,
          alt: caption,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description: socialDescription,
      images: [imageUrlString],
    },
    alternates: {
      canonical: pageUrl,
    },
  };
}

/**
 * Generates metadata for multiple frames
 * @param frames - Array of screenshot frames to generate metadata for
 * @returns The OpenGraph metadata object
 */
export function generateMultiFrameMetadata(
  frames: Screenshot[],
): OpenGraphMetadata {
  if (!frames.length || !frames[0]) {
    return {
      title: "Create Meme",
      description: "Create a meme from multiple frames",
      openGraph: {
        title: "Create Meme",
        description: "Create a meme from multiple frames",
        url: new URL("caption", BASE_URL).toString(),
        type: "website",
        siteName: SITE_NAME,
        locale: "en_GB",
        images: [],
      },
      twitter: {
        card: "summary_large_image",
        title: "Create Meme",
        description: "Create a meme from multiple frames",
        images: [],
      },
      alternates: {
        canonical: BASE_URL,
      },
    };
  }

  const title = `${frames[0].episode} - ${frames.length}-Panel Meme`;
  const description = `Create a ${frames.length}-panel meme from ${frames[0].episode} with frames from ${frames
    .map((f: Screenshot) => f.timestamp)
    .join(", ")}`;

  const ogImageUrl = constructOgImageUrl({
    caption: frames[0].speech,
    episode: frames[0].episode,
    timestamp: frames[0].timestamp,
    imageUrl: frames[0].imageUrl,
  });

  const imageUrlString = ogImageUrl.toString();
  const pageUrl = absoluteUrl(
    `/caption/${frames.map((f: Screenshot) => f.id).join("/")}`,
  );

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: pageUrl,
      type: "website",
      siteName: SITE_NAME,
      locale: "en_GB",
      images: [
        {
          url: imageUrlString,
          secure_url: imageUrlString,
          width: 1200,
          height: 630,
          alt: `First frame from ${frames[0].episode} at ${frames[0].timestamp} - ${frames[0].speech}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrlString],
    },
    alternates: {
      canonical: pageUrl,
    },
  };
}
