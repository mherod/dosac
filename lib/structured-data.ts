import type { Screenshot } from "./types";
import { getSeriesInfo } from "./series-info";
import { characters } from "./profiles";

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

  if (!series) return {};

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://dosac.uk";
  const episodeUrl = `${baseUrl}/series/${seriesNumber}/episode/${episodeNumber}`;

  return {
    "@context": "https://schema.org",
    "@type": "TVEpisode",
    "@id": episodeUrl,
    name: `Episode ${episodeNumber}`,
    description: series.shortSummary
      .map((part) => (typeof part === "string" ? part : part.text))
      .join(""),
    episodeNumber: episodeNumber,
    partOfSeries: {
      "@type": "TVSeries",
      "@id": `${baseUrl}/series/${seriesNumber}`,
      name: `The Thick of It - Series ${seriesNumber}`,
      description: series.shortSummary
        .map((part) => (typeof part === "string" ? part : part.text))
        .join(""),
      numberOfSeasons: 4,
      genre: ["Comedy", "Political Satire"],
      inLanguage: "en-GB",
      countryOfOrigin: "GB",
    },
    url: episodeUrl,
    image: `${baseUrl}/og-episode-s${seriesNumber}e${episodeNumber}.jpg`,
    datePublished: "2005-05-19", // Approximate start date
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

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://dosac.uk";
  const profileUrl = `${baseUrl}/profiles/${characterId}`;

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": profileUrl,
    name: character.name,
    description: character.description,
    url: profileUrl,
    image: character.image || `${baseUrl}/og-character-${characterId}.jpg`,
    jobTitle: character.role.map((role) => role).join(", "),
    worksFor: {
      "@type": "Organization",
      name: "UK Government",
    },
    knowsAbout: ["Politics", "Government", "Public Relations"],
    nationality: "British",
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
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://dosac.uk";
  const memeUrl = `${baseUrl}/caption/${frame.id}`;

  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": memeUrl,
    name: `Meme: ${caption}`,
    description: `A meme created from The Thick of It featuring the quote: "${caption}"`,
    url: memeUrl,
    image: frame.imageUrl,
    creator: {
      "@type": "Organization",
      name: "DOSAC.UK",
      url: baseUrl,
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
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://dosac.uk";

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": baseUrl,
    name: "DOSAC.UK - The Thick of It Memes",
    description:
      "Create and share memes from The Thick of It TV show. Browse thousands of iconic moments and create your own captions.",
    url: baseUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    publisher: {
      "@type": "Organization",
      name: "DOSAC.UK",
      url: baseUrl,
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
