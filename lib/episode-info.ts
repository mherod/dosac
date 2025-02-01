export type WriterRole = "writer" | "additional material" | "story";
export interface WriterCredit {
  name: string;
  role?: WriterRole;
}

export interface CastMember {
  character: string;
  actor: string;
  isGuest?: boolean;
}

export enum PolicyArea {
  Education = "Education",
  Health = "Health",
  Immigration = "Immigration",
  Economy = "Economy",
  Technology = "Technology",
  Housing = "Housing",
}

export interface EpisodeInfo {
  seriesNumber: number;
  episodeNumber: number;
  overallNumber: number;
  title: string;
  directors: string[];
  writers: WriterCredit[];
  airDate: string;
  parsedDate: Date;
  productionCode?: string;
  filmingDates?: [Date, Date];
  locations?: string[];
  shortSummary: string;
  longSummary?: string;
  runtime: number;
  notes?: string[];
  policyAreas?: PolicyArea[];
  cast: CastMember[];
  _version: 2;
}

export const episodeInfo: EpisodeInfo[] = [
  {
    seriesNumber: 1,
    episodeNumber: 1,
    overallNumber: 1,
    title: "Series 1 – Episode 1",
    directors: ["Armando Iannucci"],
    writers: [
      { name: "Jesse Armstrong", role: "writer" },
      { name: "Armando Iannucci", role: "writer" },
    ],
    airDate: "19 May 2005",
    parsedDate: new Date(2005, 4, 19),
    productionCode: "TT1-01",
    filmingDates: [new Date(2004, 9, 15), new Date(2004, 9, 22)],
    locations: ["BBC Television Centre", "Westminster"],
    shortSummary:
      "Cliff Lawton MP is given the boot and swiftly replaced by Hugh Abbott and his staff. Hoping to start his tenure in a blaze of publicity he calls a press conference, but after his 'Snooper Squad' idea is killed, Abbott and his staff have forty minutes to come up with a new policy.",
    runtime: 30,
    policyAreas: [PolicyArea.Economy, PolicyArea.Education],
    cast: [
      { character: "Hugh Abbott", actor: "Chris Langham", isGuest: false },
      { character: "Malcolm Tucker", actor: "Peter Capaldi", isGuest: false },
    ],
    _version: 2,
  },
  {
    seriesNumber: 1,
    episodeNumber: 2,
    overallNumber: 2,
    title: "Series 1 – Episode 2",
    directors: ["Armando Iannucci"],
    writers: [
      { name: "Simon Blackwell", role: "writer" },
      { name: "Tony Roche", role: "writer" },
      { name: "Jesse Armstrong", role: "writer" },
      { name: "Armando Iannucci", role: "writer" },
    ],
    airDate: "26 May 2005",
    parsedDate: new Date(2005, 4, 26),
    productionCode: "TT1-02",
    filmingDates: [new Date(2004, 9, 15), new Date(2004, 9, 22)],
    locations: ["BBC Television Centre", "Westminster"],
    shortSummary:
      "Malcolm is concerned that Abbott is not keeping in touch with the man or woman on the street and orders him to catch up on modern pop culture. In an attempt to formulate a popular new strategy, Hugh gets a very focused focus group in to tell him which one of two contradictory policies to go for.",
    runtime: 30,
    policyAreas: [PolicyArea.Economy, PolicyArea.Education],
    cast: [
      { character: "Hugh Abbott", actor: "Chris Langham", isGuest: false },
      { character: "Malcolm Tucker", actor: "Peter Capaldi", isGuest: false },
    ],
    _version: 2,
  },
  {
    seriesNumber: 1,
    episodeNumber: 3,
    overallNumber: 3,
    title: "Series 1 – Episode 3",
    directors: ["Armando Iannucci"],
    writers: [
      { name: "Simon Blackwell", role: "writer" },
      { name: "Jesse Armstrong", role: "writer" },
      { name: "Armando Iannucci", role: "writer" },
    ],
    airDate: "2 June 2005",
    parsedDate: new Date(2005, 4, 26),
    productionCode: "TT1-03",
    filmingDates: [new Date(2004, 9, 15), new Date(2004, 9, 22)],
    locations: ["BBC Television Centre", "Westminster"],
    shortSummary:
      'Malcolm thinks Hugh\'s empty flat in London could pose a problem for the successful Second Home Housing Bill. Meanwhile, Hugh develops a dislike for his media-savvy junior minister Dan Miller and Malcolm explains the art of a "good resignation".',
    runtime: 30,
    policyAreas: [PolicyArea.Economy, PolicyArea.Housing],
    cast: [
      { character: "Hugh Abbott", actor: "Chris Langham", isGuest: false },
      { character: "Dan Miller", actor: "Tom Hollander", isGuest: false },
    ],
    _version: 2,
  },
  {
    seriesNumber: 2,
    episodeNumber: 1,
    overallNumber: 4,
    title: "Series 2 – Episode 1",
    directors: ["Armando Iannucci"],
    writers: [
      { name: "Jesse Armstrong", role: "writer" },
      { name: "Simon Blackwell", role: "writer" },
      { name: "Armando Iannucci", role: "writer" },
      { name: "Tony Roche", role: "writer" },
    ],
    airDate: "20 October 2005",
    parsedDate: new Date(2005, 9, 20),
    productionCode: "TT2-01",
    filmingDates: [new Date(2004, 9, 15), new Date(2004, 9, 22)],
    locations: ["BBC Television Centre", "Westminster"],
    shortSummary:
      'At a ministerial visit to a factory, Hugh is accosted by a member of the public. With Terri away on compassionate leave, only Malcolm can help bury the story, but will he? Meanwhile, Ollie is dating an opposition advisor and hastily seconded to Downing Street to "ring his girlfriend".',
    runtime: 30,
    policyAreas: [PolicyArea.Economy, PolicyArea.Immigration],
    cast: [
      { character: "Hugh Abbott", actor: "Chris Langham", isGuest: false },
      { character: "Malcolm Tucker", actor: "Peter Capaldi", isGuest: false },
    ],
    _version: 2,
  },
  {
    seriesNumber: 2,
    episodeNumber: 2,
    overallNumber: 5,
    title: "Series 2 – Episode 2",
    directors: ["Armando Iannucci"],
    writers: [
      { name: "Jesse Armstrong", role: "writer" },
      { name: "Simon Blackwell", role: "writer" },
      { name: "Armando Iannucci", role: "writer" },
      { name: "Tony Roche", role: "writer" },
    ],
    airDate: "27 October 2005",
    parsedDate: new Date(2005, 9, 27),
    productionCode: "TT2-02",
    filmingDates: [new Date(2004, 9, 15), new Date(2004, 9, 22)],
    locations: ["BBC Television Centre", "Westminster"],
    shortSummary:
      "There's a cabinet reshuffle in the offing and the PM's new 'blue skies' advisor Julius is making trouble. Robyn Murdoch struggles to cover Terri's duties, and is removed from Malcolm's morning meetings.",
    runtime: 30,
    policyAreas: [PolicyArea.Economy, PolicyArea.Technology],
    cast: [
      { character: "Hugh Abbott", actor: "Chris Langham", isGuest: false },
      { character: "Malcolm Tucker", actor: "Peter Capaldi", isGuest: false },
    ],
    _version: 2,
  },
  {
    seriesNumber: 2,
    episodeNumber: 3,
    overallNumber: 6,
    title: "Series 2 – Episode 3",
    directors: ["Armando Iannucci"],
    writers: [
      { name: "Jesse Armstrong", role: "writer" },
      { name: "Simon Blackwell", role: "writer" },
      { name: "Armando Iannucci", role: "writer" },
      { name: "Tony Roche", role: "writer" },
    ],
    airDate: "3 November 2005",
    parsedDate: new Date(2005, 9, 3),
    productionCode: "TT2-03",
    filmingDates: [new Date(2004, 9, 15), new Date(2004, 9, 22)],
    locations: ["BBC Television Centre", "Westminster"],
    shortSummary:
      "Hugh attempts to toe the party line on special schools whilst staying true to his conscience. He also accidentally sends an eight-year-old girl an expletive-laden email, intended for Glenn, and Terri faces the blame.",
    runtime: 30,
    policyAreas: [PolicyArea.Economy, PolicyArea.Education],
    cast: [
      { character: "Hugh Abbott", actor: "Chris Langham", isGuest: false },
      { character: "Dan Miller", actor: "Tom Hollander", isGuest: false },
    ],
    _version: 2,
  },
  {
    seriesNumber: 3,
    episodeNumber: 1,
    overallNumber: 9,
    title: "Series 3 – Episode 1",
    directors: [
      "Jesse Armstrong",
      "Simon Blackwell",
      "Roger Drew",
      "Sean Gray",
      "Armando Iannucci",
      "Ian Martin",
      "Tony Roche",
      "Will Smith",
    ],
    writers: [
      { name: "Jesse Armstrong", role: "writer" },
      { name: "Simon Blackwell", role: "writer" },
      { name: "Roger Drew", role: "writer" },
      { name: "Sean Gray", role: "writer" },
      { name: "Armando Iannucci", role: "writer" },
      { name: "Ian Martin", role: "writer" },
      { name: "Tony Roche", role: "writer" },
      { name: "Will Smith", role: "writer" },
    ],
    airDate: "24 October 2009",
    parsedDate: new Date(2009, 9, 24),
    productionCode: "TT3-01",
    filmingDates: [new Date(2008, 9, 15), new Date(2008, 9, 22)],
    locations: ["BBC Television Centre", "Westminster"],
    shortSummary:
      'Nicola Murray MP replaces Hugh Abbott as Secretary of State at DoSAC and comes without her own staff, so Glenn and Ollie find themselves unexpectedly keeping their jobs. Meanwhile, Malcolm is arranging publicity for a by-election. The term "omnishambles" is used for the first time in this episode.',
    runtime: 30,
    policyAreas: [PolicyArea.Economy, PolicyArea.Immigration],
    cast: [
      {
        character: "Nicola Murray",
        actor: "Katherine Parkinson",
        isGuest: false,
      },
      { character: "Hugh Abbott", actor: "Chris Langham", isGuest: true },
      { character: "Malcolm Tucker", actor: "Peter Capaldi", isGuest: false },
    ],
    _version: 2,
  },
  {
    seriesNumber: 3,
    episodeNumber: 2,
    overallNumber: 10,
    title: "Series 3 – Episode 2",
    directors: [
      "Jesse Armstrong",
      "Simon Blackwell",
      "Roger Drew",
      "Sean Gray",
      "Armando Iannucci",
      "Ian Martin",
      "Tony Roche",
      "Will Smith",
    ],
    writers: [
      { name: "Jesse Armstrong", role: "writer" },
      { name: "Simon Blackwell", role: "writer" },
      { name: "Roger Drew", role: "writer" },
      { name: "Sean Gray", role: "writer" },
      { name: "Armando Iannucci", role: "writer" },
      { name: "Ian Martin", role: "writer" },
      { name: "Tony Roche", role: "writer" },
      { name: "Will Smith", role: "writer" },
    ],
    airDate: "31 October 2009",
    parsedDate: new Date(2009, 9, 31),
    productionCode: "TT3-02",
    filmingDates: [new Date(2008, 9, 15), new Date(2008, 9, 22)],
    locations: ["BBC Television Centre", "Westminster"],
    shortSummary:
      "A week since Nicola took over at DoSAC, and there's a catastrophic error with immigration figures on the department computers. Meanwhile, the press are speculating over the new Minister's longevity.",
    runtime: 30,
    policyAreas: [PolicyArea.Economy, PolicyArea.Immigration],
    cast: [
      {
        character: "Nicola Murray",
        actor: "Katherine Parkinson",
        isGuest: false,
      },
      { character: "Hugh Abbott", actor: "Chris Langham", isGuest: true },
      { character: "Malcolm Tucker", actor: "Peter Capaldi", isGuest: false },
    ],
    _version: 2,
  },
  {
    seriesNumber: 3,
    episodeNumber: 3,
    overallNumber: 11,
    title: "Series 3 – Episode 3",
    directors: [
      "Jesse Armstrong",
      "Simon Blackwell",
      "Roger Drew",
      "Sean Gray",
      "Armando Iannucci",
      "Ian Martin",
      "Tony Roche",
      "Will Smith",
    ],
    writers: [
      { name: "Jesse Armstrong", role: "writer" },
      { name: "Simon Blackwell", role: "writer" },
      { name: "Roger Drew", role: "writer" },
      { name: "Sean Gray", role: "writer" },
      { name: "Armando Iannucci", role: "writer" },
      { name: "Ian Martin", role: "writer" },
      { name: "Tony Roche", role: "writer" },
      { name: "Will Smith", role: "writer" },
    ],
    airDate: "7 November 2009",
    parsedDate: new Date(2009, 9, 7),
    productionCode: "TT3-03",
    filmingDates: [new Date(2008, 9, 15), new Date(2008, 9, 22)],
    locations: ["BBC Television Centre", "Westminster"],
    shortSummary:
      "Nicola and Ollie are writing her speech for the party conference in Eastbourne, while Glenn and Malcolm clash over a great publicity opportunity.",
    runtime: 30,
    policyAreas: [PolicyArea.Economy, PolicyArea.Immigration],
    cast: [
      {
        character: "Nicola Murray",
        actor: "Katherine Parkinson",
        isGuest: false,
      },
      { character: "Hugh Abbott", actor: "Chris Langham", isGuest: true },
      { character: "Malcolm Tucker", actor: "Peter Capaldi", isGuest: false },
    ],
    _version: 2,
  },
  {
    seriesNumber: 3,
    episodeNumber: 4,
    overallNumber: 12,
    title: "Series 3 – Episode 4",
    directors: [
      "Jesse Armstrong",
      "Simon Blackwell",
      "Roger Drew",
      "Sean Gray",
      "Armando Iannucci",
      "Ian Martin",
      "Tony Roche",
      "Will Smith",
    ],
    writers: [
      { name: "Jesse Armstrong", role: "writer" },
      { name: "Simon Blackwell", role: "writer" },
      { name: "Roger Drew", role: "writer" },
      { name: "Sean Gray", role: "writer" },
      { name: "Armando Iannucci", role: "writer" },
      { name: "Ian Martin", role: "writer" },
      { name: "Tony Roche", role: "writer" },
      { name: "Will Smith", role: "writer" },
    ],
    airDate: "14 November 2009",
    parsedDate: new Date(2009, 9, 14),
    productionCode: "TT3-04",
    filmingDates: [new Date(2008, 9, 15), new Date(2008, 9, 22)],
    locations: ["BBC Television Centre", "Westminster"],
    shortSummary:
      "The civil servants at DoSAC prepare for a visit from shadow Social Affairs minister Peter Mannion, while Nicola has enough on her plate when her daughter's headmaster calls.",
    runtime: 30,
    policyAreas: [PolicyArea.Economy, PolicyArea.Education],
    cast: [
      {
        character: "Nicola Murray",
        actor: "Katherine Parkinson",
        isGuest: false,
      },
      { character: "Peter Mannion", actor: "Tom Hollander", isGuest: false },
      { character: "Malcolm Tucker", actor: "Peter Capaldi", isGuest: false },
    ],
    _version: 2,
  },
  {
    seriesNumber: 3,
    episodeNumber: 5,
    overallNumber: 13,
    title: "Series 3 – Episode 5",
    directors: [
      "Simon Blackwell",
      "Roger Drew",
      "Sean Gray",
      "Armando Iannucci",
      "Ian Martin",
      "Tony Roche",
      "Will Smith",
    ],
    writers: [
      { name: "Simon Blackwell", role: "writer" },
      { name: "Roger Drew", role: "writer" },
      { name: "Sean Gray", role: "writer" },
      { name: "Armando Iannucci", role: "writer" },
      { name: "Ian Martin", role: "writer" },
      { name: "Tony Roche", role: "writer" },
      { name: "Will Smith", role: "writer" },
    ],
    airDate: "21 November 2009",
    parsedDate: new Date(2009, 9, 21),
    productionCode: "TT3-05",
    filmingDates: [new Date(2008, 9, 15), new Date(2008, 9, 22)],
    locations: ["BBC Television Centre", "Westminster"],
    shortSummary:
      "Nicola Murray and Peter Mannion go head to head on the Richard Bacon show on BBC Radio 5 Live, but when breaking news ruins the agenda, Malcolm descends upon the studios.",
    runtime: 30,
    policyAreas: [PolicyArea.Economy, PolicyArea.Immigration],
    cast: [
      {
        character: "Nicola Murray",
        actor: "Katherine Parkinson",
        isGuest: false,
      },
      { character: "Peter Mannion", actor: "Tom Hollander", isGuest: false },
      { character: "Malcolm Tucker", actor: "Peter Capaldi", isGuest: false },
    ],
    _version: 2,
  },
  {
    seriesNumber: 3,
    episodeNumber: 6,
    overallNumber: 14,
    title: "Series 3 – Episode 6",
    directors: [
      "Simon Blackwell",
      "Roger Drew",
      "Sean Gray",
      "Armando Iannucci",
      "Ian Martin",
      "Tony Roche",
      "Will Smith",
    ],
    writers: [
      { name: "Simon Blackwell", role: "writer" },
      { name: "Roger Drew", role: "writer" },
      { name: "Sean Gray", role: "writer" },
      { name: "Armando Iannucci", role: "writer" },
      { name: "Ian Martin", role: "writer" },
      { name: "Tony Roche", role: "writer" },
      { name: "Will Smith", role: "writer" },
    ],
    airDate: "28 November 2009",
    parsedDate: new Date(2009, 9, 28),
    productionCode: "TT3-06",
    filmingDates: [new Date(2008, 9, 15), new Date(2008, 9, 22)],
    locations: ["BBC Television Centre", "Westminster"],
    shortSummary:
      "Whilst the PM is away on a world tour, the media begin to consider Nicola as a potential challenger to party leadership, forcing Malcolm to put aside his duties and intervene.",
    runtime: 30,
    policyAreas: [PolicyArea.Economy, PolicyArea.Immigration],
    cast: [
      {
        character: "Nicola Murray",
        actor: "Katherine Parkinson",
        isGuest: false,
      },
      { character: "Peter Mannion", actor: "Tom Hollander", isGuest: false },
      { character: "Malcolm Tucker", actor: "Peter Capaldi", isGuest: false },
    ],
    _version: 2,
  },
  {
    seriesNumber: 3,
    episodeNumber: 7,
    overallNumber: 15,
    title: "Series 3 – Episode 7",
    directors: [
      "Jesse Armstrong",
      "Simon Blackwell",
      "Roger Drew",
      "Sean Gray",
      "Armando Iannucci",
      "Ian Martin",
      "Tony Roche",
      "Will Smith",
    ],
    writers: [
      { name: "Jesse Armstrong", role: "writer" },
      { name: "Simon Blackwell", role: "writer" },
      { name: "Roger Drew", role: "writer" },
      { name: "Sean Gray", role: "writer" },
      { name: "Armando Iannucci", role: "writer" },
      { name: "Ian Martin", role: "writer" },
      { name: "Tony Roche", role: "writer" },
      { name: "Will Smith", role: "writer" },
    ],
    airDate: "5 December 2009",
    parsedDate: new Date(2009, 9, 5),
    productionCode: "TT3-07",
    filmingDates: [new Date(2008, 9, 15), new Date(2008, 9, 22)],
    locations: ["BBC Television Centre", "Westminster"],
    shortSummary:
      "DoSAC are attempting to launch a new Healthy Living campaign, while Malcolm is absent, supposedly on holiday – but everyone knows that Malcolm does not take holidays.",
    runtime: 30,
    policyAreas: [PolicyArea.Health],
    cast: [
      {
        character: "Nicola Murray",
        actor: "Katherine Parkinson",
        isGuest: false,
      },
      { character: "Peter Mannion", actor: "Tom Hollander", isGuest: false },
      { character: "Malcolm Tucker", actor: "Peter Capaldi", isGuest: false },
    ],
    _version: 2,
  },
  {
    seriesNumber: 3,
    episodeNumber: 8,
    overallNumber: 16,
    title: "Series 3 – Episode 8",
    directors: [
      "Jesse Armstrong",
      "Simon Blackwell",
      "Roger Drew",
      "Sean Gray",
      "Armando Iannucci",
      "Ian Martin",
      "Tony Roche",
      "Will Smith",
    ],
    writers: [
      { name: "Jesse Armstrong", role: "writer" },
      { name: "Simon Blackwell", role: "writer" },
      { name: "Roger Drew", role: "writer" },
      { name: "Sean Gray", role: "writer" },
      { name: "Armando Iannucci", role: "writer" },
      { name: "Ian Martin", role: "writer" },
      { name: "Tony Roche", role: "writer" },
      { name: "Will Smith", role: "writer" },
    ],
    airDate: "12 December 2009",
    parsedDate: new Date(2009, 9, 12),
    productionCode: "TT3-08",
    filmingDates: [new Date(2008, 9, 15), new Date(2008, 9, 22)],
    locations: ["BBC Television Centre", "Westminster"],
    shortSummary:
      "Malcolm finds himself running out of both options and friends as the election looms, until he finds help being offered from an unlikely quarter.",
    runtime: 30,
    policyAreas: [PolicyArea.Economy, PolicyArea.Immigration],
    cast: [
      {
        character: "Nicola Murray",
        actor: "Katherine Parkinson",
        isGuest: false,
      },
      { character: "Peter Mannion", actor: "Tom Hollander", isGuest: false },
      { character: "Malcolm Tucker", actor: "Peter Capaldi", isGuest: false },
    ],
    _version: 2,
  },
  {
    seriesNumber: 4,
    episodeNumber: 1,
    overallNumber: 17,
    title: "Series 4 – Episode 1",
    directors: ["Natalie Bailey"],
    writers: [
      { name: "Will Smith", role: "writer" },
      { name: "Simon Blackwell", role: "writer" },
      { name: "Sean Gray", role: "writer" },
      { name: "Ian Martin", role: "writer" },
      { name: "David Quantick", role: "writer" },
      { name: "Tony Roche", role: "writer" },
    ],
    airDate: "8 September 2012",
    parsedDate: new Date(2012, 8, 8),
    productionCode: "TT4-01",
    filmingDates: [new Date(2011, 8, 15), new Date(2011, 8, 22)],
    locations: ["BBC Television Centre", "Westminster"],
    shortSummary:
      'MP Peter Mannion is taking charge at the Department of Social Affairs and Citizenship as part of a coalition government. However, he must also work with junior minister Fergus Williams, an arrangement neither man is enjoying. As the series begins, Fergus excitedly prepares to launch his new digital education initiative Silicon Playgrounds, with the tag line "I Call App Britain", until Downing Street spin doctor Stewart Pearson announces technophobe Peter is going to be the spokesman for it instead.',
    runtime: 30,
    policyAreas: [PolicyArea.Economy, PolicyArea.Education],
    cast: [
      { character: "Peter Mannion", actor: "Tom Hollander", isGuest: false },
      { character: "Fergus Williams", actor: "Tom Bennett", isGuest: false },
      { character: "Stewart Pearson", actor: "Hugh Laurie", isGuest: false },
    ],
    _version: 2,
  },
  {
    seriesNumber: 4,
    episodeNumber: 2,
    overallNumber: 18,
    title: "Series 4 – Episode 2",
    directors: ["Billy Sneddon"],
    writers: [
      { name: "Simon Blackwell", role: "writer" },
      { name: "Roger Drew", role: "writer" },
      { name: "Dan Gaster", role: "writer" },
      { name: "Sean Gray", role: "writer" },
      { name: "Ian Martin", role: "writer" },
    ],
    airDate: "15 September 2012",
    parsedDate: new Date(2012, 8, 15),
    productionCode: "TT4-02",
    filmingDates: [new Date(2011, 8, 15), new Date(2011, 8, 22)],
    locations: ["BBC Television Centre", "Westminster"],
    shortSummary:
      "Leader of the Opposition Nicola Murray finds herself facing a new set of pressures following her party's election defeat, including being harassed by a man in an unusual costume. However, her problems mount when journalists get a glimpse of some embarrassing meeting notes – and she starts to worry about how close fellow shadow cabinet member Dan Miller is getting to media strategist Malcolm Tucker.",
    runtime: 30,
    policyAreas: [PolicyArea.Economy, PolicyArea.Immigration],
    cast: [
      {
        character: "Nicola Murray",
        actor: "Katherine Parkinson",
        isGuest: false,
      },
      { character: "Dan Miller", actor: "Tom Hollander", isGuest: false },
      { character: "Malcolm Tucker", actor: "Peter Capaldi", isGuest: false },
    ],
    _version: 2,
  },
  {
    seriesNumber: 4,
    episodeNumber: 3,
    overallNumber: 19,
    title: "Series 4 – Episode 3",
    directors: ["Natalie Bailey"],
    writers: [
      { name: "Ian Martin", role: "writer" },
      { name: "Will Smith", role: "writer" },
    ],
    airDate: "22 September 2012",
    parsedDate: new Date(2012, 8, 22),
    productionCode: "TT4-03",
    filmingDates: [new Date(2011, 8, 15), new Date(2011, 8, 22)],
    locations: ["BBC Television Centre", "Westminster"],
    shortSummary:
      'Stewart Pearson takes Peter Mannion to a "Thought Camp" at a remote country mansion. While they\'re away and out of mobile phone range, Fergus invites an attractive female economist into the department to discuss her idea about creating a taxpayer-funded community bank. However, when NHS housing campaigner "Mr Tickle" commits suicide, Fergus is forced to make a rash decision and Peter finds himself on a slippery slope.',
    runtime: 30,
    policyAreas: [PolicyArea.Economy, PolicyArea.Housing],
    cast: [
      { character: "Peter Mannion", actor: "Tom Hollander", isGuest: false },
      { character: "Fergus Williams", actor: "Tom Bennett", isGuest: false },
      { character: "Stewart Pearson", actor: "Hugh Laurie", isGuest: false },
    ],
    _version: 2,
  },
  {
    seriesNumber: 4,
    episodeNumber: 4,
    overallNumber: 20,
    title: "Series 4 – Episode 4",
    directors: ["Becky Martin"],
    writers: [
      { name: "Sean Gray", role: "writer" },
      { name: "Simon Blackwell", role: "writer" },
      { name: "Tony Roche", role: "writer" },
    ],
    airDate: "29 September 2012",
    parsedDate: new Date(2012, 8, 29),
    productionCode: "TT4-04",
    filmingDates: [new Date(2011, 8, 15), new Date(2011, 8, 22)],
    locations: ["BBC Television Centre", "Westminster"],
    shortSummary:
      "Malcolm's patience with Nicola Murray's leadership is at an end. As Nicola is stuck on a train on the way to Bradford with a crew from Sky News, and with Ollie in hospital recovering from an appendix removal, Malcolm hatches a plan with Ollie, Ben Swain and Dan Miller to double cross Nicola, and force her to resign.",
    runtime: 30,
    policyAreas: [PolicyArea.Economy, PolicyArea.Immigration],
    cast: [
      {
        character: "Nicola Murray",
        actor: "Katherine Parkinson",
        isGuest: false,
      },
      { character: "Dan Miller", actor: "Tom Hollander", isGuest: false },
      { character: "Malcolm Tucker", actor: "Peter Capaldi", isGuest: false },
    ],
    _version: 2,
  },
  {
    seriesNumber: 4,
    episodeNumber: 5,
    overallNumber: 21,
    title: "Series 4 – Episode 5",
    directors: ["Chris Addison"],
    writers: [
      { name: "Roger Drew", role: "writer" },
      { name: "Sean Gray", role: "writer" },
    ],
    airDate: "13 October 2012",
    parsedDate: new Date(2012, 9, 13),
    productionCode: "TT4-05",
    filmingDates: [new Date(2011, 8, 15), new Date(2011, 8, 22)],
    locations: ["BBC Television Centre", "Westminster"],
    shortSummary:
      "The unravelling of the key-worker housing sell-off policy forces both Nicola Murray and Peter Mannion onto the defensive, and thus begins a race for the moral high ground. But the more they try to spin the story, the bigger the scandal becomes.",
    runtime: 30,
    policyAreas: [PolicyArea.Economy, PolicyArea.Housing],
    cast: [
      {
        character: "Nicola Murray",
        actor: "Katherine Parkinson",
        isGuest: false,
      },
      { character: "Peter Mannion", actor: "Tom Hollander", isGuest: false },
      { character: "Malcolm Tucker", actor: "Peter Capaldi", isGuest: false },
    ],
    _version: 2,
  },
  {
    seriesNumber: 4,
    episodeNumber: 6,
    overallNumber: 22,
    title: "Series 4 – Episode 6",
    directors: [
      "Simon Blackwell",
      "Roger Drew",
      "Dan Gaster",
      "Sean Gray",
      "Ian Martin",
      "Georgia Pritchett",
      "David Quantick",
      "Tony Roche",
      "Will Smith",
    ],
    writers: [
      { name: "Simon Blackwell", role: "writer" },
      { name: "Roger Drew", role: "writer" },
      { name: "Dan Gaster", role: "writer" },
      { name: "Sean Gray", role: "writer" },
      { name: "Ian Martin", role: "writer" },
      { name: "Georgia Pritchett", role: "writer" },
      { name: "David Quantick", role: "writer" },
      { name: "Tony Roche", role: "writer" },
      { name: "Will Smith", role: "writer" },
    ],
    airDate: "20 October 2012",
    parsedDate: new Date(2012, 9, 20),
    productionCode: "TT4-06",
    filmingDates: [new Date(2011, 8, 15), new Date(2011, 8, 22)],
    locations: ["BBC Television Centre", "Westminster"],
    shortSummary:
      "In an hour-long special, the coalition government, the civil service staff of DoSAC, and the opposition find themselves under the scrutiny of the Lord Justice Goolding Inquiry into Mr Tickel's death and the practice of leaking in politics.",
    runtime: 60,
    policyAreas: [PolicyArea.Economy, PolicyArea.Education],
    cast: [
      {
        character: "Nicola Murray",
        actor: "Katherine Parkinson",
        isGuest: false,
      },
      { character: "Peter Mannion", actor: "Tom Hollander", isGuest: false },
      { character: "Fergus Williams", actor: "Tom Bennett", isGuest: false },
      { character: "Stewart Pearson", actor: "Hugh Laurie", isGuest: false },
    ],
    notes: ["Hour-long special episode"],
    _version: 2,
  },
  {
    seriesNumber: 4,
    episodeNumber: 7,
    overallNumber: 23,
    title: "Series 4 – Episode 7",
    directors: ["Tony Roche"],
    writers: [
      { name: "Tony Roche", role: "writer" },
      { name: "Simon Blackwell", role: "writer" },
      { name: "Sean Gray", role: "writer" },
      { name: "Ian Martin", role: "writer" },
      { name: "Will Smith", role: "writer" },
    ],
    airDate: "27 October 2012",
    parsedDate: new Date(2012, 9, 27),
    productionCode: "TT4-07",
    filmingDates: [new Date(2011, 8, 15), new Date(2011, 8, 22)],
    locations: ["BBC Television Centre", "Westminster"],
    shortSummary:
      "The Home Office has cut police numbers, created a huge backlog of arrest paperwork, and managed to blame DoSAC for the enormous queues at police stations. At Malcolm's suggestion, Dan Miller gets sent on a fact-finding mission to the local cop-shop to press the flesh, in the belief that it will make the Government look unresponsive. Or does he have another motive?",
    runtime: 30,
    policyAreas: [PolicyArea.Economy, PolicyArea.Immigration],
    cast: [
      {
        character: "Nicola Murray",
        actor: "Katherine Parkinson",
        isGuest: false,
      },
      { character: "Peter Mannion", actor: "Tom Hollander", isGuest: false },
      { character: "Dan Miller", actor: "Tom Hollander", isGuest: false },
      { character: "Malcolm Tucker", actor: "Peter Capaldi", isGuest: false },
    ],
    _version: 2,
  },
];

/**
 *
 */
export function getDirectors(): string[] {
  return [...new Set(episodeInfo.flatMap((ep) => ep.directors))];
}

/**
 *
 */
export function getAllWriters(): WriterCredit[] {
  const writersMap = new Map<string, WriterCredit>();
  episodeInfo.forEach((ep) => {
    ep.writers.forEach((writer) => {
      writersMap.set(writer.name, writer);
    });
  });
  return Array.from(writersMap.values());
}

/**
 *
 * @param seriesNumber
 * @param episodeNumber
 */
export function getEpisodeInfo(
  seriesNumber: number,
  episodeNumber: number,
): EpisodeInfo | undefined {
  return episodeInfo.find(
    (ep) =>
      ep.seriesNumber === seriesNumber && ep.episodeNumber === episodeNumber,
  );
}

/**
 *
 * @param seriesNumber
 */
export function getSeriesEpisodes(seriesNumber: number): EpisodeInfo[] {
  return episodeInfo
    .filter((ep) => ep.seriesNumber === seriesNumber)
    .sort((a, b) => a.episodeNumber - b.episodeNumber);
}
