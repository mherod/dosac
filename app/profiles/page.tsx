import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  charactersByDepartment,
  charactersByRole,
  departmentLabels,
  roleLabels,
  type Department,
  type Role,
  type Character,
} from "@/lib/profiles";
import { Badge } from "@/components/ui/badge";

// Components
interface CharacterCardProps extends Omit<Character, "details"> {
  id: string;
  priority?: boolean;
}

function CharacterCard({
  id,
  name,
  description,
  image,
  department,
  role,
  priority = false,
}: CharacterCardProps) {
  return (
    <Link href={`/profiles/${id}`} className="block h-full">
      <Card className="hover:bg-accent transition-colors cursor-pointer group h-full">
        <CardHeader>
          {image && (
            <div className="relative w-full aspect-video mb-4 rounded-lg overflow-hidden">
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
              <Badge variant="secondary" title={departmentLabels[department]}>
                {departmentLabels[department]}
              </Badge>
              <Badge variant="outline" title={roleLabels[role]}>
                {roleLabels[role]}
              </Badge>
            </div>
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}

interface CharacterGroupProps {
  title: string;
  characters: (Character & { id: string })[];
}

function CharacterGroup({ title, characters }: CharacterGroupProps) {
  if (characters.length === 0) return null;

  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {characters.map((character, index) => (
          <CharacterCard
            key={character.id}
            {...character}
            priority={index < 6}
          />
        ))}
      </div>
    </section>
  );
}

/**
 *
 */
export default function ProfilesPage() {
  return (
    <main className="container py-8">
      <h1 className="text-4xl font-bold mb-8">Character Profiles</h1>

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
            ).map(([department, characters]) => (
              <CharacterGroup
                key={department}
                title={departmentLabels[department]}
                characters={characters}
              />
            ))}
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
            ).map(([role, characters]) => (
              <CharacterGroup
                key={role}
                title={roleLabels[role]}
                characters={characters}
              />
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </main>
  );
}
