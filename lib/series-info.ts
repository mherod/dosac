export interface SeriesInfo {
  number: number;
  shortSummary: string;
  longSummary: string;
  episodeCount: number;
}

export const seriesInfo: SeriesInfo[] = [
  {
    number: 1,
    shortSummary:
      "The first series follows Hugh Abbot's appointment as Minister for Social Affairs and his subsequent challenges navigating cabinet politics, policy decisions, and press relations under the watchful eye of Malcolm Tucker, the Government's Director of Communications.",
    longSummary:
      "Following the forced exit of Cliff Lawton amid intense press pressure, Hugh Abbot was appointed as Minister for Social Affairs. His tenure began with a significant misstep when he misinterpreted the Prime Minister's position and announced the development of a benefit fraud detection unit, dubbed the 'Snooper Force', without Treasury consultation. This led to a crisis where Abbot and his advisors Oliver Reeder and Glenn Cullen had merely forty minutes to improvise a new policy for an imminent press briefing. The situation was further complicated when Malcolm Tucker, the Government's Director of Communications, forced Abbot to enhance his cultural knowledge through intensive study of popular media, only to discover that a focus group member influencing key policy decisions had appeared as an extra in one of these programmes. The period culminated in a serious scandal when the press uncovered that Abbot was maintaining an empty second property by listing it on the market while rejecting all offers, bringing him to the brink of resignation.",
    episodeCount: 3,
  },
  {
    number: 2,
    shortSummary:
      "With a cabinet reshuffle looming, Hugh Abbot fights to keep his position while the department faces significant changes, including a rebranding to the 'Department of Social Affairs and Citizenship' and interference from the PM's 'blue skies' adviser.",
    longSummary:
      "Ahead of a major cabinet reshuffle, ministerial posts were thrown into question as the department underwent significant restructuring. During this period, Ollie Reeder was seconded to Number 10, ostensibly to maintain contact with Emma Messinger, a member of the shadow defence policy team, while operating under the close supervision of enforcer Jamie. The department's operations were further complicated by Terri Coverley's absence on compassionate leave following her father's death, with senior press officer Robyn Murdoch stepping in to fill the role. Additional pressure came from Julius Nicholson, the Prime Minister's 'blue skies' adviser, whose interventions created significant administrative challenges. The reorganisation culminated in the department's rebranding as the 'Department of Social Affairs and Citizenship' and relocation to new premises, though internal difficulties and policy compromises continued to plague operations.",
    episodeCount: 3,
  },
  {
    number: 3,
    shortSummary:
      "Nicola Murray takes over as the new minister of DoSAC, bringing fresh challenges as she develops her 'Fourth Sector Pathfinder Initiative' while Malcolm Tucker faces threats to his power from both within the party and the opposition.",
    longSummary:
      "A pivotal change occurred when Nicola Murray, an unexpected last-minute appointment, assumed leadership of the Department of Social Affairs and Citizenship following Hugh Abbot's departure. Given her inexperience and lack of personal staff, Murray retained advisers Ollie Reeder and Glenn Cullen. Her primary initiative, the 'Fourth Sector Pathfinder Initiative', became a focal point of departmental policy amid growing election speculation and mounting tension at Number 10. The period saw increased interaction with opposition figure Peter Mannion and witnessed the gradual erosion of Malcolm Tucker's influence, particularly through challenges from Steve Fleming. This power struggle culminated in Tucker's forced resignation, though Fleming's victory proved short-lived as he was himself removed days later. Upon regaining his position, Tucker made the strategic decision to call an immediate election to outmanoeuvre both opposition and internal party threats.",
    episodeCount: 3,
  },
  {
    number: 4,
    shortSummary:
      "Following a hung parliament, Peter Mannion leads a coalition government at DoSAC while Nicola Murray struggles as Leader of the Opposition. A tragic suicide leads to a Leveson-style inquiry that threatens to expose all parties' involvement in the illegal leaking of documents.",
    longSummary:
      "After a hung parliament forced a major reconfiguration of government leadership, Peter Mannion was appointed Secretary of State for Social Affairs and Citizenship within a coalition government, requiring close cooperation with Fergus Williams from the junior coalition partner. The political landscape shifted dramatically when Tom Davis's electoral defeat led to his resignation, resulting in Nicola Murray's technical victory over Dan Miller in the opposition leadership contest. The administration faced its greatest crisis following the public eviction and subsequent suicide of Douglas Tickel, a nurse with documented mental health issues, during the implementation of a controversial healthcare bill. The tragedy triggered the Goolding Inquiry, a comprehensive investigation that revealed all three main parties had participated in the illegal leaking of documents, including Tickel's medical records. This scandal ultimately led to Murray's resignation and replacement by Miller, while exposing deep-rooted issues in government communication practices.",
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
