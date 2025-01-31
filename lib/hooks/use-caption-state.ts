import { useState } from "react";

interface CaptionStateOptions {
  defaultFontSize?: number;
  defaultOutlineWidth?: number;
  defaultShadowSize?: number;
  defaultFontFamily?: string;
}

export function useCaptionState({
  defaultFontSize = 24,
  defaultOutlineWidth = 1,
  defaultShadowSize = 0,
  defaultFontFamily = "Arial",
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
