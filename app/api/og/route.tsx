import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

function getTextShadow(width: number = 1) {
  const shadows = [];
  for (let x = -width; x <= width; x++) {
    for (let y = -width; y <= width; y++) {
      if (x === 0 && y === 0) continue;
      shadows.push(`${x}px ${y}px 0 #000`);
    }
  }
  return shadows.join(", ");
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const caption = searchParams.get("caption") || "No caption provided";
    const episode = searchParams.get("episode") || "";
    const timestamp = searchParams.get("timestamp") || "";
    const imageUrl = searchParams.get("imageUrl") || "";
    const fontSize = parseInt(searchParams.get("fontSize") || "24");
    const outlineWidth = parseInt(searchParams.get("outlineWidth") || "1");
    const fontFamily = searchParams.get("fontFamily") || "Arial";

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "black",
            position: "relative",
          }}
        >
          {/* Background Image */}
          <img
            src={imageUrl}
            alt={caption}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />

          {/* Caption */}
          <div
            style={{
              position: "absolute",
              bottom: "4%",
              left: "50%",
              transform: "translateX(-50%)",
              fontSize: `${fontSize}px`,
              fontWeight: 500,
              textAlign: "center",
              color: "white",
              textShadow: getTextShadow(outlineWidth),
              maxWidth: "90%",
              margin: "0 auto",
              wordWrap: "break-word",
              lineHeight: 1.2,
              fontFamily,
            }}
          >
            {caption}
          </div>

          {/* Episode and Timestamp */}
          <div
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              padding: "10px",
              fontSize: "24px",
              color: "white",
              textShadow: getTextShadow(1),
              textAlign: "right",
              fontFamily,
            }}
          >
            <div>{episode}</div>
            <div>{timestamp}</div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (e) {
    console.error(e);
    return new Response("Failed to generate image", { status: 500 });
  }
}
