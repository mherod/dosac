import Image from "next/image";
import Link from "next/link";
import type { Screenshot } from "@/lib/types";
import { formatTimestamp } from "@/lib/utils";

export interface ExtendedFrame extends Omit<Screenshot, "episode"> {
  text: string;
  season: number;
  episode: number;
  speaker?: string;
  src?: string;
}

interface SearchResultCardProps {
  frame: ExtendedFrame;
  query?: string;
}

/**
 * Highlights search query in text
 */
function highlightText(text: string, query: string): React.ReactElement {
  if (!query) {
    return <>{text}</>;
  }

  const parts = text.split(new RegExp(`(${query})`, "gi"));

  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={`${part}-${i}`} className="bg-yellow-200 font-semibold">
            {part}
          </mark>
        ) : (
          <span key={`${part}-${i}`}>{part}</span>
        ),
      )}
    </>
  );
}

/**
 * Search result card component
 */
export function SearchResultCard({ frame, query }: SearchResultCardProps) {
  const text = frame.text || "";
  const truncatedText =
    text.length > 150 ? `${text.substring(0, 150)}...` : text;

  return (
    <Link
      href={`/caption/${frame.id}`}
      className="group block overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
      prefetch={true}
      scroll={false}
    >
      <div className="relative aspect-video overflow-hidden bg-gray-100">
        {frame.imageUrl && (
          <Image
            src={frame.imageUrl}
            alt={text || "Screenshot"}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            unoptimized
          />
        )}
      </div>

      <div className="p-4">
        <div className="mb-2 flex items-center gap-2 text-xs text-gray-500">
          <span className="font-semibold">
            S{frame.season}E{frame.episode}
          </span>
          <span>•</span>
          <span>{formatTimestamp(frame.timestamp)}</span>
        </div>

        <p className="text-sm leading-relaxed text-gray-700">
          {highlightText(truncatedText, query || "")}
        </p>

        {frame.speaker && (
          <p className="mt-2 text-xs font-medium text-gray-600">
            — {frame.speaker}
          </p>
        )}
      </div>
    </Link>
  );
}
