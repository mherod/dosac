import { notFound } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  characters,
  departmentLabels,
  roleLabels,
  type Character,
  type CharacterId,
} from "@/lib/profiles";
import { ScreenshotGrid } from "@/components/screenshot-grid";
import { getFrameById } from "@/lib/frames.server";
import { type Screenshot } from "@/lib/types";
import Link from "next/link";
import { ProfileImageBadge } from "@/components/profile-image-badge";

// Enable PPR for this route
export const experimental_ppr = true;

/**
 * Generates static params for all character profile pages at build time
 * @returns An array of objects containing character IDs for static generation
 */
export async function generateStaticParams() {
  return Object.keys(characters).map((id) => ({
    id,
  }));
}

function ContentsList({ name }: { name: string }) {
  return (
    <nav
      className="govuk-contents-list mb-6 border-l-4 border-slate-200 pl-4"
      aria-label="Contents"
    >
      <h2 className="text-lg font-semibold mb-4">Contents</h2>
      <ol className="space-y-3">
        <li className="flex items-center space-x-2">
          <span className="text-slate-500">-</span>
          <a
            href="#highlights"
            className="text-blue-600 hover:underline hover:text-blue-800"
          >
            Highlights
          </a>
        </li>
        <li className="flex items-center space-x-2">
          <span className="text-slate-500">-</span>
          <a
            href="#biography"
            className="text-blue-600 hover:underline hover:text-blue-800"
          >
            Biography
          </a>
        </li>
        <li className="flex items-center space-x-2">
          <span className="text-slate-500">-</span>
          <a
            href="#roles"
            className="text-blue-600 hover:underline hover:text-blue-800"
          >
            Roles
          </a>
        </li>
        <li className="flex items-center space-x-2">
          <span className="text-slate-500">-</span>
          <a
            href="#details"
            className="text-blue-600 hover:underline hover:text-blue-800"
          >
            Details
          </a>
        </li>
        <li className="flex items-center space-x-2">
          <span className="text-slate-500">-</span>
          <a
            href="#related"
            className="text-blue-600 hover:underline hover:text-blue-800"
          >
            Related Profiles
          </a>
        </li>
      </ol>
    </nav>
  );
}

function PersonalInfo({ character }: { character: Character }) {
  if (!character.personal && !character.origin) return null;

  return (
    <div className="space-y-6 text-sm">
      {character.origin && (
        <div className="border-t pt-4">
          <h3 className="font-semibold text-slate-600 mb-2">Origin</h3>
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
          <h3 className="font-semibold text-slate-600 mb-2">Age</h3>
          <p className="leading-relaxed">{character.personal.age} years old</p>
        </div>
      )}

      {character.personal?.background?.education && (
        <div className="border-t pt-4">
          <h3 className="font-semibold text-slate-600 mb-2">Education</h3>
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

function RelatedProfileCard({ id, relationship }: RelatedProfileCardProps) {
  const profile = characters[id];
  if (!profile) return null;

  return (
    <Link
      href={`/profiles/${id}`}
      className="group flex items-start space-x-4 p-4 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
    >
      <ProfileImageBadge characterId={id} size="lg" />
      <div className="flex-grow min-w-0">
        <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
          {profile.name}
        </h3>
        <p className="text-sm text-slate-600 mt-1 line-clamp-2">
          {relationship}
        </p>
        <div className="flex flex-wrap gap-2 mt-2">
          {profile.role.slice(0, 2).map((role) => (
            <Badge
              key={role}
              variant="secondary"
              className="text-xs px-2 py-0.5"
            >
              {roleLabels[role]}
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
}) {
  if (!relatedProfiles?.length) return null;

  return (
    <section id="related" className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">Related Profiles</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {relatedProfiles.map((profile) => (
          <RelatedProfileCard
            key={profile.id}
            id={profile.id}
            relationship={profile.relationship}
          />
        ))}
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
}) {
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
              {items.map((item, index) => (
                <li key={index} className="flex items-start leading-relaxed">
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
}) {
  const { id } = await params;
  const character = characters[id as keyof typeof characters];

  if (!character) {
    notFound();
  }

  // Get frame data for all highlights and convert to Screenshot type
  const screenshots: Screenshot[] = (
    await Promise.all(
      (character.frameHighlights || []).map(async (highlight) => {
        try {
          const frame = await getFrameById(highlight);
          return {
            id: frame.id,
            imageUrl: frame.imageUrl,
            image2Url: frame.image2Url,
            speech: frame.speech,
            timestamp: frame.timestamp,
          };
        } catch (error) {
          console.warn(
            `Failed to load frame ${highlight} for character ${id}:`,
            error,
          );
          return null;
        }
      }),
    )
  ).filter((frame): frame is Screenshot => frame !== null);

  return (
    <main className="container py-6 max-w-7xl">
      <header className="flex flex-col lg:flex-row gap-8 mb-12 items-start">
        <div className="flex-grow">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {character.role.map((role) => (
                <Badge
                  key={role}
                  variant="secondary"
                  className="px-4 py-1 text-base font-medium"
                >
                  {roleLabels[role]}
                </Badge>
              ))}
            </div>
            <div className="space-y-3">
              <h1 className="text-4xl font-bold text-slate-900">
                {character.name}
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed max-w-3xl">
                {character.description}
              </p>
            </div>
          </div>
        </div>
        {character.image && (
          <div className="w-full lg:w-80 aspect-[3/2] rounded-lg overflow-hidden border border-slate-200 shrink-0 shadow-lg">
            <Image
              src={character.image}
              alt={character.name}
              width={320}
              height={213}
              className="object-cover w-full h-full"
              priority
            />
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <ContentsList name={character.name} />
          <PersonalInfo character={character} />
        </aside>

        <div className="lg:col-span-3 space-y-12">
          {screenshots.length > 0 && (
            <section id="highlights" className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900">Highlights</h2>
              <div className="-mx-4 px-4 sm:mx-0 sm:px-0">
                <ScreenshotGrid screenshots={screenshots} />
              </div>
            </section>
          )}

          <section id="roles" className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Roles</h2>
            <div className="space-y-4">
              {character.department.map((dept) => (
                <div key={dept} className="space-y-3">
                  <h3 className="text-xl font-semibold text-slate-800">
                    {departmentLabels[dept]}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {character.role.map((role) => (
                      <Badge
                        key={role}
                        variant="secondary"
                        className="px-3 py-0.5"
                      >
                        {roleLabels[role]}
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

      {character.relatedProfiles && character.relatedProfiles.length > 0 && (
        <div className="mt-12 pt-8 border-t border-slate-200">
          <RelatedProfiles relatedProfiles={character.relatedProfiles} />
        </div>
      )}
    </main>
  );
}
