/**
 * Array of category definitions for filtering and organizing content
 * Each category has an ID, title, description, and filter function
 */
export const CATEGORIES = [
  {
    id: "policy-unit",
    title: "Policy Unit",
    description: "Departmental policy unit",
    filter: (speech: string) =>
      speech.toLowerCase().includes("policy") ||
      speech.toLowerCase().includes("initiative") ||
      speech.toLowerCase().includes("programme") ||
      speech.toLowerCase().includes("strategy"),
  },
  {
    id: "press-office",
    title: "Press Office",
    description: "Media management",
    filter: (speech: string) =>
      speech.toLowerCase().includes("press") ||
      speech.toLowerCase().includes("media") ||
      speech.toLowerCase().includes("newspaper") ||
      speech.toLowerCase().includes("journalist"),
  },
  {
    id: "incidents",
    title: "Incident Reports",
    description: "Official documentation of various crises",
    filter: (speech: string) =>
      speech.toLowerCase().includes("crisis") ||
      speech.toLowerCase().includes("disaster") ||
      speech.toLowerCase().includes("fuck") ||
      speech.toLowerCase().includes("shit") ||
      speech.toLowerCase().includes("minister") ||
      speech.toLowerCase().includes("nicola") ||
      speech.toLowerCase().includes("hugh") ||
      speech.toLowerCase().includes("peter"),
  },
] as const;

/**
 * Type representing valid category IDs
 * Derived from the CATEGORIES array to ensure type safety
 */
export type CategoryId = (typeof CATEGORIES)[number]["id"];
