import { CAPTION_DEFAULTS } from "@/lib/config/caption";
import { useState } from "react";

/**
 * Configuration options for initialising caption state
 */
interface CaptionStateOptions {
  /** Initial font size in pixels */
  defaultFontSize?: number;
  /** Initial outline width in pixels */
  defaultOutlineWidth?: number;
  /** Initial shadow size in pixels */
  defaultShadowSize?: number;
  /** Initial font family */
  defaultFontFamily?: string;
}

/**
 * Custom hook for managing caption styling state
 *
 * Manages state for:
 * - Font size
 * - Outline width
 * - Shadow size
 * - Font family
 *
 * All values can be controlled independently and have sensible defaults from CAPTION_DEFAULTS.
 *
 * @param options - Configuration options for initial state values
 * @param options.defaultFontSize - Initial font size in pixels (default: CAPTION_DEFAULTS.fontSize)
 * @param options.defaultOutlineWidth - Initial outline width in pixels (default: CAPTION_DEFAULTS.outlineWidth)
 * @param options.defaultShadowSize - Initial shadow size in pixels (default: CAPTION_DEFAULTS.shadowSize)
 * @param options.defaultFontFamily - Initial font family to use (default: CAPTION_DEFAULTS.fontFamily)
 * @returns Object containing current state values and their setters
 *
 * @example
 * ```tsx
 * const {
 *   fontSize,
 *   setFontSize,
 *   outlineWidth,
 *   setOutlineWidth
 * } = useCaptionState({
 *   defaultFontSize: 24,
 *   defaultOutlineWidth: 2
 * });
 * ```
 */
export function useCaptionState({
  defaultFontSize = CAPTION_DEFAULTS.fontSize,
  defaultOutlineWidth = CAPTION_DEFAULTS.outlineWidth,
  defaultShadowSize = CAPTION_DEFAULTS.shadowSize,
  defaultFontFamily = CAPTION_DEFAULTS.fontFamily,
}: CaptionStateOptions = {}): {
  fontSize: number;
  setFontSize: (fontSize: number) => void;
  outlineWidth: number;
  setOutlineWidth: (outlineWidth: number) => void;
  shadowSize: number;
  setShadowSize: (shadowSize: number) => void;
  fontFamily: string;
  setFontFamily: (fontFamily: string) => void;
} {
  const [fontSize, setFontSize] = useState(defaultFontSize);
  const [outlineWidth, setOutlineWidth] = useState(defaultOutlineWidth);
  const [shadowSize, setShadowSize] = useState(defaultShadowSize);
  const [fontFamily, setFontFamily] = useState(defaultFontFamily);

  return {
    fontSize,
    setFontSize,
    outlineWidth,
    setOutlineWidth,
    shadowSize,
    setShadowSize,
    fontFamily,
    setFontFamily,
  };
}
