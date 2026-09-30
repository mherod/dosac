import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "@vercel/og";

/**
 * Renders a ministerial dossier cover for the site's social previews.
 * The bundled photograph keeps rendering independent of external fetches.
 * @returns A PNG Open Graph image
 */
export async function GET(): Promise<ImageResponse> {
  const [photograph, headingFont, bodyFont] = await Promise.all([
    readFile(join(process.cwd(), "public/characters/malcom.jpg")),
    readFile(join(process.cwd(), "public/fonts/BarlowCondensed-Bold.ttf")),
    readFile(join(process.cwd(), "public/fonts/Barlow-Regular.ttf")),
  ]);
  const image = `data:image/jpeg;base64,${photograph.toString("base64")}`;

  return new ImageResponse(
    <div
      style={{
        background: "#f2efe6",
        color: "#162a38",
        fontFamily: "Barlow",
        display: "flex",
        height: "100%",
        width: "100%",
        position: "relative",
        overflow: "hidden",
        borderTop: "14px solid #b52a32",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          width: 540,
          display: "flex",
          background: "#162a38",
        }}
      >
        {/* ImageResponse requires a native image element. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt="Malcolm Tucker giving evidence at an inquiry"
          width={540}
          height={616}
          style={{ objectFit: "cover", objectPosition: "52% center" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(0deg, #102331 0%, rgba(16,35,49,0) 60%)",
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: 690,
          padding: "42px 54px",
          position: "relative",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              fontFamily: "Barlow Condensed",
              fontSize: 30,
              fontWeight: 700,
              letterSpacing: -1,
            }}
          >
            DOSAC.UK
          </div>
          <div style={{ height: 28, width: 2, background: "#a4aaa7" }} />
          <div style={{ fontSize: 15, letterSpacing: 2 }}>
            THE UNOFFICIAL ARCHIVE
          </div>
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 38,
            fontSize: 15,
            letterSpacing: 4,
            color: "#53636b",
          }}
        >
          BRITISH POLITICS. ABSOLUTE CHAOS.
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 18,
            fontFamily: "Barlow Condensed",
            fontSize: 112,
            fontWeight: 700,
            lineHeight: 0.96,
            letterSpacing: -2,
          }}
        >
          <span>THE</span>
          <span>THICK OF IT</span>
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 27,
            lineHeight: 1.3,
            maxWidth: 480,
          }}
        >
          Iconic quotes. Your captions.
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 12,
            fontSize: 20,
            color: "#53636b",
          }}
        >
          Find a moment. Make a meme.
        </div>
        <div
          style={{
            display: "flex",
            marginTop: "auto",
            borderTop: "2px solid #162a38",
            paddingTop: 18,
            fontSize: 14,
            letterSpacing: 3,
          }}
        >
          MEMES / QUOTES / MINISTERIAL MELTDOWNS
        </div>
      </div>
      <div
        style={{
          display: "flex",
          position: "absolute",
          right: 40,
          bottom: 62,
          transform: "rotate(-8deg)",
          border: "4px solid #f2efe6",
          color: "#f2efe6",
          padding: "15px 22px",
          fontSize: 24,
          fontFamily: "Barlow Condensed",
          fontWeight: 700,
          letterSpacing: 3,
          background: "#b52a32",
        }}
      >
        FOR PUBLIC RELEASE
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Barlow",
          data: bodyFont,
          weight: 400,
          style: "normal",
        },
        {
          name: "Barlow Condensed",
          data: headingFont,
          weight: 700,
          style: "normal",
        },
      ],
      headers: {
        "cache-control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    },
  );
}
