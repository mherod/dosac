import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProfileImageBadge } from "@/components/profile-image-badge";
import { ScreenshotGrid } from "@/components/screenshot-grid";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { formatPageTitle } from "@/lib/constants";
import type { Policy } from "@/lib/policies";
import { getServerPolicies } from "@/lib/policies.server";
import { getFrameById } from "@/lib/frames.server";
import {
  type Character,
  type CharacterId,
  characters,
  type Department,
  departmentLabels,
  type Role,
  roleLabels,
} from "@/lib/profiles";
import { episodeInfo, type EpisodeInfo } from "@/lib/episode-info";
import { generateCharacterStructuredData } from "@/lib/structured-data";
import type { Screenshot } from "@/lib/types";

interface ProfileSource {
  label: string;
  href: string;
  note: string;
}

interface ProfileEpisodeReference {
  airDate: string;
  href: string;
  policyAreas: string[];
  summary: string;
  title: string;
}

const PROFILE_SOURCES: ProfileSource[] = [
  {
    label: "BBC programme guide",
    href: "https://www.bbc.co.uk/programmes/b006qgrd/episodes/guide",
    note: "Primary episode listings, broadcast order, and official summaries.",
  },
  {
    label: "British Comedy Guide episode archive",
    href: "https://www.comedy.co.uk/tv/the_thick_of_it/episodes/",
    note: "Independent episode summaries used to cross-check story arcs.",
  },
  {
    label: "The Missing DoSAC Files",
    href: "https://books.google.com/books/about/The_Thick_of_It.html?id=dUqpSgAACAAJ",
    note: "Published tie-in material for extended in-universe detail.",
  },
  {
    label: "Local VTT transcripts and frame speech",
    href: "/search",
    note: "Internal subtitle, frame, and speech data used for quote-level checks.",
  },
  {
    label: "The Thick of It Wiki",
    href: "https://thethickofit.fandom.com/wiki/The_Thick_of_It_Wiki",
    note: "Secondary reference only; useful for connective tissue and aliases.",
  },
];

type SummaryPart = EpisodeInfo["shortSummary"][number];

/**
 * Generates static params for all character profile pages at build time
 * @returns An array of objects containing character IDs for static generation
 */
export async function generateStaticParams(): Promise<{ id: string }[]> {
  return Object.keys(characters).map((id: string) => ({
    id,
  }));
}

/**
 * Generates metadata for the character profile page
 * @param props - The component props
 * @param props.params - Promise resolving to route parameters containing character ID
 * @returns Metadata object with title and description
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const character = characters[id];

  if (!character) {
    return {
      title: "Character Not Found",
      description: "The requested character profile could not be found.",
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://dosac.uk";
  const pageUrl = new URL(`/profiles/${id}`, baseUrl);
  const primaryRole = character.role[0]
    ? roleLabels[character.role[0] as Role]
    : "Character";
  const primaryDepartment = character.department[0]
    ? departmentLabels[character.department[0] as Department]
    : "";

  return {
    title: formatPageTitle(character.name),
    description: `${character.description} ${primaryRole}${primaryDepartment ? ` in ${primaryDepartment}` : ""} from The Thick of It. View highlights and create memes featuring ${character.name}.`,
    openGraph: {
      title: `${character.name} - The Thick of It Character Profile`,
      description: `${character.description} ${primaryRole}${primaryDepartment ? ` in ${primaryDepartment}` : ""} from The Thick of It.`,
      url: pageUrl.toString(),
      type: "profile",
      siteName: "DOSAC.UK",
      locale: "en_GB",
      images: [
        {
          url:
            typeof character.image === "string"
              ? character.image
              : `${baseUrl}/og-character-${id}.jpg`,
          width: 1200,
          height: 630,
          alt: `${character.name} - The Thick of It Character`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${character.name} - The Thick of It Character Profile`,
      description: `${character.description} ${primaryRole}${primaryDepartment ? ` in ${primaryDepartment}` : ""} from The Thick of It.`,
      images: [
        typeof character.image === "string"
          ? character.image
          : `${baseUrl}/og-character-${id}.jpg`,
      ],
    },
    alternates: {
      canonical: pageUrl.toString(),
    },
    other: {
      "og:image:width": "1200",
      "og:image:height": "630",
    },
  };
}

function getSummaryText(parts: SummaryPart[]): string {
  return parts
    .map((part: SummaryPart) => {
      if (typeof part === "string") return part;
      return part.text;
    })
    .join("");
}

function summaryMentionsProfile(
  parts: SummaryPart[] | undefined,
  profileId: CharacterId,
): boolean {
  return (
    parts?.some(
      (part: SummaryPart) =>
        typeof part !== "string" && part.profileId === profileId,
    ) ?? false
  );
}

/**
 * Builds the episode cross-reference list used by character profiles.
 * The source material comes from the local episode guide so profile pages can
 * expose the same lore timeline already used elsewhere in the site.
 * @param profileId - Character profile identifier to search for
 * @returns Episode references where this character is mentioned in summaries
 */
