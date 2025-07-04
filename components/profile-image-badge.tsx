import { characters } from "@/lib/profiles";
import { cn } from "@/lib/utils";
import Image from "next/image";
import type React from "react";
import { Suspense } from "react";

type CharacterId = keyof typeof characters;

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
}): React.ReactElement {
  const initials = character.name
    .split(" ")
    .map((word: string) => word[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden rounded-full bg-slate-100 font-medium text-slate-600",
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
function ProfileImageContent({
  characterId,
  size,
  className,
}: ProfileImageBadgeProps): React.ReactElement | null {
  const character = characters[characterId];
  if (!character) return null;

  if (character.image) {
    const imageUrl =
      typeof character.image === "string"
        ? character.image
        : character.image.src;
    return (
      <div
        className={cn(
          "relative inline-flex shrink-0 overflow-hidden rounded-full border border-slate-200",
          sizeClasses[size || "md"],
          className,
        )}
      >
        <Image
          src={imageUrl}
          alt={character.name}
          fill
          className="object-cover object-top transition-transform hover:scale-105"
          sizes={sizesConfig[size || "md"]}
          priority
        />
      </div>
    );
  }

  return (
    <InitialsPlaceholder
      character={character}
      size={size || "md"}
      className={className}
    />
  );
}

/**
 * A reusable profile image badge component that displays a character's image
 * with consistent styling and fallback handling.
 * @param props - The component props
 * @returns A profile badge with image or initials fallback
 */
export function ProfileImageBadge(
  props: ProfileImageBadgeProps,
): React.ReactElement | null {
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
