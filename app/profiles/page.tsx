import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type Character,
  type Department,
  type Role,
  charactersByDepartment,
  charactersByRole,
  departmentLabels,
  roleLabels,
} from "@/lib/profiles";
import Image from "next/image";
import Link from "next/link";
import type React from "react";

/**
 * Props for the CharacterCard component
 * Extends Character type but omits the details field and adds id and priority
 */
interface CharacterCardProps extends Omit<Character, "details"> {
  /** Unique identifier for the character */
  id: string;
  /** Whether to prioritize loading the character's image */
  priority?: boolean;
}

/**
 * Component for displaying a single character card with image and basic info
 * @param props - The component props
 * @param props.id - Unique identifier for the character
 * @param props.name - Character's name
 * @param props.description - Brief description of the character
 * @param props.image - URL of the character's image
 * @param props.department - Character's department
 * @param props.role - Character's role
 * @param props.priority - Whether to prioritize loading the image
 * @returns A card component linking to the character's profile
 */
function CharacterCard({
  id,
  name,
  description,
  image,
  department,
  role,
  priority = false,
}: CharacterCardProps): React.ReactElement {
  // Use first department and role for display with proper type narrowing
  const primaryDepartment: Department | undefined = Array.isArray(department)
    ? department[0]
    : department;
  const primaryRole: Role | undefined = Array.isArray(role) ? role[0] : role;

  return (
    <Link href={`/profiles/${id}`} className="block h-full">
      <Card className="group h-full cursor-pointer transition-colors hover:bg-accent">
        <CardHeader>
          {image && (
            <div className="relative mb-4 aspect-video w-full overflow-hidden rounded-lg">
              <Image
                src={image}
                alt={`Portrait of ${name}`}
                fill
                className="object-cover transition-transform group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={priority}
              />
            </div>
          )}
          <CardTitle className="line-clamp-2">{name}</CardTitle>
          <CardDescription className="space-y-2">
            <p className="line-clamp-3">{description}</p>
            <div className="flex flex-wrap gap-2 pt-2">
              {primaryDepartment && (
                <Badge
                  variant="secondary"
                  title={departmentLabels[primaryDepartment]}
                >
                  {departmentLabels[primaryDepartment]}
                </Badge>
              )}
              {primaryRole && (
                <Badge variant="outline" title={roleLabels[primaryRole]}>
                  {roleLabels[primaryRole]}
                </Badge>
              )}
            </div>
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}

/**
 * Props for the CharacterGroup component
 */
interface CharacterGroupProps {
  /** Title of the character group section */
  title: string;
  /** Array of characters to display in the group */
  characters: (Character & { id: string })[];
}

/**
 * Component for displaying a group of character cards with a title
 * @param props - The component props
 * @param props.title - Title of the character group section
 * @param props.characters - Array of characters to display
 * @returns A section containing a title and grid of character cards
 */
function CharacterGroup({
  title,
  characters,
}: CharacterGroupProps): React.ReactElement | null {
  if (characters.length === 0) return null;

  return (
    <section className="mb-8">
      <h2 className="mb-4 text-xl font-semibold">{title}</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {characters.map(
          (character: Character & { id: string }, index: number) => (
            <CharacterCard
              key={character.id}
              {...character}
              priority={index < 6}
            />
          ),
        )}
      </div>
    </section>
  );
}

/**
 * Page component for displaying all character profiles
 * Shows profiles grouped by department and role in collapsible sections
 * @returns The profiles page with accordion sections for different groupings
 */
export default function ProfilesPage(): React.ReactElement {
  return (
    <main className="container py-8">
      <h1 className="mb-8 text-4xl font-bold">Character Profiles</h1>

      <Accordion
        type="single"
        collapsible
        defaultValue="by-department"
        className="space-y-4"
      >
        <AccordionItem value="by-department">
          <AccordionTrigger className="text-2xl font-semibold">
            By Department
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            {(
              Object.entries(charactersByDepartment) as [
                Department,
                (Character & { id: string })[],
              ][]
            ).map(
              ([department, characters]: [
                Department,
                (Character & { id: string })[],
              ]) => (
                <CharacterGroup
                  key={department}
                  title={departmentLabels[department]}
                  characters={characters}
                />
              ),
            )}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="by-role">
          <AccordionTrigger className="text-2xl font-semibold">
            By Role
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            {(
              Object.entries(charactersByRole) as [
                Role,
                (Character & { id: string })[],
              ][]
            ).map(
              ([role, characters]: [Role, (Character & { id: string })[]]) => (
                <CharacterGroup
                  key={role}
                  title={roleLabels[role]}
                  characters={characters}
                />
              ),
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </main>
  );
}
