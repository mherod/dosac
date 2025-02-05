import Image from "next/image";
import { cn } from "@/lib/utils";
import { characters, type CharacterId } from "@/lib/profiles";
import { getProfileImage } from "@/lib/utils";
import { Suspense } from "react";

/**
 * Props for the ProfileImageBadge component
 */
export interface ProfileImageBadgeProps {
  /** The ID of the character to display */
  characterId: CharacterId;
  /** The size of the badge */
  size?: "sm" | "md" | "lg";
  /** Additional CSS classes to apply */
  className?: string;
}

const sizeClasses = {
  sm: "h-12 w-12 min-w-[3rem] min-h-[3rem]",
  md: "h-16 w-16 min-w-[4rem] min-h-[4rem]",
  lg: "h-20 w-20 min-w-[5rem] min-h-[5rem]",
} as const;

const sizesConfig = {
  sm: "48px",
  md: "64px",
  lg: "80px",
} as const;

/**
 * Renders a placeholder with the character's initials when no image is available
 * @param props - The component props
 * @param props.character - The character data
 * @param props.size - The size of the badge
 * @param props.className - Additional CSS classes
 * @returns A placeholder badge with the character's initials
 */
function InitialsPlaceholder({
  character,
  size,
  className,
}: {
  character: (typeof characters)[CharacterId];
  size: keyof typeof sizeClasses;
  className?: string;
}) {
  const initials = character.name
    .split(" ")
    .map((word) => word[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      className={cn(
        "relative rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-medium overflow-hidden",
        "inline-flex shrink-0 border border-slate-200",
        {
          "text-sm": size === "sm",
          "text-base": size === "md",
          "text-lg": size === "lg",
        },
        sizeClasses[size],
        className,
      )}
      title={character.name}
    >
      <span className="flex-none select-none">{initials}</span>
    </div>
  );
}

/**
 * Renders the profile image content with proper image loading and fallback
 * @param props - The component props
 * @returns The profile image or initials placeholder
 */
async function ProfileImageContent({
  characterId,
  size,
  className,
}: ProfileImageBadgeProps) {
  const character = characters[characterId];
  if (!character) return null;

  let imageUrl: string | undefined;
  try {
    imageUrl = await getProfileImage(characterId);
  } catch (error) {
    console.error(`Failed to load image for character ${characterId}:`, error);
  }

  if (!imageUrl) {
    return (
      <InitialsPlaceholder
        character={character}
        size={size || "md"}
        className={className}
      />
    );
  }

  return (
    <div
      className={cn(
        "relative rounded-full overflow-hidden shrink-0 inline-flex border border-slate-200",
        sizeClasses[size || "md"],
        className,
      )}
    >
      <Image
        src={imageUrl}
        alt={character.name}
        fill
        className="object-cover hover:scale-105 transition-transform"
        sizes={sizesConfig[size || "md"]}
        priority
      />
    </div>
  );
}

/**
 * A reusable profile image badge component that displays a character's image
 * with consistent styling and fallback handling. Uses frame highlights as fallback
 * when no profile image is available.
 * @param props - The component props
 * @returns A profile badge with image or initials fallback
 */
export function ProfileImageBadge(props: ProfileImageBadgeProps) {
  const character = characters[props.characterId];
  if (!character) return null;

  return (
    <Suspense
      fallback={
        <InitialsPlaceholder
          character={character}
          size={props.size || "md"}
          className={props.className}
        />
      }
    >
      <ProfileImageContent {...props} />
    </Suspense>
  );
}
