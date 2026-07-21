import { SITE_NAME } from "@/lib/constants";
import { generateSingleFrameMetadata } from "@/lib/metadata";
import {
  createPageMetadata,
  DEFAULT_OG_IMAGE_URL,
  serializeStructuredData,
  truncateMetadataText,
  truncatePageTitle,
} from "@/lib/seo";
import type { Screenshot } from "@/lib/types";

const FRAME: Screenshot = {
  id: "s03e04-00-02.000",
  imageUrl: "/frames/s03e04-00-02.000.jpg",
  image2Url: "/frames/s03e04-00-03.000.jpg",
  timestamp: "00-02.000",
  subtitle: "This programme contains very strong language",
  speech: "This programme contains very strong language",
  episode: "S03E04",
  character: "",
};

describe("SEO metadata helpers", () => {
  it("keeps templated page titles within 60 characters", () => {
    const title = truncatePageTitle("A very long route title ".repeat(8));

    expect(`${title} | ${SITE_NAME}`.length).toBeLessThanOrEqual(60);
    expect(title.endsWith("…")).toBe(true);
  });

  it("normalizes whitespace and avoids splitting a trailing word", () => {
    expect(truncateMetadataText("One   two three four", 14)).toBe(
      "One two three…",
    );
  });

  it("creates canonical, share-ready landing-page metadata", () => {
    const metadata = createPageMetadata({
      title: "Characters",
      description: "Browse character profiles.",
      path: "/profiles",
    });

    expect(metadata.alternates?.canonical).toBe("https://dosac.uk/profiles");
    expect(metadata.openGraph?.images).toEqual([
      expect.objectContaining({
        url: DEFAULT_OG_IMAGE_URL,
        width: 1200,
        height: 630,
      }),
    ]);
  });

  it("uses a clean caption canonical regardless of custom caption text", () => {
    const metadata = generateSingleFrameMetadata(
      FRAME,
      "A custom caption from a query parameter",
    );

    expect(metadata.alternates.canonical).toBe(
      "https://dosac.uk/caption/s03e04-00-02.000",
    );
    expect(metadata.description).toContain("S3 E4 at 0:02");
  });
});

describe("structured data integrity", () => {
  it("escapes markup-significant characters in JSON-LD", () => {
    const serialized = serializeStructuredData({ value: "</script>" });

    expect(serialized).toContain("\\u003c/script>");
    expect(serialized).not.toContain("</script>");
  });
});
