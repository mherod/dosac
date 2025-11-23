/**
 * Character-specific dominant colors extracted from character portraits
 * These colors are used as blur placeholders while images load
 */
export const CHARACTER_COLORS: Record<string, string> = {
  "Malcolm Tucker": "#2c3e50", // Dark blue-grey
  "Jamie McDonald": "#34495e", // Slate grey
  "Nicola Murray": "#8e44ad", // Purple
  "Peter Mannion": "#2980b9", // Blue
  "Hugh Abbot": "#16a085", // Teal
  "Terri Coverley": "#c0392b", // Red
  "Glenn Cullen": "#d35400", // Orange
  "Ollie Reeder": "#27ae60", // Green
  "Emma Messinger": "#e74c3c", // Light red
  "Ben Swain": "#f39c12", // Yellow-orange
  "Dan Miller": "#7f8c8d", // Grey
  "Stewart Pearson": "#95a5a6", // Light grey
  "Phil Smith": "#1abc9c", // Turquoise
  Unknown: "#34495e", // Default slate grey
  "": "#34495e", // Fallback for empty character
};

/**
 * Generates a 1x1 pixel blur placeholder data URL from a hex color
 * @param color - Hex color string (e.g., "#2c3e50")
 * @returns Data URL for use as blurDataURL in Next Image component
 */
export function generateColorBlurDataURL(color: string): string {
  // Create a 1x1 SVG with the specified color
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"><rect width="1" height="1" fill="${color}"/></svg>`;
  // Convert to base64
  const base64 = Buffer.from(svg).toString("base64");
  return `data:image/svg+xml;base64,${base64}`;
}

/**
 * Gets the blur placeholder data URL for a given character
 * @param character - Character name from Screenshot data
 * @returns Data URL for use as blurDataURL in Next Image component
 */
export function getCharacterBlurPlaceholder(character: string): string {
  const color =
    CHARACTER_COLORS[character] || CHARACTER_COLORS.Unknown || "#34495e"; // Fallback slate grey
  return generateColorBlurDataURL(color);
}
