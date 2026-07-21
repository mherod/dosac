import { ImageResponse } from "@vercel/og";

/**
 * Serves the default 1200x630 social card used by public routes.
 * @returns A PNG Open Graph image
 */
export function GET(): ImageResponse {
  return new ImageResponse(
    <div
      style={{
        alignItems: "stretch",
        background: "#0b0c0c",
        color: "#ffffff",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "space-between",
        padding: "72px 80px",
        width: "100%",
      }}
    >
      <div
        style={{
          background: "#1d70b8",
          display: "flex",
          height: "14px",
          width: "240px",
        }}
      />
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: "72px", fontWeight: 700, lineHeight: 1.05 }}>
          The Thick of It
        </div>
        <div
          style={{
            color: "#b1b4b6",
            display: "flex",
            fontSize: "38px",
            marginTop: "22px",
          }}
        >
          Memes, quotes and caption editor
        </div>
      </div>
      <div
        style={{
          alignItems: "center",
          borderTop: "2px solid #505a5f",
          display: "flex",
          fontSize: "30px",
          justifyContent: "space-between",
          paddingTop: "28px",
        }}
      >
        <span>DOSAC.UK</span>
        <span style={{ color: "#b1b4b6" }}>Ministerial archive</span>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      headers: {
        "cache-control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    },
  );
}
