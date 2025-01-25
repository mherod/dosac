import Image from "next/image";

interface CaptionedImageProps {
  imageUrl: string;
  caption?: string;
  fontSize?: number;
  outlineWidth?: number;
  fontFamily?: string;
}

export function CaptionedImage({
  imageUrl,
  caption,
  fontSize = 18,
  outlineWidth = 1,
  fontFamily = "Arial",
}: CaptionedImageProps) {
  const getTextShadow = (width: number = 1) => {
    const shadows = [];
    for (let x = -width; x <= width; x++) {
      for (let y = -width; y <= width; y++) {
        if (x === 0 && y === 0) continue;
        shadows.push(`${x}px ${y}px 0 #000`);
      }
    }
    return shadows.join(", ");
  };

  return (
    <div className="relative aspect-video">
      <Image
        src={imageUrl}
        alt="Screenshot"
        fill
        className="object-cover"
        sizes="(max-width: 1200px) 100vw, 1200px"
        priority
      />
      {caption && (
        <div
          className="absolute bottom-0 left-0 right-0 flex items-center justify-center px-4 pb-8"
          style={{
            background: "linear-gradient(transparent, rgba(0, 0, 0, 0.3))",
            minHeight: "100px",
          }}
        >
          <p
            style={{
              fontSize: `${fontSize}px`,
              color: "#ffffff",
              textShadow: getTextShadow(outlineWidth),
              textAlign: "center",
              maxWidth: "90%",
              margin: "0 auto",
              wordWrap: "break-word",
              lineHeight: 1.3,
              fontWeight: 500,
              fontFamily,
            }}
          >
            {caption}
          </p>
        </div>
      )}
    </div>
  );
}