function getProfileEpisodeReferences(
  profileId: CharacterId,
): ProfileEpisodeReference[] {
  return episodeInfo
    .filter(
      (episode: EpisodeInfo) =>
        summaryMentionsProfile(episode.shortSummary, profileId) ||
        summaryMentionsProfile(episode.longSummary, profileId),
    )
    .map((episode: EpisodeInfo) => ({
      airDate: episode.airDate,
      href: `/series/${episode.seriesNumber}/episode/${episode.episodeNumber}`,
      policyAreas: episode.policyAreas ?? [],
      summary: getSummaryText(episode.shortSummary),
      title: episode.title,
    }));
}

interface ContentsListProps {
  hasCareer: boolean;
  hasHighlights: boolean;
  hasPolicyRecord: boolean;
  hasRelatedProfiles: boolean;
}

function ContentsList({
  hasCareer,
  hasHighlights,
  hasPolicyRecord,
  hasRelatedProfiles,
}: ContentsListProps): React.ReactElement {
  const items = [
    { href: "#dossier", label: "Lore Dossier" },
    { href: "#record-in-office", label: "Record in Office" },
    ...(hasHighlights ? [{ href: "#highlights", label: "Highlights" }] : []),
    { href: "#roles", label: "Roles" },
    ...(hasPolicyRecord
      ? [{ href: "#policy-record", label: "Policy Record" }]
      : []),
    { href: "#timeline", label: "Episode Timeline" },
    ...(hasHighlights
      ? [{ href: "#transcript-evidence", label: "Transcript Evidence" }]
      : []),
    { href: "#details", label: "Details" },
    ...(hasCareer ? [{ href: "#career", label: "Career History" }] : []),
    { href: "#sources", label: "Source Notes" },
    ...(hasRelatedProfiles
      ? [{ href: "#related", label: "Related Profiles" }]
      : []),
  ];

  return (
    <nav
      className="govuk-contents-list mb-6 border-l-4 border-slate-200 pl-4"
      aria-label="Contents"
    >
      <h2 className="mb-4 text-lg font-semibold">Contents</h2>
      <ol className="space-y-3">
        {items.map((item: { href: string; label: string }) => (
          <li key={item.href} className="flex items-center space-x-2">
            <span className="text-slate-500">-</span>
            <a
              href={item.href}
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              {item.label}
            </a>
          </li>
        ))}
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

interface ProfileFact {
  label: string;
  value: string;
}

function joinDefined(values: (string | undefined)[]): string {
  return values.filter(Boolean).join(", ");
}

function getSpouseFact(character: Character): string {
  const spouse = character.personal?.family?.spouse;

  if (!spouse) return "";
  if (spouse === true) return "Recorded";

  return joinDefined([spouse.name, spouse.occupation]);
}

function getChildrenFact(character: Character): string {
  const children = character.personal?.family?.children;

  if (!children) return "";
  if (children === true) return "Recorded";

  return joinDefined([
    children.daughters
      ? `${children.daughters.toString()} daughter${children.daughters === 1 ? "" : "s"}`
      : undefined,
    children.sons
      ? `${children.sons.toString()} son${children.sons === 1 ? "" : "s"}`
      : undefined,
  ]);
}

function getCharacterFacts(character: Character): ProfileFact[] {
  const background = character.personal?.background;
  const facts: ProfileFact[] = [
    { label: "Full name", value: character.fullName },
    { label: "Occupation", value: character.occupation ?? "" },
    {
      label: "Department",
      value: character.department
        .map((department: Department) => departmentLabels[department])
        .join(", "),
    },
    {
      label: "Role",
      value: character.role.map((role: Role) => roleLabels[role]).join(", "),
    },
    { label: "Party", value: character.party ?? background?.party ?? "" },
    { label: "Affiliation", value: background?.affiliation ?? "" },
    { label: "Education", value: background?.education ?? "" },
    { label: "Previous career", value: background?.previousCareer ?? "" },
    { label: "Interests", value: background?.interests?.join(", ") ?? "" },
    { label: "Spouse", value: getSpouseFact(character) },
    { label: "Children", value: getChildrenFact(character) },
    {
      label: "Origin",
      value: joinDefined([
        character.origin?.city,
        character.origin?.area,
        character.origin?.country,
      ]),
    },
  ];

  return facts.filter((fact: ProfileFact) => fact.value.trim().length > 0);
}

/**
 * Renders a compact lore dossier from profile metadata.
 * This gives every profile a consistent in-universe summary before the longer
 * details accordion, including department, role, party, and provenance notes.
 * @param props - Component props
 * @param props.character - Character profile data
 * @returns Character lore dossier section
 */
function LoreDossier({
  character,
}: {
  character: Character;
}): React.ReactElement {
  const facts = getCharacterFacts(character);
  const relationshipCount = character.relatedProfiles?.length ?? 0;

  return (
    <section id="dossier" className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Lore Dossier</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          A working dossier for the character&apos;s place in the DoSAC machine:
          office role, political home, career pressure, and the relationships
          that pull them into the wider Westminster mess.
        </p>
      </div>

      <dl className="grid grid-cols-1 gap-x-6 gap-y-4 border-y border-slate-200 py-5 sm:grid-cols-2">
        {facts.map((fact: ProfileFact) => (
          <div key={fact.label}>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {fact.label}
            </dt>
            <dd className="mt-1 text-sm leading-relaxed text-slate-900">
              {fact.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="grid grid-cols-1 gap-4 text-sm text-slate-600 sm:grid-cols-3">
        <div>
          <span className="block font-semibold text-slate-900">
            Frame highlights
          </span>
          {(character.frameHighlights?.length ?? 0).toString()}
        </div>
        <div>
          <span className="block font-semibold text-slate-900">
            Related profiles
          </span>
          {relationshipCount.toString()}
        </div>
        <div>
          <span className="block font-semibold text-slate-900">
            Detail entries
          </span>
          {character.details.length.toString()}
        </div>
      </div>
    </section>
  );
}

function getProfilePressureNote(character: Character): string {
  if (character.role.includes("Minister")) {
    return "Their danger zone is ministerial exposure: one loose announcement, interview, or leak can turn a departmental wobble into a resignation threat.";
  }

  if (character.role.includes("Special Advisor")) {
    return "Their currency is information: who they protect, who they brief against, and which ministerial blind spots they learn to exploit.";
  }

  if (character.role.includes("Civil Servant")) {
    return "Their power is continuity: records, process, and the quiet survival skills needed under unstable ministers and panicking advisers.";
  }

  if (character.role.includes("Journalist")) {
    return "Their leverage is access: leaks, hostile briefings, and the permanent trade between scandal, source protection, and tomorrow's splash.";
  }

  if (character.role.includes("Press Officer")) {
    return "Their working day sits between the grid and the fire alarm: lines to take, lobby calls, and controlled panic.";
  }

  return "Their importance is in pressure transfer: even a peripheral figure can shift the room around DoSAC, Number 10, or the press.";
}

/**
 * Generates office-record lore facts for every profile page.
 * These facts are derived from the structured profile data, episode references,
 * and transcript highlights so even minor profiles receive a proper dossier.
 * @param character - Character profile data
 * @param references - Episode references linked to this profile
 * @param transcriptCount - Number of transcript-backed frame highlights
 * @returns Expanded lore facts for profile rendering
 */
function getOfficeRecordFacts(
  character: Character,
  references: ProfileEpisodeReference[],
  transcriptCount: number,
): string[] {
  const background = character.personal?.background;
  const departments = character.department
    .map((department: Department) => departmentLabels[department])
    .join(", ");
  const roles = character.role.map((role: Role) => roleLabels[role]).join(", ");
  const party = character.party ?? background?.party ?? "No party recorded";
  const career = background?.career ?? [];
  const firstCareer = career[career.length - 1] ?? character.occupation;
  const currentCareer = career[0] ?? character.occupation;
  const relatedNames =
    character.relatedProfiles
      ?.slice(0, 3)
      .map((profile: { id: CharacterId; relationship: string }) => {
        return characters[profile.id]?.shortName ?? profile.id;
      })
      .join(", ") || "no directly linked profiles yet";

  return [
    `${character.fullName} serves in ${departments}, placing their record inside the part of government where policy, presentation, and blame collide.`,
    `Their formal function is ${roles}, which determines whether they absorb pressure, create it, or redirect it onto someone weaker.`,
    `Politically, the file records ${party}; institutionally, they sit with ${background?.affiliation ?? "an unrecorded office affiliation"}.`,
    `Their career line runs from ${firstCareer ?? "an implied early role"} to ${currentCareer ?? "their current archive role"}, giving the biography a usable before-and-after arc.`,
    `The nearest working relationships are ${relatedNames}, which is where most of their practical influence and damage travels.`,
    `The office record contains ${character.details.length.toString()} incidents, habits, and background notes for their conduct in government.`,
    `${references.length.toString()} episode-guide events currently place them in the wider series timeline.`,
    `${transcriptCount.toString()} transcript-backed highlights preserve their voice, habits, and reputation under pressure.`,
    getProfilePressureNote(character),
    "The broader read is built from their department, role, relationships, and the way colleagues talk around them when the office starts to fail.",
  ];
}

function OfficeRecord({
  character,
  references,
  transcriptCount,
}: {
  character: Character;
  references: ProfileEpisodeReference[];
  transcriptCount: number;
}): React.ReactElement {
  return (
    <CollapsibleSection
      id="record-in-office"
      title="Record in Office"
      items={getOfficeRecordFacts(character, references, transcriptCount)}
    />
  );
}

function getPolicyAliases(
  profileId: CharacterId,
  character: Character,
): string[] {
  const aliases = [character.name, character.shortName, character.fullName];

  if (profileId === "dan") {
    aliases.push("Opposition Leader");
  }

  return aliases.map((alias: string) => alias.toLowerCase());
}

function getProfilePolicies(
  profileId: CharacterId,
  character: Character,
  policies: Policy[],
): Policy[] {
  const aliases = getPolicyAliases(profileId, character);

  return policies.filter((policy: Policy) => {
    const minister = policy.minister.toLowerCase();
    return aliases.some((alias: string) => minister.includes(alias));
  });
}

function PolicyRecord({
  policies,
}: {
  policies: Policy[];
}): React.ReactElement | null {
  if (policies.length === 0) return null;

  return (
    <section id="policy-record" className="space-y-4">
      <h2 className="text-2xl font-bold text-slate-900">Policy Record</h2>
      <div className="space-y-4">
        {policies.map((policy: Policy) => (
          <article key={policy.id} className="border-l-4 border-slate-200 pl-4">
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={`/policies/${policy.id}`}
                className="font-semibold text-blue-700 hover:text-blue-900 hover:underline"
              >
                {policy.name}
              </Link>
              <Badge variant="secondary" className="capitalize">
                {policy.status}
              </Badge>
              <Badge variant="outline" className="capitalize">
                {policy.type}
              </Badge>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {policy.description}
            </p>
            {policy.keyFeatures.length > 0 && (
              <ul className="mt-3 space-y-1 text-sm text-slate-600">
                {policy.keyFeatures.slice(0, 3).map((feature: string) => (
                  <li key={feature} className="flex items-start">
                    <span className="mr-2 text-slate-400">-</span>
                    {feature}
                  </li>
                ))}
              </ul>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

/**
 * Displays the episode-guide references for a profile.
 * Empty states are intentional: they show which minor profiles still need
 * source tagging rather than hiding the gap from the lore docs.
 * @param props - Component props
 * @param props.references - Episode references for this profile
 * @returns Episode timeline section
 */
function EpisodeTimeline({
  references,
}: {
  references: ProfileEpisodeReference[];
}): React.ReactElement {
  return (
    <section id="timeline" className="space-y-4">
      <h2 className="text-2xl font-bold text-slate-900">Episode Timeline</h2>
      {references.length > 0 ? (
        <ol className="space-y-4">
          {references.map((reference: ProfileEpisodeReference) => (
            <li
              key={reference.href}
              className="border-l-4 border-slate-200 pl-4"
            >
              <Link
                href={reference.href}
                className="font-semibold text-blue-700 hover:text-blue-900 hover:underline"
              >
                {reference.title}
              </Link>
              <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">
                {reference.airDate}
              </p>
              <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600">
                {reference.summary}
              </p>
              {reference.policyAreas.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {reference.policyAreas.map((area: string) => (
                    <Badge key={area} variant="outline" className="text-xs">
                      {area}
                    </Badge>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-sm leading-relaxed text-slate-600">
          No episode-guide references have been tagged for this profile yet.
          Keep this page in the profile index, but treat its biography as a
          lower-confidence lore entry until an episode or tie-in source is
          attached.
        </p>
      )}
    </section>
  );
}

function TranscriptEvidence({
  screenshots,
}: {
  screenshots: Screenshot[];
}): React.ReactElement | null {
  if (screenshots.length === 0) return null;

  return (
    <section id="transcript-evidence" className="space-y-4">
      <h2 className="text-2xl font-bold text-slate-900">Transcript Evidence</h2>
      <ol className="space-y-3 text-sm text-slate-600">
        {screenshots.slice(0, 6).map((screenshot: Screenshot) => (
          <li key={screenshot.id} className="leading-relaxed">
            <Link
              href={`/caption/${screenshot.id}`}
              className="font-semibold text-blue-700 hover:text-blue-900 hover:underline"
            >
              {screenshot.episode} at {screenshot.timestamp}
            </Link>
            <span className="text-slate-500"> - {screenshot.speech}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

function SourceNotes(): React.ReactElement {
  return (
    <section id="sources" className="space-y-4">
      <h2 className="text-2xl font-bold text-slate-900">Source Notes</h2>
      <ul className="space-y-3 text-sm text-slate-600">
        {PROFILE_SOURCES.map((source: ProfileSource) => (
          <li key={source.href} className="leading-relaxed">
            <a
              href={source.href}
              className="font-semibold text-blue-700 hover:text-blue-900 hover:underline"
            >
              {source.label}
            </a>
            <span className="text-slate-500"> - {source.note}</span>
          </li>
        ))}
      </ul>
    </section>
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
              {roleLabels[role as Role]}
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
                  <span className="mr-3 text-slate-400">-</span>
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
/**
 * Cached inner component for rendering the character profile page
 * Marked with "use cache" and accepts only serializable props
 */
async function CharacterProfileCached({
  id,
}: {
  id: string;
}): Promise<React.ReactElement> {
  "use cache";
  cacheLife("static");

  const character = characters[id];

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

  // Create pagination data for profile display (single page for highlights)
  const paginationData = {
    currentPage: 1,
    totalPages: 1,
    totalItems: screenshots.length,
    hasNextPage: false,
    hasPrevPage: false,
  };

  const characterId = id as CharacterId;
  const episodeReferences = getProfileEpisodeReferences(characterId);
  const policies = await getServerPolicies();
  const profilePolicies = getProfilePolicies(characterId, character, policies);
  const hasCareer = Boolean(character.personal?.background?.career?.length);
  const hasPolicyRecord = profilePolicies.length > 0;
  const hasRelatedProfiles = Boolean(character.relatedProfiles?.length);

  const filters = {
    query: "",
    page: 1,
  };

  const structuredData = generateCharacterStructuredData(id);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main className="container max-w-7xl px-4 py-5 md:px-6 md:py-7 lg:px-8 lg:py-10">
        <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-4 lg:gap-10 xl:gap-12">
          <aside className="order-1 lg:col-span-1">
            {character.image && (
              <div className="mb-6 aspect-[3/4] overflow-hidden rounded-xl border border-slate-200 shadow-lg md:mb-8 md:aspect-auto md:max-h-96 md:w-auto lg:sticky lg:top-8 lg:mb-8 lg:aspect-[3/4] lg:max-h-none">
                <Image
                  src={character.image}
                  alt={character.name}
                  className="h-full w-full object-cover object-top"
                  priority
                  fetchPriority="high"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 384px, 25vw"
                />
              </div>
            )}
            <ContentsList
              hasCareer={hasCareer}
              hasHighlights={screenshots.length > 0}
              hasPolicyRecord={hasPolicyRecord}
              hasRelatedProfiles={hasRelatedProfiles}
            />
            <PersonalInfo character={character} />
          </aside>

          <div className="order-2 lg:col-span-3">
            <header className="mb-8 md:mb-10 lg:mb-12">
              <div className="space-y-4 md:space-y-5 lg:space-y-6">
                <div>
                  <h1 className="mb-3 text-2xl font-bold text-slate-900 md:mb-4 md:text-3xl lg:text-4xl">
                    {character.name}
                  </h1>
                  <p className="text-base leading-relaxed text-slate-600 md:text-lg lg:text-xl">
                    {character.description}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 md:gap-3">
                  {character.role.map((role: string) => (
                    <Badge
                      key={role}
                      variant="secondary"
                      className="bg-slate-100 px-3 py-1 text-sm font-medium md:text-base"
                    >
                      {roleLabels[role as Role]}
                    </Badge>
                  ))}
                </div>
              </div>
            </header>

            <div className="space-y-12">
              <LoreDossier character={character} />

              <OfficeRecord
                character={character}
                references={episodeReferences}
                transcriptCount={screenshots.length}
              />

              {screenshots.length > 0 && (
                <section id="highlights" className="space-y-6">
                  <h2 className="text-2xl font-bold text-slate-900">
                    Highlights
                  </h2>
                  <div className="-mx-4 px-4 sm:mx-0 sm:px-0">
                    <ScreenshotGrid
                      screenshots={screenshots}
                      allScreenshots={screenshots}
                      filters={filters}
                      paginationData={paginationData}
                    />
                  </div>
                </section>
              )}

              <section id="roles" className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-900">Roles</h2>
                <div className="space-y-4">
                  {character.department.map((dept: string) => (
                    <div key={dept} className="space-y-3">
                      <h3 className="text-xl font-semibold text-slate-800">
                        {departmentLabels[dept as Department]}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {character.role.map((role: string) => (
                          <Badge
                            key={role}
                            variant="secondary"
                            className="px-3 py-0.5"
                          >
                            {roleLabels[role as Role]}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <PolicyRecord policies={profilePolicies} />

              <EpisodeTimeline references={episodeReferences} />

              <TranscriptEvidence screenshots={screenshots} />

              <CollapsibleSection
                id="details"
                title="Details"
                items={character.details}
              />

              {hasCareer && character.personal?.background?.career && (
                <CollapsibleSection
                  id="career"
                  title="Career History"
                  items={character.personal.background.career}
                />
              )}

              <SourceNotes />
            </div>
          </div>
        </div>

        {hasRelatedProfiles && character.relatedProfiles && (
          <div className="mt-12 border-t border-slate-200 pt-8">
            <RelatedProfiles relatedProfiles={character.relatedProfiles} />
          </div>
        )}
      </main>
    </>
  );
}

export default async function CharacterProfile({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<React.ReactElement> {
  const { id } = await params;
  return <CharacterProfileCached id={id} />;
}
