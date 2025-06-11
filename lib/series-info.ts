import type { characters } from "./profiles";

export interface SeriesInfo {
  number: number;
  shortSummary: (
    | string
    | { text: string; profileId: keyof typeof characters }
  )[];
  longSummary: (
    | string
    | { text: string; profileId: keyof typeof characters }
  )[];
  episodeCount: number;
}

export const seriesInfo: SeriesInfo[] = [
  {
    number: 1,
    shortSummary: [
      "The first series follows ",
      { text: "Hugh Abbot", profileId: "hugh" },
      "'s appointment as Minister for Social Affairs and his subsequent challenges navigating cabinet politics, policy decisions, and press relations under the watchful eye of ",
      { text: "Malcolm Tucker", profileId: "malcolm" },
      ", the Government's Director of Communications.",
    ],
    longSummary: [
      "Following the forced exit of ",
      { text: "Cliff Lawton", profileId: "cliff" },
      " amid intense press pressure, ",
      { text: "Hugh Abbot", profileId: "hugh" },
      " was appointed as Minister for Social Affairs. His tenure began with a significant misstep when he misinterpreted the Prime Minister's position and announced the development of a benefit fraud detection unit, dubbed the 'Snooper Force', without Treasury consultation. This led to a crisis where Abbot and his advisors ",
      { text: "Oliver Reeder", profileId: "ollie" },
      " and ",
      { text: "Glenn Cullen", profileId: "glenn" },
      " had merely forty minutes to improvise a new policy for an imminent press briefing. The situation was further complicated when ",
      { text: "Malcolm Tucker", profileId: "malcolm" },
      ", the Government's Director of Communications, forced Abbot to enhance his cultural knowledge through intensive study of popular media, only to discover that a focus group member influencing key policy decisions had appeared as an extra in one of these programmes. The period culminated in a serious scandal when the press uncovered that Abbot was maintaining an empty second property by listing it on the market while rejecting all offers, bringing him to the brink of resignation.",
    ],
    episodeCount: 3,
  },
  {
    number: 2,
    shortSummary: [
      "With a cabinet reshuffle looming, ",
      { text: "Hugh Abbot", profileId: "hugh" },
      " fights to keep his position while the department faces significant changes, including a rebranding to the 'Department of Social Affairs and Citizenship' and interference from the PM's 'blue skies' adviser.",
    ],
    longSummary: [
      "Ahead of a major cabinet reshuffle, ministerial posts were thrown into question as the department underwent significant restructuring. During this period, ",
      { text: "Ollie Reeder", profileId: "ollie" },
      " was seconded to Number 10, ostensibly to maintain contact with ",
      { text: "Emma Messinger", profileId: "emma" },
      ", a member of the shadow defence policy team, while operating under the close supervision of enforcer ",
      { text: "Jamie", profileId: "jamie" },
      ". The department's operations were further complicated by ",
      { text: "Terri Coverley", profileId: "terri" },
      "'s absence on compassionate leave following her father's death, with senior press officer ",
      { text: "Robyn Murdoch", profileId: "robyn" },
      " stepping in to fill the role. Additional pressure came from ",
      { text: "Julius Nicholson", profileId: "julius" },
      ", the Prime Minister's 'blue skies' adviser, whose interventions created significant administrative challenges. The reorganisation culminated in the department's rebranding as the 'Department of Social Affairs and Citizenship' and relocation to new premises, though internal difficulties and policy compromises continued to plague operations.",
    ],
    episodeCount: 3,
  },
  {
    number: 3,
    shortSummary: [
      { text: "Nicola Murray", profileId: "nicola" },
      " takes over as the new minister of DoSAC, bringing fresh challenges as she develops her 'Fourth Sector Pathfinder Initiative' while ",
      { text: "Malcolm Tucker", profileId: "malcolm" },
      " faces threats to his power from both within the party and the opposition.",
    ],
    longSummary: [
      "A pivotal change occurred when ",
      { text: "Nicola Murray", profileId: "nicola" },
      ", an unexpected last-minute appointment, assumed leadership of the Department of Social Affairs and Citizenship following ",
      { text: "Hugh Abbot", profileId: "hugh" },
      "'s departure. Given her inexperience and lack of personal staff, Murray retained advisers ",
      { text: "Ollie Reeder", profileId: "ollie" },
      " and ",
      { text: "Glenn Cullen", profileId: "glenn" },
      ". Her primary initiative, the 'Fourth Sector Pathfinder Initiative', became a focal point of departmental policy amid growing election speculation and mounting tension at Number 10. The period saw increased interaction with opposition figure ",
      { text: "Peter Mannion", profileId: "peter" },
      " and witnessed the gradual erosion of ",
      { text: "Malcolm Tucker", profileId: "malcolm" },
      "'s influence, particularly through challenges from ",
      { text: "Steve Fleming", profileId: "steve" },
      ". This power struggle culminated in Tucker's forced resignation, though Fleming's victory proved short-lived as he was himself removed days later. Upon regaining his position, Tucker made the strategic decision to call an immediate election to outmanoeuvre both opposition and internal party threats.",
    ],
    episodeCount: 3,
  },
  {
    number: 4,
    shortSummary: [
      "Following a hung parliament, ",
      { text: "Peter Mannion", profileId: "peter" },
      " leads a coalition government at DoSAC while ",
      { text: "Nicola Murray", profileId: "nicola" },
      " struggles as Leader of the Opposition. A tragic suicide leads to a Leveson-style inquiry that threatens to expose all parties' involvement in the illegal leaking of documents.",
    ],
    longSummary: [
      "After a hung parliament forced a major reconfiguration of government leadership, ",
      { text: "Peter Mannion", profileId: "peter" },
      " was appointed Secretary of State for Social Affairs and Citizenship within a coalition government, requiring close cooperation with ",
      { text: "Fergus Williams", profileId: "fergus" },
      " from the junior coalition partner. The political landscape shifted dramatically when ",
      { text: "Tom Davis", profileId: "tom" },
      "'s electoral defeat led to his resignation, resulting in ",
      { text: "Nicola Murray", profileId: "nicola" },
      "'s technical victory over ",
      { text: "Dan Miller", profileId: "dan" },
      " in the opposition leadership contest. The administration faced its greatest crisis following the public eviction and subsequent suicide of Douglas Tickel, a nurse with documented mental health issues, during the implementation of a controversial healthcare bill. The tragedy triggered the Goolding Inquiry, a comprehensive investigation that revealed all three main parties had participated in the illegal leaking of documents, including Tickel's medical records. This scandal ultimately led to Murray's resignation and replacement by Miller, while exposing deep-rooted issues in government communication practices.",
    ],
    episodeCount: 3,
  },
];

/**
 * Get information about a specific series
 * @param seriesNumber - The series number to look up
 * @returns The series information or undefined if not found
 */
export function getSeriesInfo(seriesNumber: number): SeriesInfo | undefined {
  return seriesInfo.find((series) => series.number === seriesNumber);
}

/**
 * Get episode information for a specific series
 * @param seriesNumber - The series number to get episodes for
 * @returns Array of episode numbers for the series
 */
export function getSeriesEpisodes(seriesNumber: number): number[] {
  const series = getSeriesInfo(seriesNumber);
  if (!series) return [];
  return Array.from({ length: series.episodeCount }, (_, i) => i + 1);
}

/**
 * Get information about all series
 * @returns Array of all series information
 */
export function getAllSeries(): SeriesInfo[] {
  return seriesInfo;
}
