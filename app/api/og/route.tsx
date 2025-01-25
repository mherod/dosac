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
    const imageUrlString = searchParams.get("imageUrl") || "";
    const fontSize = parseInt(searchParams.get("fontSize") || "24");
    const outlineWidth = parseInt(searchParams.get("outlineWidth") || "1");
    const fontFamily = searchParams.get("fontFamily") || "Arial";

    // Ensure we're using HTTPS and the correct domain
    const imageUrl = new URL(imageUrlString);
    imageUrl.protocol = "https";
    imageUrl.hostname = "dosac.herod.dev";

    // Fetch image
    const imageResponse = await fetch(imageUrl.toString());
    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${imageResponse.statusText}`);
    }

    // Convert image to base64
    const imageBuffer = await imageResponse.arrayBuffer();
    const base64Image = `data:${imageResponse.headers.get("content-type") || "image/jpeg"};base64,${Buffer.from(imageBuffer).toString("base64")}`;

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
            src={base64Image}
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

          {/* Caption Container */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              paddingBottom: "4%",
            }}
          >
            {/* Caption Text */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                fontSize: `${fontSize}px`,
                fontWeight: 500,
                color: "#ffffff",
                textShadow: getTextShadow(outlineWidth),
                textAlign: "center",
                maxWidth: "90%",
                margin: "0 auto",
                wordWrap: "break-word",
                lineHeight: 1.2,
                fontFamily,
              }}
            >
              {caption.split("\n").map((line, i) => (
                <span key={i} style={{ margin: 0 }}>
                  {line}
                </span>
              ))}
            </div>
          </div>

          {/* Episode and Timestamp */}
          <div
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              padding: "10px",
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              fontSize: "16px",
              color: "white",
              textShadow: getTextShadow(1),
              textAlign: "right",
              fontFamily,
            }}
          >
            <span>{episode}</span>
            <span>{timestamp}</span>
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
    return new Response(
      `Failed to generate image: ${e instanceof Error ? e.message : "Unknown error"}`,
      { status: 500 },
    );
  }
}
