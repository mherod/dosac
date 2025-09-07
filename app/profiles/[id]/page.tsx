import { ProfileImageBadge } from "@/components/profile-image-badge";
import { ScreenshotGrid } from "@/components/screenshot-grid";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { getFrameById } from "@/lib/frames.server";
import {
  type Character,
  type CharacterId,
  characters,
  departmentLabels,
  roleLabels,
} from "@/lib/profiles";
import type { Screenshot } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

// Enable PPR for this route
export const experimental_ppr = true;

/**
 * Generates static params for all character profile pages at build time
 * @returns An array of objects containing character IDs for static generation
 */
export async function generateStaticParams(): Promise<{ id: string }[]> {
  return Object.keys(characters).map((id: string) => ({
    id,
  }));
}

function ContentsList({ name: _name }: { name: string }): React.ReactElement {
  return (
    <nav
      className="govuk-contents-list mb-6 border-l-4 border-slate-200 pl-4"
      aria-label="Contents"
    >
      <h2 className="mb-4 text-lg font-semibold">Contents</h2>
      <ol className="space-y-3">
        <li className="flex items-center space-x-2">
          <span className="text-slate-500">-</span>
          <a
            href="#highlights"
            className="text-blue-600 hover:text-blue-800 hover:underline"
          >
            Highlights
          </a>
        </li>
        <li className="flex items-center space-x-2">
          <span className="text-slate-500">-</span>
          <a
            href="#biography"
            className="text-blue-600 hover:text-blue-800 hover:underline"
          >
            Biography
          </a>
        </li>
        <li className="flex items-center space-x-2">
          <span className="text-slate-500">-</span>
          <a
            href="#roles"
            className="text-blue-600 hover:text-blue-800 hover:underline"
          >
            Roles
          </a>
        </li>
        <li className="flex items-center space-x-2">
          <span className="text-slate-500">-</span>
          <a
            href="#details"
            className="text-blue-600 hover:text-blue-800 hover:underline"
          >
            Details
          </a>
        </li>
        <li className="flex items-center space-x-2">
          <span className="text-slate-500">-</span>
          <a
            href="#related"
            className="text-blue-600 hover:text-blue-800 hover:underline"
          >
            Related Profiles
          </a>
        </li>
      </ol>
    </nav>
  );
}

function PersonalInfo({
  character,
}: {
  character: Character;
}): React.ReactElement | null {
  if (!character.personal && !character.origin) return null;

  return (
    <div className="space-y-6 text-sm">
      {character.origin && (
        <div className="border-t pt-4">
          <h3 className="mb-2 font-semibold text-slate-600">Origin</h3>
          <p className="leading-relaxed">
            {[
              character.origin.city,
              character.origin.area,
              character.origin.country,
            ]
              .filter(Boolean)
              .join(", ")}
          </p>
        </div>
      )}

      {character.personal?.age && (
        <div className="border-t pt-4">
          <h3 className="mb-2 font-semibold text-slate-600">Age</h3>
          <p className="leading-relaxed">{character.personal.age} years old</p>
        </div>
      )}

      {character.personal?.background?.education && (
        <div className="border-t pt-4">
          <h3 className="mb-2 font-semibold text-slate-600">Education</h3>
          <p className="leading-relaxed">
            {character.personal.background.education}
          </p>
        </div>
      )}
    </div>
  );
}

interface RelatedProfileCardProps {
  id: CharacterId;
  relationship: string;
}

function RelatedProfileCard({
  id,
  relationship,
}: RelatedProfileCardProps): React.ReactElement | null {
  const profile = characters[id];
  if (!profile) return null;

  return (
    <Link
      href={`/profiles/${id}`}
      className="group flex items-start space-x-4 rounded-lg border border-slate-200 p-4 transition-colors hover:border-slate-300"
    >
      <ProfileImageBadge characterId={id} size="lg" />
      <div className="min-w-0 flex-grow">
        <h3 className="truncate font-semibold text-slate-900 transition-colors group-hover:text-blue-600">
          {profile.name}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-slate-600">
          {relationship}
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {profile.role.slice(0, 2).map((role: string) => (
            <Badge
              key={role}
              variant="secondary"
              className="px-2 py-0.5 text-xs"
            >
              {roleLabels[role as keyof typeof roleLabels]}
            </Badge>
          ))}
        </div>
      </div>
    </Link>
  );
}

