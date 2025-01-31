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
      "The first series of three episodes tracks the installation of Hugh Abbot as the new Minister for Social Affairs following the orchestrated ousting of Cliff Lawton in response to press pressure. Subsequently, these episodes follow Abbot's attempt to make his mark as a member of the cabinet whilst simultaneously avoiding the ire of Malcolm Tucker, the Government's Director of Communications. Abbot begins his tenure by misinterpreting the Prime Minister, assuming his support for developing a benefit fraud detection unit known colloquially as the 'Snooper Force'. Malcolm learns of concern that the Treasury were bypassed in the announcement decision, however, leaving Hugh and his advisors Oliver Reeder and Glenn Cullen forty minutes to improvise a policy to a press briefing. Later, Abbot is forced by Malcolm to enhance his cultural knowledge by watching clips from EastEnders and The Bill, only to discover that one of the extras was a member of a focus group that drove the decision to choose one of two contradictory policies. In the series finale, the press learn Abbot is intentionally keeping a second property empty for his use by listing it on the market and rejecting all offers, bringing him close to resignation.",
    episodeCount: 3,
  },
  {
    number: 2,
    shortSummary:
      "With a cabinet reshuffle looming, Hugh Abbot fights to keep his position while the department faces significant changes, including a rebranding to the 'Department of Social Affairs and Citizenship' and interference from the PM's 'blue skies' adviser.",
    longSummary:
      'The second batch of episodes takes place before a cabinet reshuffle, and follows Hugh\'s attempts to keep his job. Ollie Reeder is seconded to number 10 "to phone his girlfriend" Emma Messinger, a member of the shadow defence policy team, where he is under the close eye of enforcer Jamie. Meanwhile, Terri Coverley is on compassionate leave following the death of her father, leaving her role to Robyn Murdoch, a senior press officer. The department also has to contend with the interference of the prime minister\'s "blue skies" adviser Julius Nicholson. The minister and the department survive the reshuffle, with the department being rebranded as the "Department of Social Affairs and Citizenship" and moved to a new building. However, the mistakes and compromises continue.',
    episodeCount: 3,
  },
  {
    number: 3,
    shortSummary:
      "Nicola Murray takes over as the new minister of DoSAC, bringing fresh challenges as she develops her 'Fourth Sector Pathfinder Initiative' while Malcolm Tucker faces threats to his power from both within the party and the opposition.",
    longSummary:
      "In series 3, Hugh Abbot is replaced as minister by Nicola Murray, played by Rebecca Front. She is an unexpected, last-minute choice for the position, and given her inexperience and lack of staff, she is forced to retain Ollie and Glenn as her advisers. The series continues to focus on the general running, or mis-running, of DoSAC, with Murray's attempts to formulate her \"Fourth Sector Pathfinder Initiative\" being a running thread throughout the series. With the cloud of the forthcoming general election and tension at 10 Downing Street looming, the series also broadens its scope to include episodes set at the annual party conference and BBC Radio 5 Live. We also see more of Murray's opposite number, Peter Mannion, and other members of the opposition first seen in the 2007 specials. The gradual breakdown of Malcolm Tucker and appearance of new threats to his control, in particular Steve Fleming (David Haig), are also major plotlines. The series ends with Fleming forcing Malcolm's resignation, only to be ousted himself a matter of days later. Having regained dominance, Malcolm decides to call an election immediately to seize the initiative from his enemies in the opposition and his own party.",
    episodeCount: 3,
  },
  {
    number: 4,
    shortSummary:
      "Following a hung parliament, Peter Mannion leads a coalition government at DoSAC while Nicola Murray struggles as Leader of the Opposition. A tragic suicide leads to a Leveson-style inquiry that threatens to expose all parties' involvement in the illegal leaking of documents.",
    longSummary:
      "In series 4, the government and opposition have switched places following the election, as a result of a hung parliament and there is therefore a coalition government with a smaller third party. Peter Mannion has been made the Secretary of State for Social Affairs and Citizenship but has to contend with Fergus Williams, his junior partner in the coalition. Meanwhile, following Tom Davis's defeat and resignation, Nicola Murray had been elected by her party, apparently on a technicality, over Dan Miller, her opponent, as leader of the opposition, although she resigns at the end of episode four and is replaced by her deputy, Miller. A running thread throughout the series is an ongoing \"Leveson-style public inquiry\" which takes place in episode six. While the first four episodes each focuses solely on one side (episodes one and three focusing on the coalition, and episode two and four focusing on the opposition), each episode thereafter cuts between the parties. The final three episodes of series four show all parties trying to cover their tracks regarding a public health care bill which has led to the public eviction and consequent suicide of Douglas Tickel, a nurse with a history of mental illness. All three main parties have some level of responsibility and have participated in the illegal leaking of documents, in particular Tickel's medical records, which is the reason for the Goolding Inquiry being launched.",
    episodeCount: 3,
  },
];

export function getSeriesInfo(seriesNumber: number): SeriesInfo | undefined {
  return seriesInfo.find((series) => series.number === seriesNumber);
}
