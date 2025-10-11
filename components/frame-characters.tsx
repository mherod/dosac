import type { CharacterInFrame } from "@/lib/frame-characters.server";
import { Users } from "lucide-react";

/**
 * Props for the FrameCharacters component
 */
interface FrameCharactersProps {
  /** Array of characters detected in the frame */
  characters: CharacterInFrame[] | null;
  /** Optional CSS class name */
  className?: string;
}

/**
 * Displays characters detected in a frame with their confidence scores
 * @param props - Component props
 * @param props.characters - Array of characters with confidence scores
 * @param props.className - Optional CSS class name
 * @returns React component displaying character tags
 */
export function FrameCharacters({
  characters,
  className = "",
}: FrameCharactersProps): React.ReactElement | null {
  if (!characters || characters.length === 0) {
    return null;
  }

  return (
    <div
      className={`flex flex-wrap items-center gap-2 rounded-lg bg-secondary/50 p-3 ${className}`}
    >
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Users className="h-4 w-4" />
        <span>Characters:</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {characters.map((char, index) => (
          <div
            key={`${char.name}-${index}`}
            className="flex items-center gap-1.5 rounded-md bg-primary/10 px-3 py-1.5 text-sm font-medium transition-colors hover:bg-primary/20"
            title={`Confidence: ${(char.confidence * 100).toFixed(1)}%`}
          >
            <span>{char.name}</span>
            {char.confidence < 0.9 && (
              <span className="text-xs text-muted-foreground">
                ({(char.confidence * 100).toFixed(0)}%)
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
