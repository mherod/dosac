import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ScreenshotGrid } from "@/components/screenshot-grid";
import { getFrameIndex } from "@/lib/frames.server";

interface Props {
  params: {
    id: string;
    episodeId: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const seriesNumber = parseInt(params.id);
  const episodeNumber = parseInt(params.episodeId);

  if (
    isNaN(seriesNumber) ||
    seriesNumber < 1 ||
    seriesNumber > 4 ||
    isNaN(episodeNumber) ||
    episodeNumber < 1 ||
    episodeNumber > 6
  ) {
    return {
      title: "Not Found | Thick of It Quotes",
    };
  }

  return {
    title: `Series ${seriesNumber}, Episode ${episodeNumber} | Thick of It Quotes`,
    description: `View quotes from Series ${seriesNumber}, Episode ${episodeNumber} of The Thick of It`,
  };
}

export default async function EpisodePage({ params }: Props) {
  const seriesNumber = parseInt(params.id);
  const episodeNumber = parseInt(params.episodeId);

  if (
    isNaN(seriesNumber) ||
    seriesNumber < 1 ||
    seriesNumber > 4 ||
    isNaN(episodeNumber) ||
    episodeNumber < 1 ||
    episodeNumber > 6
  ) {
    notFound();
  }

  // Format series and episode numbers to match the frame ID format (e.g., "s01e01")
  const episodeId = `s${seriesNumber.toString().padStart(2, "0")}e${episodeNumber.toString().padStart(2, "0")}`;

  // Get all frames and filter for this episode
  const allFrames = await getFrameIndex();
  const episodeFrames = allFrames.filter(
    (frame) => frame.episode === episodeId,
  );

  return (
    <div className="container py-8">
      <div className="mb-6 space-y-2">
        <a
          href={`/series/${seriesNumber}`}
          className="block text-muted-foreground hover:text-primary"
        >
          ← Back to Series {seriesNumber}
        </a>
        <a
          href={`/series/${seriesNumber}/episode`}
          className="block text-muted-foreground hover:text-primary"
        >
          ← Back to Episodes
        </a>
      </div>
      <h1 className="text-4xl font-bold mb-6">
        Series {seriesNumber}, Episode {episodeNumber}
      </h1>
      <div className="prose prose-invert max-w-none mb-8">
        <p>Browse and search through all quotes from this episode.</p>
      </div>
      <ScreenshotGrid screenshots={episodeFrames} multiselect={true} />
    </div>
  );
}
