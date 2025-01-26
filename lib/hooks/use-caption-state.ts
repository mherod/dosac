import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

interface UseCaptionStateProps {
  defaultFontSize?: number;
  defaultOutlineWidth?: number;
  defaultFontFamily?: string;
  initialCaption?: string;
}

export function useCaptionState({
  defaultFontSize = 24,
  defaultOutlineWidth = 1,
  defaultFontFamily = "system-ui",
  initialCaption = "",
}: UseCaptionStateProps = {}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Initialize state from URL parameters or defaults
  const [fontSize, setFontSize] = useState([
    Number(searchParams?.get("fontSize")) || defaultFontSize,
  ]);
  const [outlineWidth, setOutlineWidth] = useState([
    Number(searchParams?.get("outlineWidth")) || defaultOutlineWidth,
  ]);
  const [fontFamily, setFontFamily] = useState(
    searchParams?.get("fontFamily") ?? defaultFontFamily,
  );

  // Update URL when style parameters change
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    // Only update style parameters if they differ from defaults
    if (fontSize[0] !== defaultFontSize) {
      params.set("fontSize", fontSize[0]!.toString());
    } else {
      params.delete("fontSize");
    }
    if (outlineWidth[0] !== defaultOutlineWidth) {
      params.set("outlineWidth", outlineWidth[0]!.toString());
    } else {
      params.delete("outlineWidth");
    }
    if (fontFamily !== defaultFontFamily) {
      params.set("fontFamily", fontFamily);
    } else {
      params.delete("fontFamily");
    }

    // Preserve existing parameters
    const text = searchParams?.get("text");
    const range = searchParams?.get("range");
    if (text) params.set("text", text);
    if (range) params.set("range", range);

    const queryString = params.toString();
    const newUrl = queryString ? `?${queryString}` : window.location.pathname;
    router.replace(newUrl, { scroll: false });
  }, [
    fontSize,
    outlineWidth,
    fontFamily,
    router,
    defaultFontSize,
    defaultOutlineWidth,
    defaultFontFamily,
    searchParams,
  ]);

  const handleShare = (captionText: string) => {
    const params = new URLSearchParams(window.location.search);
    params.set("text", encodeURIComponent(captionText));

    const path = window.location.pathname;
    const search = `?${params.toString()}`;
    const pathToEncode = `${path}${search}`;

    const base64Url = Buffer.from(pathToEncode)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");
    const shareUrl = `${window.location.origin}/share/${base64Url}`;
    navigator.clipboard.writeText(shareUrl);
  };

  return {
    fontSize,
    setFontSize,
    outlineWidth,
    setOutlineWidth,
    fontFamily,
    setFontFamily,
    handleShare,
  };
}