function RelatedProfiles({
  relatedProfiles,
}: {
  relatedProfiles?: { id: CharacterId; relationship: string }[];
}): React.ReactElement | null {
  if (!relatedProfiles?.length) return null;

  return (
    <section id="related" className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">Related Profiles</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {relatedProfiles.map(
          (profile: { id: CharacterId; relationship: string }) => (
            <RelatedProfileCard
              key={profile.id}
              id={profile.id}
              relationship={profile.relationship}
            />
          ),
        )}
      </div>
    </section>
  );
}

function CollapsibleSection({
  id,
  title,
  items,
}: {
  id: string;
  title: string;
  items: string[];
}): React.ReactElement {
  return (
    <section id={id} className="space-y-4">
      <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="content">
          <AccordionTrigger className="text-left">
            View all {title.toLowerCase()}
          </AccordionTrigger>
          <AccordionContent>
            <ul className="space-y-4 text-slate-600">
              {items.map((item: string) => (
                <li key={item} className="flex items-start leading-relaxed">
                  <span className="mr-3 text-slate-400">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}

/**
 * Main character profile page component
 * @param props - The component props
 * @param props.params - Promise resolving to route parameters containing character ID
 * @returns The complete character profile page
 */
export default async function CharacterProfile({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<React.ReactElement> {
  const { id } = await params;
  const character = characters[id as keyof typeof characters];

  if (!character) {
    notFound();
  }

  // Get frame data for all highlights and convert to Screenshot type
  const screenshots: Screenshot[] = (
    await Promise.all(
      (character.frameHighlights || []).map(async (highlight: string) => {
        try {
          return await getFrameById(highlight);
        } catch (error) {
          console.warn(
            `Failed to load frame ${highlight} for character ${id}:`,
            error,
          );
          return null;
        }
      }),
    )
  ).filter((frame: Screenshot | null): frame is Screenshot => frame !== null);

  return (
    <main className="container max-w-7xl py-6 lg:py-12">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4 lg:gap-12">
        <aside className="order-2 lg:order-1 lg:col-span-1">
          {character.image && (
            <div className="sticky top-8 mb-8 aspect-[3/4] overflow-hidden rounded-xl border border-slate-200 shadow-lg">
              <Image
                src={character.image}
                alt={character.name}
                className="h-full w-full object-cover object-top"
                priority
                sizes="(max-width: 1024px) 100vw, 25vw"
              />
            </div>
          )}
          <ContentsList name={character.name} />
          <PersonalInfo character={character} />
        </aside>

        <div className="order-1 lg:order-2 lg:col-span-3">
          <header className="mb-12">
            <div className="space-y-6">
              <div>
                <h1 className="mb-4 text-3xl font-bold text-slate-900 lg:text-4xl">
                  {character.name}
                </h1>
                <p className="text-lg leading-relaxed text-slate-600 lg:text-xl">
                  {character.description}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {character.role.map((role: string) => (
                  <Badge
                    key={role}
                    variant="secondary"
                    className="bg-slate-100 px-3 py-1 text-sm font-medium lg:text-base"
                  >
                    {roleLabels[role as keyof typeof roleLabels]}
                  </Badge>
                ))}
              </div>
            </div>
          </header>

          <div className="space-y-12">
            {screenshots.length > 0 && (
              <section id="highlights" className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900">
                  Highlights
                </h2>
                <div className="-mx-4 px-4 sm:mx-0 sm:px-0">
                  <ScreenshotGrid screenshots={screenshots} />
                </div>
              </section>
            )}

            <section id="roles" className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900">Roles</h2>
              <div className="space-y-4">
                {character.department.map((dept: string) => (
                  <div key={dept} className="space-y-3">
                    <h3 className="text-xl font-semibold text-slate-800">
                      {departmentLabels[dept as keyof typeof departmentLabels]}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {character.role.map((role: string) => (
                        <Badge
                          key={role}
                          variant="secondary"
                          className="px-3 py-0.5"
                        >
                          {roleLabels[role as keyof typeof roleLabels]}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <CollapsibleSection
              id="details"
              title="Details"
              items={character.details}
            />

            {character.personal?.background?.career && (
              <CollapsibleSection
                id="career"
                title="Career History"
                items={character.personal.background.career}
              />
            )}
          </div>
        </div>
      </div>

      {character.relatedProfiles && character.relatedProfiles.length > 0 && (
        <div className="mt-12 border-t border-slate-200 pt-8">
          <RelatedProfiles relatedProfiles={character.relatedProfiles} />
        </div>
      )}
    </main>
  );
}
