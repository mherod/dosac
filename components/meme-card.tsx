import Image from "next/image";
import Link from "next/link";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface MemeCardProps {
  id: string;
  imageUrl: string;
  title: string;
  likes: number;
  comments: number;
}

export function MemeCard({
  id,
  imageUrl,
  title,
  likes,
  comments,
}: MemeCardProps) {
  return (
    <Card className="overflow-hidden">
      <Link href={`/meme/${id}`}>
        <CardContent className="p-0">
          <div className="relative aspect-video">
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </CardContent>
      </Link>
      <CardFooter className="p-4">
        <div className="flex w-full items-center justify-between">
          <h3 className="font-medium line-clamp-1">{title}</h3>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Heart className="h-4 w-4" />
              <span className="ml-2">{likes}</span>
            </Button>
            <Button variant="ghost" size="icon">
              <MessageCircle className="h-4 w-4" />
              <span className="ml-2">{comments}</span>
            </Button>
            <Button variant="ghost" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
