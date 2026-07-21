import { formatISO } from "date-fns";
import { getEpisodeInfo } from "./episode-info";
import { characters } from "./profiles";
import { absoluteUrl, BASE_URL, DEFAULT_OG_IMAGE_URL } from "./seo";
import { getAllSeries, getSeriesInfo } from "./series-info";
import type { Screenshot } from "./types";

/**
 * Generates structured data for a TV show episode
 * @param seriesNumber - The series number
 * @param episodeNumber - The episode number
 * @returns JSON-LD structured data for the episode
 */
export function generateEpisodeStructuredData(
  seriesNumber: number,
  episodeNumber: number,
): object {
  const series = getSeriesInfo(seriesNumber);
  const episode = getEpisodeInfo(seriesNumber, episodeNumber);

  if (!series) return {};

  const episodeUrl = absoluteUrl(
    `/series/${seriesNumber}/episode/${episodeNumber}`,
  );
  const description = (episode?.shortSummary ?? series.shortSummary)
    .map((part) => (typeof part === "string" ? part : part.text))
    .join("");

  return {
    "@context": "https://schema.org",
    "@type": "TVEpisode",
    "@id": episodeUrl,
    name: episode?.title || `Episode ${episodeNumber}`,
    description,
    episodeNumber: episodeNumber,
    partOfSeries: {
      "@type": "TVSeries",
      "@id": absoluteUrl(`/series/${seriesNumber}`),
      name: `The Thick of It - Series ${seriesNumber}`,
      description: series.shortSummary
        .map((part) => (typeof part === "string" ? part : part.text))
        .join(""),
      numberOfSeasons: getAllSeries().length,
      genre: ["Comedy", "Political Satire"],
      inLanguage: "en-GB",
      countryOfOrigin: "GB",
    },
    url: episodeUrl,
    image: DEFAULT_OG_IMAGE_URL,
    ...(episode?.parsedDate && {
      datePublished: formatISO(episode.parsedDate, {
        representation: "date",
      }),
    }),
    inLanguage: "en-GB",
    genre: ["Comedy", "Political Satire"],
  };
}

/**
 * Generates structured data for a character profile
 * @param characterId - The character ID
 * @returns JSON-LD structured data for the character
 */
export function generateCharacterStructuredData(characterId: string): object {
  const character = characters[characterId];

  if (!character) return {};

  const profileUrl = absoluteUrl(`/profiles/${characterId}`);
  const imagePath =
    typeof character.image === "string"
      ? character.image
      : character.image?.src;

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": profileUrl,
    name: character.name,
    description: character.description,
    url: profileUrl,
    image: imagePath ? absoluteUrl(imagePath) : DEFAULT_OG_IMAGE_URL,
    jobTitle: character.role.map((role) => role).join(", "),
  };
}

/**
 * Generates structured data for a meme/caption page
 * @param frame - The screenshot frame
 * @param caption - The caption text
 * @returns JSON-LD structured data for the meme
 */
export function generateMemeStructuredData(
  frame: Screenshot,
  caption: string,
): object {
  const memeUrl = absoluteUrl(`/caption/${frame.id}`);

  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": memeUrl,
    name: `Meme: ${caption}`,
    description: `A meme created from The Thick of It featuring the quote: "${caption}"`,
    url: memeUrl,
    image: absoluteUrl(frame.imageUrl),
    creator: {
      "@type": "Organization",
      name: "DOSAC.UK",
      url: BASE_URL,
    },
    about: {
      "@type": "TVSeries",
      name: "The Thick of It",
      description: "British political satire television series",
    },
    keywords: ["meme", "The Thick of It", "political satire", "comedy"],
    inLanguage: "en-GB",
    genre: ["Comedy", "Meme", "Political Satire"],
  };
}

/**
 * Generates structured data for the main website
 * @returns JSON-LD structured data for the website
 */
export function generateWebsiteStructuredData(): object {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": BASE_URL,
    name: "DOSAC.UK - The Thick of It Memes",
    description:
      "Create and share memes from The Thick of It TV show. Browse thousands of iconic moments and create your own captions.",
    url: BASE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BASE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    publisher: {
      "@type": "Organization",
      name: "DOSAC.UK",
      url: BASE_URL,
    },
    about: {
      "@type": "TVSeries",
      name: "The Thick of It",
      description: "British political satire television series",
      genre: ["Comedy", "Political Satire"],
      inLanguage: "en-GB",
      countryOfOrigin: "GB",
    },
    keywords: [
      "The Thick of It",
      "memes",
      "political satire",
      "comedy",
      "TV show",
      "quotes",
      "Malcolm Tucker",
      "British comedy",
    ],
  };
}
