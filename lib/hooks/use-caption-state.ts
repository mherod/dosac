import { useState } from "react";
import { CAPTION_DEFAULTS } from "@/lib/config/caption";

interface CaptionStateOptions {
  defaultFontSize?: number;
  defaultOutlineWidth?: number;
  defaultShadowSize?: number;
  defaultFontFamily?: string;
}

export function useCaptionState({
  defaultFontSize = CAPTION_DEFAULTS.fontSize,
  defaultOutlineWidth = CAPTION_DEFAULTS.outlineWidth,
  defaultShadowSize = CAPTION_DEFAULTS.shadowSize,
  defaultFontFamily = CAPTION_DEFAULTS.fontFamily,
}: CaptionStateOptions = {}) {
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
