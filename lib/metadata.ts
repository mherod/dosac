import type { Frame } from "./frames";

const BASE_URL = "https://dosac.herod.dev";

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
  other?: {
    "og:logo"?: string;
  };
}

export function constructOgImageUrl(params: {
  caption: string;
  episode: string;
  timestamp: string;
  imageUrl: string;
  fontSize?: string;
  outlineWidth?: string;
  fontFamily?: string;
}): URL {
  const ogImageUrl = new URL("api/og", BASE_URL);
  ogImageUrl.searchParams.set("caption", params.caption);
  ogImageUrl.searchParams.set("episode", params.episode);
  ogImageUrl.searchParams.set("timestamp", params.timestamp);

  // Ensure the image URL is absolute and publicly accessible
  const imageUrl = new URL(params.imageUrl, BASE_URL).toString();
  ogImageUrl.searchParams.set("imageUrl", imageUrl);

  if (params.fontSize) ogImageUrl.searchParams.set("fontSize", params.fontSize);
  if (params.outlineWidth)
    ogImageUrl.searchParams.set("outlineWidth", params.outlineWidth);
  if (params.fontFamily)
    ogImageUrl.searchParams.set("fontFamily", params.fontFamily);

  return ogImageUrl;
}

export function generateSingleFrameMetadata(
  frame: Frame,
  caption: string,
): OpenGraphMetadata {
  const ogImageUrl = constructOgImageUrl({
    caption,
    episode: frame.episode,
    timestamp: frame.timestamp,
    imageUrl: frame.blankImageUrl,
    fontSize: "24",
    outlineWidth: "1",
    fontFamily: "Arial",
  });

  const imageUrlString = ogImageUrl.toString();
  const pageUrl = new URL(`caption/${frame.id}`, BASE_URL).toString();

  return {
    title: `Caption - ${caption}`,
    description: `${frame.episode} - ${frame.timestamp} - ${caption}`,
    openGraph: {
      title: `${frame.episode} - ${frame.timestamp}`,
      description: caption,
      url: pageUrl,
      type: "website",
      siteName: "Thick of It Quotes",
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
      title: `${frame.episode} - ${frame.timestamp}`,
      description: caption,
      images: [imageUrlString],
    },
  };
}

export function generateMultiFrameMetadata(frames: Frame[]): OpenGraphMetadata {
  if (!frames.length || !frames[0]) {
    return {
      title: "Create Meme",
      description: "Create a meme from multiple frames",
      openGraph: {
        title: "Create Meme",
        description: "Create a meme from multiple frames",
        url: new URL("caption", BASE_URL).toString(),
        type: "website",
        siteName: "Thick of It Quotes",
        locale: "en_GB",
        images: [],
      },
      twitter: {
        card: "summary_large_image",
        title: "Create Meme",
        description: "Create a meme from multiple frames",
        images: [],
      },
    };
  }

  const title = `${frames[0].episode} - ${frames.length}-Panel Meme`;
  const description = `Create a ${frames.length}-panel meme from ${frames[0].episode} with frames from ${frames
    .map((f) => f.timestamp)
    .join(", ")}`;

  const ogImageUrl = constructOgImageUrl({
    caption: frames[0].speech,
    episode: frames[0].episode,
    timestamp: frames[0].timestamp,
    imageUrl: frames[0].blankImageUrl,
  });

  const imageUrlString = ogImageUrl.toString();
  const pageUrl = new URL(
    `caption/${frames.map((f) => f.id).join("/")}`,
    BASE_URL,
  ).toString();

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: pageUrl,
      type: "website",
      siteName: "Thick of It Quotes",
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
  };
}
