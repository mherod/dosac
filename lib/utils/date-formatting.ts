import { format } from "date-fns";

/**
 * Formats an episode air date for display
 * @param airDate - The air date string or Date object
 * @returns Formatted date string (e.g., "15 January 2005")
 *
 * @example
 * ```ts
 * formatEpisodeAirDate("2005-01-15") // "15 January 2005"
 * formatEpisodeAirDate(new Date("2005-01-15")) // "15 January 2005"
 * ```
 */
export function formatEpisodeAirDate(airDate: string | Date): string {
  return format(new Date(airDate), "d MMMM yyyy");
}
