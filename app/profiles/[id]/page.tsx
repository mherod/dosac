import { notFound } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  characters,
  departmentLabels,
  roleLabels,
  type Character,
} from "@/lib/profiles";
import { Separator } from "@/components/ui/separator";

function MetadataItem({
  label,
  value,
}: {
  label: string;
  value: string | number | boolean;
}) {
  if (value === undefined || value === null) return null;
  return (
    <div className="flex flex-col space-y-1">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="font-medium">{String(value)}</span>
    </div>
  );
}

function PersonalDetails({
  personal,
  origin,
}: {
  personal?: NonNullable<Character["personal"]>;
  origin?: NonNullable<Character["origin"]>;
}) {
  if (!personal && !origin) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Personal Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {origin && (
          <div className="space-y-4">
            <h3 className="font-medium">Origin</h3>
            {origin.city && <MetadataItem label="City" value={origin.city} />}
            {origin.area && <MetadataItem label="Area" value={origin.area} />}
            <MetadataItem label="Country" value={origin.country} />
          </div>
        )}

        {personal?.age && (
          <div className="space-y-4">
            <h3 className="font-medium">Age</h3>
            <MetadataItem label="Current Age" value={personal.age} />
            {personal.birthYear && (
              <MetadataItem label="Birth Year" value={personal.birthYear} />
            )}
          </div>
        )}

        {personal?.family && Object.keys(personal.family).length > 0 && (
          <div className="space-y-4">
            <h3 className="font-medium">Family</h3>
            <div className="space-y-2">
              {personal.family.spouse !== undefined && (
                <div className="flex items-center gap-2">
                  <Badge
                    variant={personal.family.spouse ? "default" : "secondary"}
                  >
                    {personal.family.spouse ? "Married" : "Single"}
                  </Badge>
                </div>
              )}
              {personal.family.children && <Badge>Has Children</Badge>}
              {personal.family.siblings && <Badge>Has Siblings</Badge>}
              {personal.family.nieces && <Badge>Has Nieces/Nephews</Badge>}
            </div>
          </div>
        )}

        {personal?.background && (
          <div className="space-y-4">
            <h3 className="font-medium">Background</h3>
            {personal.background.education && (
              <MetadataItem
                label="Education"
                value={personal.background.education}
              />
            )}
            {personal.background.previousCareer && (
              <MetadataItem
                label="Previous Career"
                value={personal.background.previousCareer}
              />
            )}
            {personal.background.interests &&
              personal.background.interests.length > 0 && (
                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground">
                    Interests
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {personal.background.interests.map((interest) => (
                      <Badge key={interest} variant="outline">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
          </div>
        )}
      </div>

      {personal?.relationships && (
        <div className="space-y-4 mt-6">
          <h3 className="font-medium">Relationships</h3>
          {personal.relationships.past &&
            personal.relationships.past.length > 0 && (
              <div className="space-y-2">
                <span className="text-sm text-muted-foreground">Past</span>
                <div className="flex flex-wrap gap-2">
                  {personal.relationships.past.map((rel: string) => (
                    <Badge key={rel} variant="secondary">
                      {rel}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          {personal.relationships.present &&
            personal.relationships.present.length > 0 && (
              <div className="space-y-2">
                <span className="text-sm text-muted-foreground">Present</span>
                <div className="flex flex-wrap gap-2">
                  {personal.relationships.present.map((rel: string) => (
                    <Badge key={rel} variant="default">
                      {rel}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
        </div>
      )}
    </div>
  );
}

/**
 *
 * @param root0
 * @param root0.params
 * @param root0.params.id
 */
export default function CharacterProfile({
  params,
}: {
  params: { id: string };
}) {
  const character = characters[params.id as keyof typeof characters];

  if (!character) {
    notFound();
  }

  return (
    <div className="container py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="flex flex-col md:flex-row gap-6 items-start">
          {character.image && (
            <div className="relative w-48 h-48 rounded-lg overflow-hidden shrink-0">
              <Image
                src={character.image}
                alt={character.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 192px"
                priority
              />
            </div>
          )}
          <div className="space-y-4">
            <div>
              <CardTitle className="text-4xl mb-2">{character.name}</CardTitle>
              <p className="text-muted-foreground">{character.description}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-sm">
                {departmentLabels[character.department]}
              </Badge>
              <Badge variant="outline" className="text-sm">
                {roleLabels[character.role]}
              </Badge>
              {character.nationality && (
                <Badge variant="default" className="text-sm">
                  {character.nationality}
                </Badge>
              )}
            </div>

            {character.occupation && (
              <p className="text-sm text-muted-foreground">
                {character.occupation}
              </p>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-8">
          {(character.personal || character.origin) && (
            <>
              <PersonalDetails
                personal={character.personal}
                origin={character.origin}
              />
              <Separator />
            </>
          )}

          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">About {character.name}</h2>
            <ul className="space-y-2">
              {character.details.map((detail, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2">•</span>
                  {detail}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
