import { notFound } from "next/navigation";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  characters,
  departmentLabels,
  roleLabels,
  type Character,
} from "@/lib/profiles";
import { Separator } from "@/components/ui/separator";

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

  return (
    <main className="container py-8 max-w-7xl">
      <header className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            <div>
              {character.role.map((role) => (
                <p key={role} className="text-xl text-slate-600 font-light">
                  {roleLabels[role]}
                </p>
              ))}
            </div>
            <h1 className="text-5xl font-bold text-slate-900">
              {character.name}
            </h1>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <aside>
          {character.image && (
            <div className="relative w-full aspect-[3/2] mb-8 rounded-lg overflow-hidden border border-slate-200">
              <Image
                src={character.image}
                alt={character.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 33vw"
                priority
              />
            </div>
          )}

          <ContentsList name={character.name} />

          <PersonalInfo character={character} />
        </aside>

        <div className="lg:col-span-2 space-y-16">
          <section id="biography" className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">Biography</h2>
            <div className="prose prose-slate max-w-none">
              <p className="text-lg leading-relaxed text-slate-600">
                {character.description}
              </p>
              {character.occupation && (
                <p className="text-lg leading-relaxed">
                  {character.occupation}
                </p>
              )}
            </div>
          </section>

          <section id="roles" className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">Roles</h2>
            <div className="space-y-6">
              {character.department.map((dept) => (
                <div key={dept} className="space-y-4">
                  <h3 className="text-xl font-semibold text-slate-800">
                    {departmentLabels[dept]}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {character.role.map((role) => (
                      <Badge
                        key={role}
                        variant="secondary"
                        className="px-4 py-1"
                      >
                        {roleLabels[role]}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section id="details" className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">Details</h2>
            <ul className="space-y-4 text-slate-600">
              {character.details.map((detail, index) => (
                <li key={index} className="flex items-start leading-relaxed">
                  <span className="mr-3 text-slate-400">•</span>
                  {detail}
                </li>
              ))}
            </ul>
          </section>

          {character.personal?.background?.career && (
            <section id="career" className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900">
                Career History
              </h2>
              <ul className="space-y-4 text-slate-600">
                {character.personal.background.career.map((position, index) => (
                  <li key={index} className="flex items-start leading-relaxed">
                    <span className="mr-3 text-slate-400">•</span>
                    {position}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
