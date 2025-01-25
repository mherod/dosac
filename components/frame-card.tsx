import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Clapperboard, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

function formatEpisodeString(episodeId: string): string {
  // Format from "s01e02" to "Series 1 Episode 2"
  const match = episodeId.match(/^s(\d{2})e(\d{2})$/i);
  if (!match || !match[1] || !match[2]) return episodeId;

  return `Series ${parseInt(match[1])} Episode ${parseInt(match[2])}`;
}

function formatTimestamp(timestamp: string): string {
  // Format from "00-03.120" to "0:03"
  const match = timestamp.match(/^(\d{2})-(\d{2})\.\d{3}$/);
  if (!match || !match[1] || !match[2]) return timestamp;

  const minutes = parseInt(match[1]);
  const seconds = parseInt(match[2]);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

type Screenshot = {
  id: string;
  imageUrl: string;
  blankImageUrl: string;
  timestamp: string;
  subtitle: string;
  speech: string;
  episode: string;
};

interface FrameCardProps {
  screenshot: Screenshot;
  priority?: boolean;
}

export function FrameCard({ screenshot, priority = false }: FrameCardProps) {
  return (
    <Link href={`/caption/${screenshot.id}`} className="group block">
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg dark:hover:shadow-primary/5">
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={screenshot.imageUrl}
            alt={screenshot.timestamp}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={priority}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
        <div className="p-5">
          <div className="flex flex-col space-y-3">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2 rounded-full bg-primary/10 px-3 py-1">
                <Clapperboard className="h-3.5 w-3.5" />
                <span className="font-medium">
                  {formatEpisodeString(screenshot.episode)}
                </span>
              </div>
              <div className="flex items-center space-x-2 rounded-full bg-primary/10 px-3 py-1">
                <Clock className="h-3.5 w-3.5" />
                <span className="font-medium">
                  {formatTimestamp(screenshot.timestamp)}
                </span>
              </div>
            </div>
            <figure className="relative">
              <div className="absolute -left-1 -top-1 text-3xl text-primary/20 font-serif">
                "
              </div>
              <blockquote
                className={cn(
                  "pl-4 font-medium text-base/relaxed",
                  "group-hover:text-primary transition-colors duration-300",
                )}
              >
                <p className="line-clamp-2">{screenshot.speech}</p>
              </blockquote>
              <div className="absolute -bottom-3 right-1 text-3xl text-primary/20 font-serif rotate-180">
                "
              </div>
            </figure>
          </div>
        </div>
      </Card>
    </Link>
  );
}
