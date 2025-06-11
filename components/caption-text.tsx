"use client";

/**
 * Props for the CaptionText component
 */
interface CaptionTextProps {
  /** The text content to display as a caption */
  caption?: string;
  /** Font size in pixels */
  fontSize?: number;
  /** Width of the text outline in pixels */
  outlineWidth?: number;
  /** Font family to use for the caption text */
  fontFamily?: string;
  /** Whether to preserve all line breaks (true) or collapse whitespace (false) */
  relaxedLineBreaks?: boolean;
  /** Additional CSS classes to apply to the container */
  className?: string;
  /** Size of the drop shadow in pixels (0 to disable) */
  shadowSize?: number;
}

/**
 * Generates CSS text-shadow value for caption outline and drop shadow effects
 * @param outlineWidth - Width of the text outline in pixels
 * @param shadowSize - Size of the drop shadow in pixels
 * @returns CSS text-shadow property value string
 */
function getTextShadow(
  outlineWidth: number = 1,
  shadowSize: number = 0,
): string {
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

/**
 * A component for rendering caption text with customisable styling and effects
 *
 * Features:
 * - Customisable font size and family
 * - Text outline effect
 * - Optional drop shadow
 * - Line break handling options
 * - Responsive text wrapping
 *
 * @param props - The component props
 * @param props.caption - The text content to display as a caption
 * @param props.fontSize - Font size in pixels (default: 18)
 * @param props.outlineWidth - Width of the text outline in pixels (default: 1)
 * @param props.fontFamily - Font family to use for the caption text (default: "Arial")
 * @param props.relaxedLineBreaks - Whether to preserve all line breaks (true) or collapse whitespace (false)
 * @param props.className - Additional CSS classes to apply to the container
 * @param props.shadowSize - Size of the drop shadow in pixels (0 to disable)
 * @returns The rendered caption component, or null if no caption is provided
 *
 * @example
 * ```tsx
 * <CaptionText
 *   caption="Hello world"
 *   fontSize={24}
 *   outlineWidth={2}
 *   shadowSize={4}
 * />
 * ```
 */
export function CaptionText({
  caption,
  fontSize = 18,
  outlineWidth = 1,
  fontFamily = "Arial",
  relaxedLineBreaks,
  className = "",
  shadowSize = 0,
}: CaptionTextProps): React.ReactElement | null {
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
      {lines.map((line: string, index: number) => (
        <p key={index} className="whitespace-pre-wrap break-words w-full">
          {line}
        </p>
      ))}
    </div>
  );
}
