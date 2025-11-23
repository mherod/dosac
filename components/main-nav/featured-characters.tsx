import Link from "next/link";
import type React from "react";
import { FEATURED_CHARACTERS } from "@/lib/profiles";
import { ProfileImageBadge } from "../profile-image-badge";

/**
 * Server component that displays featured character profile badges
 * @returns A row of overlapping character profile images with links
 */
export function FeaturedCharacters(): React.ReactElement {
  return (
    <div className="flex items-center">
      <div className="flex -space-x-2">
        {FEATURED_CHARACTERS.map((character: { id: string; name: string }) => (
          <Link
            key={character.id}
            href={`/profiles/${character.id}`}
            className="group relative hover:z-10"
            title={character.name}
          >
            <ProfileImageBadge
              characterId={character.id}
              size="sm"
              className="border-2 border-[#1d70b8] transition-colors group-hover:border-white"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
