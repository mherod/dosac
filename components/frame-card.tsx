import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Clapperboard, Clock } from "lucide-react";
import { CaptionedImage } from "@/components/captioned-image";

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
}

export function FrameCard({ screenshot }: FrameCardProps) {
  return (
    <Link href={`/caption/${screenshot.id}`} className="group block">
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg dark:hover:shadow-primary/5">
        <div className="relative">
          <CaptionedImage
            imageUrl={screenshot.blankImageUrl}
            caption={screenshot.speech}
            fontSize={16}
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
          </div>
        </div>
      </Card>
    </Link>
  );
}
