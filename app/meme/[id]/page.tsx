import Image from "next/image";
import { notFound } from "next/navigation";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// This will be replaced with real data fetching later
const getMeme = (id: string) => {
  const meme = {
    id,
    imageUrl:
      "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=800&q=80",
    title: "Classic Scene",
    likes: 342,
    comments: 23,
    description: "One of the most memorable scenes from the show",
    createdAt: "2024-03-20",
  };
  return meme;
};

export default function MemePage({ params }: { params: { id: string } }) {
  const meme = getMeme(params.id);

  if (!meme) {
    notFound();
  }

  return (
    <div className="container max-w-4xl py-8">
      <Card className="overflow-hidden">
        <div className="relative aspect-video">
          <Image
            src={meme.imageUrl}
            alt={meme.title}
            fill
            className="object-cover"
            sizes="(max-width: 1200px) 100vw, 1200px"
          />
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">{meme.title}</h1>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
                <span className="ml-2">{meme.likes}</span>
              </Button>
              <Button variant="ghost" size="icon">
                <MessageCircle className="h-5 w-5" />
                <span className="ml-2">{meme.comments}</span>
              </Button>
              <Button variant="ghost" size="icon">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
          <p className="mt-4 text-muted-foreground">{meme.description}</p>
          <div className="mt-6">
            <h2 className="text-lg font-semibold">Comments</h2>
            <div className="mt-4 rounded-lg bg-muted p-4">
              <p className="text-sm text-muted-foreground">
                No comments yet. Be the first to comment!
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
