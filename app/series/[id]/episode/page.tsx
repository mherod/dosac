import { Metadata } from "next";
import { notFound } from "next/navigation";

interface Props {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const seriesNumber = parseInt(params.id);

  if (isNaN(seriesNumber) || seriesNumber < 1 || seriesNumber > 4) {
    return {
      title: "Not Found | Thick of It Quotes",
    };
  }

  return {
    title: `Episodes - Series ${seriesNumber} | Thick of It Quotes`,
    description: `Browse all episodes from Series ${seriesNumber} of The Thick of It`,
  };
}

export default function EpisodesPage({ params }: Props) {
  const seriesNumber = parseInt(params.id);

  if (isNaN(seriesNumber) || seriesNumber < 1 || seriesNumber > 4) {
    notFound();
  }

  return (
    <div className="container py-8">
      <div className="mb-6">
        <a
          href={`/series/${seriesNumber}`}
          className="text-muted-foreground hover:text-primary"
        >
          ← Back to Series {seriesNumber}
        </a>
      </div>
      <h1 className="text-4xl font-bold mb-6">
        Episodes - Series {seriesNumber}
      </h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((episodeNumber) => (
          <a
            key={episodeNumber}
            href={`/series/${seriesNumber}/episode/${episodeNumber}`}
            className="block p-6 rounded-lg border bg-card text-card-foreground hover:bg-accent transition-colors"
          >
            <h2 className="text-2xl font-semibold mb-2">
              Episode {episodeNumber}
            </h2>
            <p className="text-muted-foreground">
              View quotes from Episode {episodeNumber}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}
