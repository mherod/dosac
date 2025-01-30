"use client";

interface CaptionTextProps {
  caption?: string;
  fontSize?: number;
  outlineWidth?: number;
  fontFamily?: string;
  relaxedLineBreaks?: boolean;
  className?: string;
  shadowSize?: number;
}

function getTextShadow(outlineWidth: number = 1, shadowSize: number = 0) {
  const shadows = [];

  // Add outline effect
  for (let x = -outlineWidth; x <= outlineWidth; x++) {
    for (let y = -outlineWidth; y <= outlineWidth; y++) {
      if (x === 0 && y === 0) continue;
      shadows.push(`${x}px ${y}px 0 #000`);
    }
  }

  // Add gaussian-like shadow if enabled
  if (shadowSize > 0) {
    shadows.push(`0 ${shadowSize}px ${shadowSize * 2}px rgba(0,0,0,0.7)`);
  }

  return shadows.join(", ");
}

export function CaptionText({
  caption,
  fontSize = 18,
  outlineWidth = 1,
  fontFamily = "Arial",
  relaxedLineBreaks,
  className = "",
  shadowSize = 0,
}: CaptionTextProps) {
  if (!caption) return null;

  const lines = relaxedLineBreaks
    ? caption.split("\n")
    : caption.split(/\s+/).join(" ").split("\n");

  return (
    <div
      className={`whitespace-pre-wrap break-words w-full ${className}`}
      style={{
        fontSize: `${fontSize}px`,
        color: "#ffffff",
        textShadow: getTextShadow(outlineWidth, shadowSize),
        textAlign: "center",
        maxWidth: "90%",
        wordWrap: "break-word",
        lineHeight: 1.2,
        fontWeight: 500,
        fontFamily,
      }}
    >
      {lines.map((line, index) => (
        <p key={index} className="whitespace-pre-wrap break-words w-full">
          {line}
        </p>
      ))}
    </div>
  );
}
