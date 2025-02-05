import Link from "next/link";
import { ProfileImageBadge } from "../profile-image-badge";
import { FEATURED_CHARACTERS } from "@/lib/profiles";

/**
 * Displays a row of profile badges for featured characters in the navigation
 * @returns A row of profile badges with hover effects and links to character profiles
 */
export default function ProfileBadges() {
  return (
    <div className="flex -space-x-2">
      {FEATURED_CHARACTERS.map((character) => (
        <Link
          key={character.id}
          href={`/profiles/${character.id}`}
          className="group relative hover:z-10"
          title={character.name}
        >
          <ProfileImageBadge
            characterId={character.id}
            size="sm"
            className="border-2 border-[#1d70b8] group-hover:border-white transition-colors"
          />
        </Link>
      ))}
    </div>
  );
}
