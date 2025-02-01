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
    filmingDates: [new Date(2004, 9, 15), new Date(2004, 9, 22)],
    locations: ["BBC Television Centre", "Westminster"],
    shortSummary:
      "Following intense media pressure, Minister Cliff Lawton was removed from office and Hugh Abbott appointed as Minister for Social Affairs. Abbott's first major policy initiative, a benefit fraud detection unit, faced immediate scrutiny when Treasury consultation procedures were bypassed.",
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
    filmingDates: [new Date(2004, 9, 15), new Date(2004, 9, 22)],
    locations: ["BBC Television Centre", "Westminster"],
    shortSummary:
      "Government Communications Director Malcolm Tucker intervened in departmental affairs after concerns arose about Minister Abbott's disconnect from public sentiment. A focus group consultation on contradictory policies was compromised when it emerged that one participant had undisclosed media industry connections.",
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
    filmingDates: [new Date(2004, 9, 15), new Date(2004, 9, 22)],
    locations: ["BBC Television Centre", "Westminster"],
    shortSummary:
      "Minister Abbott faced serious allegations regarding property holdings when journalists uncovered evidence that he was deliberately maintaining an empty second residence while the Second Home Housing Bill was under consideration.",
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
    filmingDates: [new Date(2004, 9, 15), new Date(2004, 9, 22)],
    locations: ["BBC Television Centre", "Westminster"],
    shortSummary:
      "During Minister Abbott's factory visit, a confrontational encounter with a member of the public sparked a media crisis. Senior Press Officer Robyn Murdoch assumed temporary responsibilities during Terri Coverley's compassionate leave, while adviser Ollie Reeder was seconded to Number 10 for cross-party communications.",
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
    filmingDates: [new Date(2004, 9, 15), new Date(2004, 9, 22)],
    locations: ["BBC Television Centre", "Westminster"],
    shortSummary:
      "Amid cabinet reshuffle speculation, the Prime Minister's strategic adviser Julius Nicholson's interventions created departmental tensions. Senior Press Officer Robyn Murdoch was excluded from key communications briefings following procedural concerns.",
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
    filmingDates: [new Date(2004, 9, 15), new Date(2004, 9, 22)],
    locations: ["BBC Television Centre", "Westminster"],
    shortSummary:
      "A ministerial communications incident involving an eight-year-old constituent complicated Abbott's position on special education policy reform. Senior Civil Servant Terri Coverley faced scrutiny over departmental email protocols.",
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
    filmingDates: [new Date(2008, 9, 15), new Date(2008, 9, 22)],
    locations: ["BBC Television Centre", "Westminster"],
    shortSummary:
      "The appointment of Nicola Murray MP as Secretary of State marked a significant transition at DoSAC. The retention of existing advisory staff Reeder and Cullen provided continuity during this period. Meanwhile, Communications Director Tucker coordinated media strategy for an upcoming by-election.",
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
    filmingDates: [new Date(2008, 9, 15), new Date(2008, 9, 22)],
    locations: ["BBC Television Centre", "Westminster"],
    shortSummary:
      "One week into Secretary Murray's tenure, the department confronted a serious data integrity crisis involving immigration statistics. Media speculation intensified regarding the new minister's position.",
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
    filmingDates: [new Date(2008, 9, 15), new Date(2008, 9, 22)],
    locations: ["BBC Television Centre", "Westminster"],
    shortSummary:
      "Secretary Murray's preparation for her Eastbourne conference address coincided with internal disputes between Communications Director Tucker and Senior Adviser Glenn Cullen over strategic messaging.",
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
    filmingDates: [new Date(2008, 9, 15), new Date(2008, 9, 22)],
    locations: ["BBC Television Centre", "Westminster"],
    shortSummary:
      "A scheduled departmental review by Shadow Minister Peter Mannion coincided with Secretary Murray addressing urgent matters regarding her daughter's education.",
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
    filmingDates: [new Date(2008, 9, 15), new Date(2008, 9, 22)],
    locations: ["BBC Television Centre", "Westminster"],
    shortSummary:
      "During a BBC Radio 5 Live debate between Secretary Murray and Shadow Minister Mannion, breaking news developments prompted emergency intervention from Communications Director Tucker.",
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
    filmingDates: [new Date(2008, 9, 15), new Date(2008, 9, 22)],
    locations: ["BBC Television Centre", "Westminster"],
    shortSummary:
      "Media speculation about Secretary Murray's leadership potential during the Prime Minister's international diplomatic tour necessitated strategic intervention from Communications Director Tucker.",
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
    filmingDates: [new Date(2008, 9, 15), new Date(2008, 9, 22)],
    locations: ["BBC Television Centre", "Westminster"],
    shortSummary:
      "The department's Healthy Living initiative launch proceeded during Communications Director Tucker's unprecedented absence from Westminster.",
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
    filmingDates: [new Date(2008, 9, 15), new Date(2008, 9, 22)],
    locations: ["BBC Television Centre", "Westminster"],
    shortSummary:
      "As election preparations intensified, Communications Director Tucker faced diminishing political support until receiving assistance from an unexpected political quarter.",
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
    filmingDates: [new Date(2011, 8, 15), new Date(2011, 8, 22)],
    locations: ["BBC Television Centre", "Westminster"],
    shortSummary:
      "Opposition Leader Murray confronted escalating pressures following electoral defeat, including public harassment incidents and leaked strategic documentation. Internal tensions emerged regarding Shadow Cabinet member Dan Miller's increasing collaboration with Communications Director Tucker.",
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
    filmingDates: [new Date(2011, 8, 15), new Date(2011, 8, 22)],
    locations: ["BBC Television Centre", "Westminster"],
    shortSummary:
      "Communications Director Tucker orchestrated a coordinated strategy with Shadow Ministers Miller and Swain to secure Opposition Leader Murray's resignation during her Bradford constituency visit.",
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
    filmingDates: [new Date(2011, 8, 15), new Date(2011, 8, 22)],
    locations: ["BBC Television Centre", "Westminster"],
    shortSummary:
      "The controversial key-worker housing policy faced increasing scrutiny as both Secretary Mannion and former Opposition Leader Murray attempted to distance themselves from mounting public criticism.",
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
    filmingDates: [new Date(2011, 8, 15), new Date(2011, 8, 22)],
    locations: ["BBC Television Centre", "Westminster"],
    shortSummary:
      "The Lord Justice Goolding Inquiry examined the circumstances surrounding Mr Tickel's death and systemic issues regarding unauthorized information disclosure within government communications.",
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
    filmingDates: [new Date(2011, 8, 15), new Date(2011, 8, 22)],
    locations: ["BBC Television Centre", "Westminster"],
    shortSummary:
      "Home Office police funding reductions created significant administrative backlogs. Shadow Minister Miller's fact-finding visit to local law enforcement facilities highlighted growing tensions between departmental jurisdictions.",
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
 * Retrieves information about a specific episode
 * @param seriesNumber - The series number to look up
 * @param episodeNumber - The episode number within the series to look up
 * @returns The episode information if found, undefined otherwise
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
 * Gets all episodes for a specific series
 * @param seriesNumber - The series number to get episodes for
 * @returns An array of episode information sorted by episode number
 */
export function getSeriesEpisodes(seriesNumber: number): EpisodeInfo[] {
  return episodeInfo
    .filter((ep) => ep.seriesNumber === seriesNumber)
    .sort((a, b) => a.episodeNumber - b.episodeNumber);
}

/**
 * Gets a unique list of all directors who have worked on the show
 * @returns An array of unique director names
 */
export function getDirectors(): string[] {
  return [...new Set(episodeInfo.flatMap((ep) => ep.directors))];
}

/**
 * Gets a unique list of all writers who have contributed to the show
 * @returns An array of unique writer credits with their roles
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
