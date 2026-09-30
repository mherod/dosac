import Link from "next/link";
import type React from "react";
import { FEATURED_CHARACTERS } from "@/lib/profiles";
import { ProfileImageBadge } from "../profile-image-badge";

/**
 * Server component that displays featured character profile badges
 * @returns A row of evenly spaced character profile links
 */
export function FeaturedCharacters(): React.ReactElement {
  return (
    <div className="flex items-center">
      <div className="flex flex-wrap gap-1 sm:gap-2">
        {FEATURED_CHARACTERS.map((character: { id: string; name: string }) => (
          <Link
            key={character.id}
            href={`/profiles/${character.id}`}
            className="group flex rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            title={character.name}
          >
            <ProfileImageBadge
              characterId={character.id}
              size="sm"
              className="h-11 min-h-11 w-11 min-w-11 border-white/30 transition-colors group-hover:border-white motion-reduce:transition-none [&_img]:hover:scale-100 [&_img]:motion-reduce:transition-none"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
