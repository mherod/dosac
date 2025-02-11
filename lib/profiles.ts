import malcolm from "@/public/characters/malcom.jpg";
import jamie from "@/public/characters/jamie.jpg";
import peter from "@/public/characters/peter.jpg";
import nicola2 from "@/public/characters/nicola2.jpg";
import terri from "@/public/characters/terri.webp";
import type { StaticImageData } from "next/image";

/** Department constants for character affiliations */
export const DEPARTMENTS = {
  NUMBER_10: "Number 10",
  DOSAC: "DoSAC/DSA",
  OPPOSITION: "Opposition",
  PRESS: "Press",
  OTHER_GOVERNMENT: "Other Government",
  EXTERNAL: "External",
  CIVIL_SERVICE: "Civil Service",
} as const;

/** Role constants for character positions */
export const ROLES = {
  SENIOR_LEADERSHIP: "Senior Leadership",
  MINISTER: "Minister",
  SPECIAL_ADVISOR: "Special Advisor",
  PRESS_OFFICER: "Press Officer",
  CIVIL_SERVANT: "Civil Servant",
  JOURNALIST: "Journalist",
  CANDIDATE: "Candidate",
  OTHER: "Other",
  DIRECTOR_OF_COMMUNICATIONS: "Director of Communications",
} as const;

/** Political party constants */
export const PARTIES = {
  LABOUR: "Labour",
  CONSERVATIVE: "Conservative",
  LIBERAL_DEMOCRAT: "Liberal Democrat",
} as const;

/** Department type derived from DEPARTMENTS constant */
export type Department = (typeof DEPARTMENTS)[keyof typeof DEPARTMENTS];

/** Role type derived from ROLES constant */
export type Role = (typeof ROLES)[keyof typeof ROLES];

/** Party type derived from PARTIES constant */
export type Party = (typeof PARTIES)[keyof typeof PARTIES];

/** Character origin information */
export interface CharacterOrigin {
  city?: string;
  area?: string;
  country: string;
}

/** Character personal information including family and background */
export interface CharacterPersonal {
  age?: number;
  birthYear?: number;
  /**
   *
   */
  family?: {
    spouse?: boolean | { name: string; occupation?: string };
    children?: boolean | { daughters?: number; sons?: number };
    siblings?:
      | boolean
      | {
          sister?: { location?: string; occupation?: string };
        };
    nieces?: boolean;
    parents?: {
      father?: string;
      mother?: string;
    };
  };
  relationships?: {
    past?: string[];
    present?: string[];
  };
  background?: {
    education?: string;
    previousCareer?: string;
    interests?: string[];
    party?: string;
    affiliation?: string;
    career?: string[];
  };
}

/** Main character interface containing all character information */
export interface Character {
  name: string;
  shortName: string;
  fullName: string;
  description: string;
  image?: string | StaticImageData;
  occupation?: string;
  nationality?: string;
  department: Department[];
  role: Role[];
  origin?: CharacterOrigin;
  personal?: CharacterPersonal;
  details: string[];
  party?: Party;
  frameHighlights?: string[];
  relatedProfiles?: {
    id: CharacterId;
    relationship: string;
  }[];
}

export const characters: Record<string, Character> = {
  malcolm: {
    name: "Malcolm Tucker",
    shortName: "Malcolm",
    fullName: "Malcolm Tucker",
    description:
      "Former Director of Communications for Number 10 and Opposition, feared Scottish enforcer of government policy",
    image: malcolm,
    occupation:
      "Media Adviser to the Leader of the Opposition (Series 4), Director of Communications for Number 10 (Series 1-3)",
    nationality: "Scottish",
    department: [DEPARTMENTS.NUMBER_10],
    role: [ROLES.SENIOR_LEADERSHIP],
    origin: {
      city: "Glasgow",
      area: "Gorbals",
      country: "Scotland",
    },
    personal: {
      age: 50,
      family: {
        spouse: false,
        children: false,
        siblings: true,
        nieces: true,
      },
      relationships: {
        past: ["Kelly Grogan (BBC Health Correspondent)"],
      },
      background: {
        party: "Labour",
        affiliation: "HM Opposition (Series 4), HM Government (Series 1-3)",
        career: [
          "Media Adviser to the Leader of the Opposition (Series 4)",
          "General Election Advisor (Series 4)",
          "Director of Communications - Number 10 (Series 1-3)",
        ],
      },
    },
    details: [
      "Born and raised in the Gorbals area of south Glasgow, Scotland",
      "Self-made man of humble origins who rose to power in Westminster",
      "Has a young niece whose drawings decorate his office walls",
      "Spends his 50th birthday alone in his office, reflecting his solitary life",
      "No wife or children of his own, and claims to have no real friends",
      "Former relationship with BBC health correspondent Kelly Grogan, who later dates Simon Hewitt",
      "Scottish Director of Communications for Number 10 (Series 1-3)",
      "Later becomes Director of Communications for the Opposition (Series 4)",
      "Known for his ruthless approach to managing government communications",
      "Has very few real friends due to his aggressive management style",
      "Maintains a complex rivalry with other spin doctors including Cal Richards",
      "Shows occasional warmth to Glenn due to his loyalty and common sense",
      "Relies heavily on Jamie McDonald as his aggressive enforcer",
      "Has long-standing rivalry with Julius Nicholson despite eventual alliance",
      "Shows surprising sympathy towards Nicola Murray initially",
      "Maintains genuine affection for his secretary Sam",
      "Uses Ollie Reeder in schemes despite finding him irritating",
      "Masterfully handles ministerial crises through intimidation and spin",
      "Forces minister Cliff Lawton's resignation while maintaining appearances",
      "Manages Hugh Abbot's various PR disasters with decreasing patience",
      "Expert at manipulating press coverage and controlling media narratives",
      "Successfully spins policy U-turns and governmental miscommunications",
      "Struggles with the rise of the 'nutters' loyal to the future PM Tom",
      "Orchestrates complex political manipulations during leadership transition",
      "Successfully maneuvers to become Tom's media liaison despite opposition",
      "Eventually falls from power during the Goolding Inquiry",
    ],
    party: PARTIES.LABOUR,
    frameHighlights: [
      "s03e01-06-39.680", // "Malcolm Tucker, Malcolm Tucker, Malcolm Tucker. Malcolm."
      "s03e01-07-17.120", // "Malcolm Tucker. The real deal. Hello."
      "s03e06-17-45.240", // "There's a huge difference between me saying to you..."
      "s03e07-13-48.360", // "I'll tell you a home truth, Malcolm Tucker..."
      "s02e03-03-08.840", // "Mr Malcolm Tucker turning it all the way up to 11 in the lobby."
      "s03e07-26-03.080", // "You cannot fuck me, I am unfuckable..."
      "s03e07-26-58.440", // Malcolm's resignation
      "s02e02-27-44.200", // "Morning, morning, morning! What's the story in Bala-fucking-mory?"
      "s02e02-27-48.000", // "Reshuffle! Excellent! You win a year's supply of condoms, which in your case is four."
      "s02e03-28-44.480", // "I'm gonna have a swear box installed on Monday."
      "s02e03-28-47.880", // "What? Fucking joking, you twat!"
      "s01e01-05-15.400", // "You no longer have purchase in the sarcasm world. Get on the phone..."
    ],
    relatedProfiles: [
      { id: "jamie", relationship: "Right-hand man and enforcer" },
      { id: "sam", relationship: "Trusted personal secretary" },
      { id: "julius", relationship: "Professional rival turned ally" },
      { id: "steve", relationship: "Former colleague and bitter enemy" },
      { id: "kelly", relationship: "Former romantic relationship" },
      { id: "hugh", relationship: "Minister whose PR disasters he managed" },
      {
        id: "nicola",
        relationship: "Minister he initially supported then ousted",
      },
      { id: "tom", relationship: "Future PM he maneuvered to serve" },
      { id: "ollie", relationship: "Useful pawn in political schemes" },
      {
        id: "cal",
        relationship: "Professional rival and occasional tennis partner",
      },
    ],
  },
  jamie: {
    name: "Jamie McDonald",
    shortName: "Jamie",
    fullName: "James McDonald",
    description:
      "Senior Press Officer and Malcolm Tucker's enforcer at Number 10",
    image: jamie,
    occupation: "Senior Press Officer at Number 10",
    nationality: "Scottish",
    department: [DEPARTMENTS.NUMBER_10],
    role: [ROLES.SENIOR_LEADERSHIP],
    origin: {
      city: "Motherwell",
      area: "Lanarkshire",
      country: "Scotland",
    },
    personal: {
      age: 45,
      background: {
        education: "University of Glasgow, Seminary training (incomplete)",
        previousCareer: "Training to be a priest before entering politics",
        interests: ["Al Jolson's music"],
        party: "Labour",
        affiliation: "HM Government (Series 2 & Specials)",
      },
    },
    details: [
      "Born James McDonald in Motherwell, Scotland with a distinctive Lanarkshire accent",
      "Educated at the University of Glasgow before entering seminary training",
      "Former seminary student who left priesthood training for politics",
      "Serves as Senior Press Officer at Number 10 during pre-Tom Davis administration",
      "Malcolm Tucker's right-hand man and deputy at Number 10",
      "Major fan of American entertainer Al Jolson",
      "Known for his aggressive and intimidating approach in politics",
      "Shows polite and gentlemanly demeanor to those outside politics",
      "Frequently deployed to terrorise ministers and civil servants",
      "Works closely with Malcolm on crisis management",
      "Turns against Malcolm during leadership transition chaos",
      "Leaks story about Tom's alleged antidepressant use",
      "Attempts to seize power during political transition",
      "Shares Malcolm's frustration with the rising 'nutters' faction",
      "Involved in failed attempt to prepare Ben Swain for Paxman interview",
      "Has a particularly violent and explosive temper",
      "Expert in aggressive media management techniques",
      "Feared throughout Whitehall for his confrontational style",
      "Often handles the more 'hands-on' aspects of political enforcement",
      "Threatens Ollie Reeder for insulting Al Jolson's music",
    ],
    frameHighlights: [
      "s02e01-05-53.200",
      "s03e02-20-36.840",
      "s03e05-24-21.400",
    ],
    relatedProfiles: [
      { id: "malcolm", relationship: "Boss and mentor" },
      { id: "cal", relationship: "Professional rival" },
      {
        id: "tom",
        relationship: "Leaked damaging story about his antidepressant use",
      },
      { id: "ben", relationship: "Failed to prepare for Paxman interview" },
      { id: "ollie", relationship: "Threatened over Al Jolson insult" },
    ],
  },
  nicola: {
    name: "Nicola Murray",
    shortName: "Nicola",
    fullName: "Rt. Hon. Nicola Allison Murray MP",
    description:
      "Former Leader of the Opposition (2010-2012) and Secretary of State for DoSAC",
    occupation:
      "Leader of the Opposition (2010-2012), Secretary of State for DoSAC (Series 3)",
    department: [DEPARTMENTS.DOSAC],
    role: [ROLES.SENIOR_LEADERSHIP],
    image: nicola2,
    personal: {
      family: {
        spouse: {
          name: "James Murray",
          occupation:
            "Works at Albany (company with DoSAC prison PFI contract)",
        },
        children: true,
      },
      background: {
        party: "Labour",
        affiliation: "HM Opposition (Series 4), HM Government (Series 3)",
        career: [
          "Leader of the Opposition (2010-2012)",
          "Secretary of State for Social Affairs and Citizenship (Series 3)",
        ],
      },
    },
    details: [
      "Appointed as Secretary of State for DoSAC during cabinet reshuffle",
      "Selected by Malcolm Tucker as last resort replacement for Hugh Abbot",
      "Introduced to DoSAC team by Terri Coverley at Richmond Terrace offices",
      "Initially meets Glenn Cullen and Ollie Reeder from Hugh's former team",
      "Comments that Glenn 'looks like he works in menswear at Selfridges'",
      "Arrives with ambitious plans for social mobility initiatives",
      "Quickly learns department lacks budget for major initiatives",
      "Immediately faces crisis over husband's job at Albany",
      "Husband James works at company with DoSAC prison PFI contract",
      "Attempts to downplay PFI connection due to timing of contract and employment",
      "Warned by Malcolm about press interest despite technical innocence",
      "Ordered by Malcolm to remove lumbar support chair to avoid appearing 'comfortable'",
      "Served as Leader of the Opposition from 2010 to 2012",
      "Ousted from leadership by Malcolm Tucker in favour of Dan Miller",
      "Faces immediate crisis due to husband's PFI contract conflicts of interest",
      "Plans to send daughter to private school, creating political controversy",
      "Suffers from claustrophobia, leading Malcolm to label her an 'omnishambles'",
      "Victim of Malcolm's staged 'I AM BENT' photo during Leamington Spa by-election",
      "Forced to choose between damaging her daughter's or husband's future",
      "Develops social mobility initiatives with Malcolm's promised support",
      "Struggles with her public image and media appearances",
      "Deals with various personal issues affecting her political career",
      "Often clashes with Malcolm over policy decisions and PR strategy",
      "Attempts to implement her 'Fourth Sector' initiative",
      "Rises to Leader of the Opposition despite initial inexperience",
      "Leadership ends through Malcolm Tucker's political manoeuvring",
      "Replaced by Dan Miller after losing party confidence",
      "Faces constant challenges balancing family life with political career",
      "Known for her somewhat neurotic personality and claustrophobia",
    ],
    party: PARTIES.LABOUR,
    relatedProfiles: [
      { id: "malcolm", relationship: "Director of Communications and nemesis" },
      { id: "helen", relationship: "Special Adviser" },
      { id: "dan", relationship: "Leadership rival and successor" },
      { id: "ollie", relationship: "Special Adviser at DoSAC" },
      { id: "glenn", relationship: "Special Adviser at DoSAC" },
    ],
  },
  peter: {
    name: "Peter Mannion",
    shortName: "Peter",
    fullName: "Rt. Hon. Peter Mannion MP",
    description:
      "Secretary of State for Social Affairs and Citizenship, veteran 'One Nation' Conservative politician with over three decades of parliamentary experience",
    image: peter,
    occupation:
      "Secretary of State for Social Affairs and Citizenship (Series 4-present)",
    department: [DEPARTMENTS.DOSAC],
    role: [ROLES.SENIOR_LEADERSHIP],
    personal: {
      age: 54,
      birthYear: 1958,
      family: {
        spouse: true,
        children: true,
      },
      relationships: {
        past: [
          "Jackie Williamson (Opposition MP, 1989)",
          "Unnamed researcher (1995)",
        ],
        present: ["Tina Mannion (1982-present)"],
      },
      background: {
        education: "Classics",
        party: "Conservative",
        affiliation:
          "HM Government (Series 4), HM Opposition (Series 3 & Specials), House of Commons (1980's-present)",
        career: [
          "Secretary of State for Social Affairs and Citizenship (Series 4)",
          "Shadow Secretary of State for Social Affairs (Series 3 & Specials)",
          "Conservative Party Leadership Candidate (pre-Series 3)",
          "Junior Minister for Fisheries, DEFRA (mid-1980s, resigned)",
          "Member of Parliament (1980's-present)",
        ],
        interests: ["Smoking", "Board member of three major tobacco companies"],
      },
    },
    details: [
      "Born in 1958, studied Classics at university",
      "Entered politics before the 1980s, becoming MP in early 1980s",
      "Self-identifies as a 'One Nation' Conservative",
      "Appointed Junior Minister for Fisheries in DEFRA during mid-1980s",
      "Resigned from Fisheries position following a sex scandal",
      "Married Tina Mannion in 1982, known for urinating against Big Ben on his stag night",
      "Marriage nearly ended in 1989 due to affair with Opposition MP Jackie Williamson",
      "Makes maintenance payments for illegitimate son from Williamson affair",
      "Had another affair with an unnamed researcher in 1995",
      "Challenged JB for Conservative Party leadership pre-Series 3",
      "Appointed Shadow Secretary for Social Affairs after losing leadership contest",
      "Serves on the board of three major tobacco companies and is a smoker",
      "Current Secretary of State for Social Affairs and Citizenship",
      "Veteran Conservative politician with over three decades of experience",
      "Often frustrated by modern political practices and social media",
      "Frequently clashes with his modernising advisers, particularly Stewart Pearson",
      "Known for his dry wit and sardonic attitude towards modern politics",
      "Struggles with the Conservative party's modernisation agenda",
      "Has a complex relationship with his special advisers, particularly Emma Messinger",
      "Trusts Emma's competence while simultaneously 'fearing and mistrusting' her",
      "Often expresses disdain for modern political culture and PR practices",
      "Successfully transitions from Opposition to Government with Conservative victory",
      "Maintains traditional Conservative values despite party modernisation",
      "Regular target for Stewart Pearson's attempts at modernisation",
      "Prefers old-school political approaches to new media strategies",
      "Long-standing member of Parliament since the 1980s",
      "Survived multiple personal scandals throughout his political career",
      "Represents the old guard of Conservative politics",
    ],
    frameHighlights: [
      "s03e04-21-05.880", // "Ah Stewart, what flavour of nut-brown piss are you gonna pour into my ear?"
      "s03e08-23-09.360", // "The Fucker?! And here you thought he was just a myth created to frighten naughty MPs into eating their truffles and swan."
      "s03e07-20-14.960", // "Do you not drink coffee any more or is it all port and swans' blood these days?"
      "s03e02-19-25.680", // "I expect you're probably more a single malt man."
      "s03e05-13-17.760", // "Yeah, well, actually Stewart called me IN"
    ],
    party: PARTIES.CONSERVATIVE,
    relatedProfiles: [
      { id: "emma", relationship: "Trusted but feared Special Adviser" },
      { id: "phil", relationship: "Long-term Special Adviser" },
      { id: "stewart", relationship: "Communications Director and moderniser" },
      { id: "fergus", relationship: "Coalition partner and Junior Minister" },
    ],
  },
  terri: {
    name: "Terri Coverley",
    shortName: "Terri",
    fullName: "Theresa Jessica Coverley",
    description:
      "Director of Communications at DoSAC, former Waitrose PR executive turned senior civil servant",
    image: terri,
    occupation: "Director of Communications - DoSAC",
    department: [DEPARTMENTS.DOSAC],
    role: [ROLES.CIVIL_SERVANT],
    personal: {
      family: {
        spouse: true,
        children: {
          daughters: 1,
        },
        siblings: {
          sister: {
            location: "Hastings",
            occupation: "Mental health worker",
          },
        },
        parents: {
          father: "Deceased (Series 2, stroke)",
          mother: "In care home (as of Specials)",
        },
      },
      background: {
        previousCareer: "Head of Press at Waitrose",
        affiliation: "Civil Service",
        career: [
          "Director of Communications - DoSAC (Present)",
          "Head of Press - Waitrose (Previous)",
        ],
        interests: [
          "Shopping at Waitrose",
          "Amateur dramatics and musical theatre",
          "Wine tasting",
          "Gardening",
          "Office protocol",
          "Civil Service procedures",
        ],
      },
    },
    details: [
      "Senior civil servant serving as Director of Communications at DoSAC",
      "Joined Civil Service from private sector as part of initiative to bring business expertise to government",
      "Previously served as Head of Press at Waitrose",
      "Known for strict adherence to Civil Service protocols and procedures",
      "Professional and prudish in nature, often managing departmental PR crises",
      "Maintains professional distance from political appointees",
      "Often clashes with special advisers over press strategy",
      "Prioritises job security and pension benefits over political goals",
      "Frequently reminds colleagues of her private sector experience",
      "Takes pride in her Civil Service grade and position",
      "Manages departmental press office and communications strategy",
      "Supervises Robyn Murdoch despite delegating most work to her",
      "Maintains careful records of all communications activities",
      "Expert at navigating Civil Service bureaucracy",
      "Shows particular interest in proper filing procedures",
      "Regularly shops at Waitrose, maintaining loyalty to former employer",
      "Focuses on process and procedure over actual outcomes",
      "Often uses her 'private sector' experience to justify decisions",
      "Survives multiple ministerial changes through careful neutrality",
      "Takes extended leave during personal crises, including father's death from stroke in Series 2",
      "Known for 'mopping up' the department's bad press",
      "Masters the art of avoiding responsibility while maintaining position",
      "Active member of an amateur dramatic and musical society, often organizing rehearsals during work hours",
      "Has a diabetic dog named Max who she attempts to get on Britain's Got Talent in Series 4",
      "Sister works in mental health sector in Hastings",
      "Mother resides in a care home as of the Specials",
      "Enjoys wine tasting and gardening in her spare time",
    ],
    relatedProfiles: [
      { id: "robyn", relationship: "Press Office assistant" },
      { id: "glenn", relationship: "Departmental colleague" },
      { id: "ollie", relationship: "Departmental colleague" },
    ],
  },
  hugh: {
    name: "Hugh Abbot",
    shortName: "Hugh",
    fullName: "Rt. Hon. Hugh Abbot MP",
    description: "Former Secretary of State for Social Affairs",
    occupation: "Secretary of State for Social Affairs (Series 1-2)",
    department: [DEPARTMENTS.DOSAC],
    role: [ROLES.SENIOR_LEADERSHIP],
    personal: {
      background: {
        party: "Labour",
        affiliation: "HM Government (Series 1-3)",
        career: ["Secretary of State for Social Affairs (Series 1-2)"],
      },
    },
    details: [
      "Original Secretary of State for Social Affairs before department became DoSAC",
      "Appointed as Minister for the Department of Social Affairs after Cliff Lawton's resignation",
      "First major action was a botched anti-benefit fraud initiative launch",
      "Forced to make an empty press conference due to Malcolm's last-minute intervention",
      "Struggles with being out of touch with common people and popular culture",
      "Had to watch 'zeitgeist tapes' at Malcolm's insistence",
      "Supported a flawed juvenile rehabilitation policy based on focus group approval",
      "Co-authored controversial housing bill with Dan Miller",
      "Caught in scandal over keeping empty London flat despite his own housing bill",
      "Nearly forced to resign over the flat scandal but saved by Dan Miller's strategic resignation",
      "Involved in factory worker PR disaster requiring Malcolm's intervention",
      "Participated in plot against Julius Nicholson during cabinet reshuffle",
      "Department promoted to DoSAC after helping Malcolm against Julius",
      "Struggled with conscience over SEN bill affecting special needs pupils",
      "Sent inappropriate email to young girl in Reigate instead of Glenn",
      "Lied to Select Committee about meeting experts opposing the SEN bill",
      "Often at odds with focus groups and public perception",
      "Subject to Malcolm Tucker's constant management and intervention",
      "Survived multiple potential career-ending scandals",
    ],
    frameHighlights: [
      "s01e01-21-45.280", // "I'm not quite sure what level of reality I'm supposed to be operating on"
      "s01e02-00-39.120", // "I work, I eat, I shower..."
      "s01e03-00-43.880", // "I'm the fucking daddy!"
      "s01e03-14-52.800", // "They should just clone ministers..."
      "s02e01-08-21.800", // "Robyn, all events are regional..."
      "s02e03-11-21.840", // "I'm gonna tell the PM straight up, this bill is a load of old bollocks!"
      "s01e01-17-21.720", // "We trick them. We trick them. Tinselly thing and they come along and then we say..."
    ],
    party: PARTIES.LABOUR,
    relatedProfiles: [
      {
        id: "malcolm",
        relationship: "Communications Director who managed his crises",
      },
      { id: "glenn", relationship: "Senior Special Adviser and confidant" },
      { id: "ollie", relationship: "Junior Special Adviser" },
      { id: "terri", relationship: "Civil Service Press Secretary" },
      {
        id: "dan",
        relationship: "Co-author of housing bill and strategic rival",
      },
      { id: "cliff", relationship: "Predecessor as Secretary of State" },
    ],
  },
  glenn: {
    name: "Glenn Cullen",
    shortName: "Glenn",
    fullName: "Glenn Cullen",
    description: "Former Senior Special Adviser at DoSAC, Labour Party veteran",
    occupation:
      "Former Senior Special Adviser to the Secretary of State, DoSAC",
    department: [DEPARTMENTS.DOSAC],
    role: [ROLES.SPECIAL_ADVISOR],
    personal: {
      family: {
        children: true,
      },
      background: {
        party: "Labour (former)",
        affiliation: "HM Government (Series 1-3)",
      },
    },
    details: [
      "Long-serving Special Advisor at the Department of Social Affairs",
      "Has a son with special needs, affecting his view on the SEN bill",
      "Works closely with Hugh Abbot on policy matters",
      "Involved in the plot against Julius Nicholson",
      "Experienced advisor with deep understanding of political machinery",
      "Often serves as a voice of conscience in the department",
      "Part of the team that helped Malcolm maintain his position against Julius",
      "Provides emotional support and guidance to Hugh during crises",
    ],
    frameHighlights: [
      "s01e01-17-46.960", // "And we've probably got ten million we can throw at it."
      "s01e01-17-50.760", // "That's good, that, because it sounds like a lot, doesn't it?"
    ],
    relatedProfiles: [
      { id: "hugh", relationship: "Minister he served as Senior Adviser" },
      { id: "ollie", relationship: "Fellow Special Adviser" },
      { id: "malcolm", relationship: "Respected for loyalty and common sense" },
      { id: "terri", relationship: "Civil Service colleague" },
      { id: "nicola", relationship: "Later minister he advised" },
    ],
  },
  ollie: {
    name: "Oliver Reeder",
    shortName: "Ollie",
    fullName: "Dr. Oliver Francis Reeder",
    description:
      "Director of Communications and Policy Adviser to the Leader of the Opposition, former DoSAC Special Advisor",
    occupation: "Director of Communications and Policy Adviser to Dan Miller",
    department: [DEPARTMENTS.DOSAC],
    role: [ROLES.SENIOR_LEADERSHIP],
    origin: {
      area: "Lincolnshire",
      country: "England",
    },
    personal: {
      age: 35,
      background: {
        education:
          "University of Cambridge (Undergraduate), PhD in Funding Structures",
        party: "Labour",
        affiliation: "HM Opposition (Series 4), HM Government (Series 1-3)",
        career: [
          "Director of Communications for the Opposition (Series 4)",
          "Policy Adviser to the Leader of the Opposition (Series 4)",
          "Special Adviser to the Secretary of State, DoSAC (Series 3)",
          "Junior Policy Adviser to the Secretary of State, DoSAC (Series 1-Specials)",
          "Political Analyst at Millbank Think Tank (3 years post-Cambridge)",
        ],
      },
      relationships: {
        past: [
          "Emma Messinger (Opposition Advisor, Series 2-3, ended during leadership transition)",
          "Angela Heaney (Political Journalist, Prior to Series 1, ended via email)",
        ],
      },
    },
    details: [
      "Born and raised in Lincolnshire",
      "Cambridge graduate with PhD in funding structures from unspecified university",
      "Headhunted by Millbank-based think tank after Cambridge graduation",
      "Spent three years as political analyst at the think tank",
      "Hired by government as a 'fresh faced, ideas man'",
      "Started as Junior Policy Adviser at DoSAC under Hugh Abbot",
      "Promoted to Special Adviser under Nicola Murray's leadership",
      "Eventually becomes Director of Communications for Dan Miller's Opposition",
      "Past relationship with journalist Angela Heaney ended via email before Series 1",
      "Dated Opposition advisor Emma Messinger during Series 2-3",
      "Emma steals Malcolm's immigration centre visit idea during their relationship",
      "Often used by Malcolm Tucker in various political schemes",
      "Frequently caught between departmental politics and press relations",
      "Part of Hugh Abbot's team during major policy initiatives",
      "Participated in leaking false rumours about Julius Nicholson",
      "Used by Malcolm to shift media focus between stories",
      "Sent to ITN to redirect attention from Holhurst to Hugh's factory incident",
      "Regularly interacts with Malcolm Tucker during crisis management",
      "Shows growing political ambition throughout his career",
      "Transitions from government to opposition with Dan Miller",
      "Demonstrates increasing political cunning over time",
      "Often viewed as a 'wannabe Malcolm' by colleagues",
      "Maintains press connections through past relationship with Angela",
      "Successfully navigates leadership transitions to advance career",
      "Rises to senior position despite early reputation for inexperience",
      "Career progression shows steady rise through advisory roles",
      "Becomes key figure in Opposition communications strategy",
    ],
    frameHighlights: [
      "s03e02-04-25.320", // "You can't just overwrite minutes! You specifically can't do it, 'cause you can't unlock a PDF file."
    ],
    party: PARTIES.LABOUR,
    relatedProfiles: [
      { id: "hugh", relationship: "First minister as Junior Adviser" },
      { id: "malcolm", relationship: "Used in various political schemes" },
      { id: "glenn", relationship: "Fellow Special Adviser" },
      {
        id: "emma",
        relationship: "Former romantic relationship and political rival",
      },
      { id: "angela", relationship: "Former girlfriend turned journalist" },
      { id: "dan", relationship: "Squash partner and eventual boss" },
      { id: "nicola", relationship: "Minister at DoSAC" },
    ],
  },
  julius: {
    name: "Julius Nicholson",
    shortName: "Julius",
    fullName: "Rt. Hon. the Lord Julius Nicholson of Arnage",
    description: "Life Peer and former Special Adviser to the Prime Minister",
    occupation:
      "Special Adviser and Head of Advanced Implementation Unit, Number 10",
    department: [DEPARTMENTS.NUMBER_10],
    role: [ROLES.SPECIAL_ADVISOR],
    personal: {
      background: {
        party: "Labour",
        affiliation: "HM Government",
        career: [
          "Life Peer",
          "Special Adviser to the Prime Minister",
          "Head of Advanced Implementation Unit, Number 10",
        ],
      },
    },
    details: [
      "Appointed as special advisor to the Prime Minister",
      "Known for proposing ludicrous government projects",
      "Frequently challenges Malcolm Tucker's authority",
      "Cut DSA out of Malcolm's prestigious '8:30 meetings'",
      "Planned to significantly downsize the department",
      "Victim of Malcolm's scheme during cabinet reshuffle",
      "Rumoured to be in line for Foreign Secretary position (false leak)",
      "Demoted by PM after Malcolm's manipulation",
      "Represents the 'blue-sky thinking' approach to government",
    ],
    relatedProfiles: [
      {
        id: "malcolm",
        relationship: "Long-standing rival turned eventual ally",
      },
      { id: "steve", relationship: "Used inquiry to remove from power" },
      {
        id: "hugh",
        relationship: "Minister affected by his departmental changes",
      },
    ],
  },
  ben: {
    name: "Ben Swain",
    shortName: "Ben",
    fullName: "Rt. Hon. Ben Swain MP",
    description:
      "Former Minister of State for Immigration at DoSAC and Shadow Cabinet Minister",
    occupation:
      "Former Shadow Cabinet Minister, Former Minister of State for Immigration - DoSAC",
    department: [DEPARTMENTS.DOSAC],
    role: [ROLES.MINISTER],
    personal: {
      background: {
        party: "Labour",
        affiliation: "HM Opposition (Series 4), HM Government (Series 1-3)",
        career: [
          "Shadow Cabinet Minister (Series 4)",
          "Minister of State for Immigration - DoSAC (Series 3)",
          "Minister of State for Social Affairs and Citizenship (Series 3)",
        ],
      },
    },
    details: [
      "Junior minister aligned with the 'nutters' faction loyal to future PM Tom",
      "Suffered catastrophic interview with Jeremy Paxman on immigration",
      "Failed to properly prepare despite Malcolm and Jamie's efforts",
      "Embarrassed himself and the government on national television",
      "Briefly suggested as potential leadership candidate",
      "Quickly dismissed as a serious contender",
      "Used by Malcolm to further discredit Nick's judgment",
      "Represents the rising influence of those loyal to the future PM",
      "Part of the new generation challenging Malcolm's control",
      "Notable for his disastrous media appearances",
      "Served as Minister of State for Social Affairs and Citizenship",
      "Sacked from ministerial position by Nicola Murray",
      "Transition to Opposition following government change",
      "Known for nervous blinking during television interviews",
      "Failed to effectively handle immigration portfolio",
    ],
    party: PARTIES.LABOUR,
    relatedProfiles: [
      {
        id: "malcolm",
        relationship: "Attempted to manage Paxman interview disaster",
      },
      {
        id: "jamie",
        relationship: "Failed media trainer for Paxman interview",
      },
      { id: "nicola", relationship: "Minister who sacked him" },
    ],
  },
  nick: {
    name: "Nice Nutter Nick",
    shortName: "Nick",
    fullName: "The Right Honourable Nick",
    description: "Junior Minister and leadership transition player",
    occupation: "Junior Minister",
    department: [DEPARTMENTS.OPPOSITION],
    role: [ROLES.CANDIDATE],
    details: [
      "Junior minister seen as a threat to Malcolm's position",
      "Key player in the chaotic leadership transition",
      "Falls for Malcolm's manipulation regarding Clare Ballentine",
      "Claims Ballentine suggestion as his own idea",
      "Further compromised by suggesting Ben Swain as candidate",
      "Exposed as disloyal to Tom through Malcolm's scheming",
      "Represents the ambitious 'nutter' faction challenging established power",
      "Ultimately outmaneuvered by Malcolm's political expertise",
    ],
  },
  clare: {
    name: "Clare Ballentine",
    shortName: "Clare",
    fullName: "Rt. Hon. Clare Ballentine MP",
    description:
      "Labour Backbench MP and Chair of the Education Select Committee",
    occupation: "Chair of the Select Committee on Education",
    department: [DEPARTMENTS.OPPOSITION],
    role: [ROLES.OTHER],
    personal: {
      background: {
        party: "Labour",
        affiliation: "HM Opposition",
        career: ["Backbench MP", "Chair of the Select Committee on Education"],
      },
    },
    details: [
      "Used as a pawn in Malcolm's political maneuvering",
      "Suggested as potential leadership candidate",
      "Part of Malcolm's scheme to expose Nick's disloyalty",
      "Ultimately refuses to stand for leadership",
      "Her candidacy suggestion reveals power plays within party",
      "Unwitting participant in Malcolm's complex political strategy",
    ],
  },
  dan: {
    name: "Dan Miller",
    shortName: "Dan",
    fullName: "Rt. Hon. Dan Miller MP",
    description:
      "Leader of the Opposition and Leader of the Labour Party, former Minister of State for Social Affairs",
    occupation:
      "Leader of the Opposition and Leader of the Labour Party (Series 4), Former Deputy Leader of the Opposition, Former Minister of State for Social Affairs",
    department: [DEPARTMENTS.DOSAC],
    role: [ROLES.SENIOR_LEADERSHIP],
    personal: {
      background: {
        party: "Labour",
        affiliation: "HM Opposition (Series 4), HM Government (Series 1-3)",
        career: [
          "Leader of the Opposition and Labour Party (Series 4-present)",
          "Deputy Leader of the Opposition under Nicola Murray",
          "Leadership candidate (lost to Murray on technicality)",
          "Minister of State for Social Affairs (Series 1)",
        ],
      },
    },
    details: [
      "Initially serves as Minister of State for Social Affairs under Hugh Abbot",
      "Known for charming personality in television interviews and parliament",
      "Successfully helped push through controversial housing bill",
      "Developed friendly relationships with Terri Coverley and Ollie Reeder",
      "Regular squash partner with Ollie, causing tension with Hugh Abbot",
      "Co-authored the controversial housing bill with Hugh Abbot",
      "Bill prohibited owning empty second properties",
      "Strategically resigned during the flat scandal before Hugh could act",
      "Met with Malcolm Tucker before Hugh to deliver resignation",
      "Resignation earned significant praise from Prime Minister",
      "PM praised him as 'dazzlingly bright, talented, committed and honourable'",
      "Viewed as 'new force in British politics' after strategic resignation",
      "Considered potential challenger to Tom Davis for party leadership",
      "Disappeared during crucial leadership transition night",
      "Malcolm Tucker suspected independent leadership bid preparations",
      "Instead made strategic deal to back Tom Davis's leadership bid",
      "Supported Davis in television interview following morning",
      "Ran for party leadership but lost to Nicola Murray on technicality",
      "Appointed Deputy Leader of the Opposition under Murray",
      "Finally assumes Labour leadership after Murray's resignation",
      "Murray's resignation orchestrated by Malcolm Tucker",
      "Masters the art of political timing and public perception",
      "Known for smooth political maneuvering and strategic ambition",
      "Popular with both press and public throughout career",
      "Built career through carefully timed political moves",
      "Successfully navigated multiple leadership transitions",
    ],
    party: PARTIES.LABOUR,
    relatedProfiles: [
      {
        id: "hugh",
        relationship: "Co-authored housing bill before strategic resignation",
      },
      { id: "nicola", relationship: "Succeeded as Leader of the Opposition" },
      { id: "malcolm", relationship: "Key player in leadership transition" },
      {
        id: "ollie",
        relationship:
          "Regular squash partner and eventual Communications Director",
      },
      {
        id: "tom",
        relationship: "Made strategic alliance during leadership transition",
      },
    ],
  },
  cliff: {
    name: "Cliff Lawton",
    shortName: "Cliff",
    fullName: "Rt. Hon. Cliff Lawton MP",
    description:
      "Labour Backbench MP, former Secretary of State for Social Affairs",
    occupation: "Backbench MP, Former Secretary of State for Social Affairs",
    department: [DEPARTMENTS.DOSAC],
    role: [ROLES.SENIOR_LEADERSHIP, ROLES.OTHER],
    personal: {
      background: {
        party: "Labour",
        affiliation: "HM Opposition",
        career: [
          "Backbench MP (Present)",
          "Secretary of State for Social Affairs (Series 1)",
        ],
      },
    },
    details: [
      "Original Secretary of State for Social Affairs before department became DoSAC",
      "Forced to resign due to press pressure orchestrated by Malcolm Tucker",
      "Given the illusion of resigning voluntarily ('jumping before being pushed')",
      "Replaced by Hugh Abbot as Secretary of State",
      "Victim of Malcolm Tucker's strategic political maneuvering",
      "His resignation marks one of Malcolm's typical power plays",
      "Currently serves as backbench MP after ministerial career",
      "Led department during its original incarnation as Social Affairs",
      "One of Malcolm Tucker's early ministerial casualties",
    ],
    frameHighlights: [
      "s01e01-04-24.400", // "Scope. What, like, um...shooting up in the Cabinet Office or something?"
      "s01e01-05-29.560", // "You want me to write my own obituary?"
    ],
    party: PARTIES.LABOUR,
  },
  angela: {
    name: "Angela Heaney",
    shortName: "Angela",
    fullName: "Angela Heaney",
    description: "Political journalist and former girlfriend of Ollie Reeder",
    occupation: "Journalist",
    department: [DEPARTMENTS.DOSAC],
    role: [ROLES.JOURNALIST],
    details: [
      "Political journalist with significant coverage of DSA affairs",
      "Former girlfriend of Ollie Reeder, creating complex dynamics",
      "Originally assigned to cover Hugh's anti-benefit fraud initiative",
      "Intimidated by Malcolm Tucker into not reporting government's policy flip-flopping",
      "Broke the story about Hugh Abbot's empty flat scandal",
      "Frequently caught between journalistic integrity and political pressure",
      "Key player in exposing departmental scandals",
      "Often manipulated or pressured by Malcolm Tucker",
      "Maintains complicated relationships with both Ollie and the department",
      "Regular target for managed leaks and spin",
    ],
    relatedProfiles: [
      {
        id: "ollie",
        relationship: "Former boyfriend turned political contact",
      },
      { id: "malcolm", relationship: "Frequent target of intimidation" },
      { id: "hugh", relationship: "Minister whose scandals she covered" },
    ],
  },
  simon: {
    name: "Simon Hewitt",
    shortName: "Simon",
    fullName: "Simon Hewitt",
    description:
      "Sharp journalistic critic of Hugh Abbot with personal connection to Malcolm Tucker",
    occupation: "Journalist",
    department: [DEPARTMENTS.PRESS],
    role: [ROLES.JOURNALIST],
    personal: {
      relationships: {
        present: ["Kelly Grogan (BBC Health Correspondent)"],
      },
    },
    details: [
      "Known for his critical coverage of Hugh Abbot's ministry",
      "Dating BBC health correspondent Kelly Grogan, Malcolm Tucker's ex-girlfriend",
      "Personal rivalry with Malcolm Tucker due to relationship with Kelly",
      "Falsely accused of engineering the focus group scandal",
      "Subject of attempted intimidation by Malcolm and Hugh",
      "Inadvertently benefited from their paranoid reaction to focus group incident",
      "Represents the more aggressive side of political journalism",
      "His perceived threat led to unnecessary self-inflicted wounds by the department",
      "Personal connection to Malcolm adds extra tension to their professional conflicts",
    ],
  },
  liam: {
    name: "Liam Bentley",
    shortName: "Liam",
    fullName: "Rt. Hon. Liam Bentley MP",
    description: "Labour MP for Leamington Spa",
    occupation: "Member of Parliament for Leamington Spa",
    department: [DEPARTMENTS.OPPOSITION],
    role: [ROLES.OTHER],
    personal: {
      background: {
        party: "Labour",
        affiliation: "HM Opposition",
        career: ["Member of Parliament for Leamington Spa"],
      },
    },
    details: [
      "Labour Party candidate in the Leamington Spa by-election",
      "Campaign threatened by independent candidate (previous MP's daughter)",
      "Receives support from party figures including Nicola Murray",
      "Central figure in Malcolm's by-election crisis management",
      "Nickname 'Bent' leads to unfortunate photo opportunity with Nicola",
      "Campaign becomes entangled with DoSAC's public relations issues",
    ],
  },
  cal: {
    name: "Cal Richards",
    shortName: "Cal",
    fullName: "Cal Richards",
    description:
      "Conservative Party's feared Chief Election Strategist, nicknamed 'The Fucker'",
    occupation: "Chief Election Strategist",
    department: [DEPARTMENTS.OTHER_GOVERNMENT],
    role: [ROLES.SENIOR_LEADERSHIP],
    personal: {
      background: {
        party: "Conservative",
        affiliation: "HM Government (Series 4)",
      },
    },
    details: [
      "Chief Election Strategist for the Conservative Party",
      "Nicknamed 'The Fucker', considered even more aggressive than Malcolm Tucker",
      "Known for excessively cruel and borderline psychopathic behaviour",
      "Has legendary status within Conservative Party for aggressive tactics",
      "Maintains surprisingly cordial relationship with Malcolm Tucker",
      "Plays occasional tennis matches with Malcolm despite being political opponents",
      "Bullied Stewart Pearson by pretending to sack him",
      "Known for indiscriminately shouting torrents of abuse at staff",
      "One of the few spin doctors universally feared across all parties",
      "His appointment notably approved of by Malcolm Tucker himself",
      "Key figure in Conservative Party's election strategy",
    ],
    relatedProfiles: [
      { id: "malcolm", relationship: "Professional rival and tennis partner" },
      { id: "jamie", relationship: "Opposition enforcer rival" },
      {
        id: "stewart",
        relationship: "Bullied Conservative communications director",
      },
    ],
  },
  steve: {
    name: "Steve Fleming",
    shortName: "Steve",
    fullName: "Rt. Hon. Steve Fleming MP",
    description:
      "Former Chief Whip and Acting Director of Communications for Number 10",
    occupation:
      "Acting Director of Communications - Number 10, Former Chief Whip",
    department: [DEPARTMENTS.NUMBER_10],
    role: [ROLES.SENIOR_LEADERSHIP],
    personal: {
      background: {
        party: "Labour",
        affiliation: "HM Government",
        career: ["Acting Director of Communications - Number 10", "Chief Whip"],
      },
    },
    details: [
      "Former Director of Communications forced to resign by Malcolm Tucker in 2003",
      "Known for his obsequious, unctuous personality ('Obsessive Repulsive Disorder')",
      "Harbours deep mutual hatred with Malcolm Tucker predating his resignation",
      "Rarely swears but frequently loses temper when faced with opposition",
      "Shows signs of mental instability in his interactions",
      "Forces Malcolm's resignation by informing press before telling him",
      "Briefly returns to power before being forced out again by Malcolm",
      "Falls victim to Malcolm's revenge via Julius Nicholson's inquiry report",
      "Forced to resign after less than a week back in power",
      "One of the three universally feared spin doctors alongside Cal and Stewart",
    ],
    relatedProfiles: [
      {
        id: "malcolm",
        relationship: "Bitter rival who forced his resignation",
      },
      {
        id: "julius",
        relationship: "Used inquiry report to force second resignation",
      },
    ],
  },
  stewart: {
    name: "Dr Stewart Pearson",
    shortName: "Stewart",
    fullName: "Dr. Stewart Pearson",
    description:
      "Former Director of Communications at Cabinet Office, eco-friendly moderniser known for incomprehensible jargon",
    occupation:
      "Director of Communications - Cabinet Office (Series 4), Opposition Director of Communications (Series 3 & Specials)",
    department: [DEPARTMENTS.OTHER_GOVERNMENT],
    role: [ROLES.SENIOR_LEADERSHIP],
    origin: {
      city: "Leeds",
      area: "Yorkshire",
      country: "England",
    },
    personal: {
      background: {
        education: "PhD (subject unspecified)",
        party: "Conservative",
        affiliation:
          "HM Government (Series 4), HM Opposition (Series 3 & Specials)",
        career: [
          "Director of Communications - Cabinet Office (Series 4)",
          "Opposition Director of Communications (Series 3 & Specials)",
          "Conservative Party Communications (2002-present)",
        ],
        interests: [
          "Cooking",
          "Playing flute",
          "Irish bodhran",
          "Steve Jobs admirer",
          "Academic writing",
        ],
      },
      relationships: {
        past: ["Three previous marriages"],
      },
    },
    details: [
      "Born in Leeds, Yorkshire",
      "Holds PhD in unspecified subject",
      "Divorced three times due to being 'extraordinarily precise'",
      "Passionate cook and musician (flute and Irish bodhran)",
      "Strong admirer of Steve Jobs, took morning off when Jobs died",
      "May suffer from claustrophobia",
      "Working for Conservative Party since 2002 on 'detoxifying' image",
      "Close personal friend of JB, though influence declines in Series 4",
      "Published academic paper 'The Iconography of Consensus' (2006) on government transparency",
      "Known for eco-friendly, media-savvy approach to politics",
      "Struggles to communicate in plain English, favouring technical jargon",
      "Avoids raising voice, except when flying Ryanair",
      "Uses passive aggression rather than Malcolm Tucker's direct approach",
      "Former Director of Communications at Cabinet Office",
      "Previously Opposition's Director of Communications",
      "Known for pseudo-modern political jargon requiring 'subtitles'",
      "Cool, calm demeanor masking intellectual mediocrity",
      "Despised for his 'touchy feely' management style",
      "Maintains mutual hatred with Malcolm Tucker",
      "Described by Malcolm as 'utterly fucking contemptible'",
      "Occasionally cooperates with Malcolm for mutual party interests",
      "Agreed with Malcolm to avoid political point-scoring over sweatshop scandal",
      "Victim of Cal Richards' bullying",
      "One of the three universally feared spin doctors in British politics",
      "Strong advocate for Conservative Party modernisation",
      "Often clashes with Peter Mannion over modernising approaches",
      "Prefers Emma Messinger's competence over Phil Smith's traditional style",
      "Key figure in Conservative Party's communication strategy",
    ],
    relatedProfiles: [
      { id: "peter", relationship: "Minister he attempts to modernise" },
      { id: "emma", relationship: "Favoured Special Adviser" },
      { id: "phil", relationship: "Less favoured Special Adviser" },
      { id: "cal", relationship: "Intimidating rival who bullied him" },
    ],
  },
  sam: {
    name: "Sam Cassidy",
    shortName: "Sam",
    fullName: "Samantha Cassidy",
    description: "Malcolm Tucker's loyal and capable personal secretary",
    occupation: "Personal Secretary",
    department: [DEPARTMENTS.NUMBER_10],
    role: [ROLES.CIVIL_SERVANT],
    details: [
      "Malcolm Tucker's trusted personal secretary",
      "One of the few people Malcolm shows genuine affection towards",
      "Maintains efficiency despite Malcolm's demanding nature",
      "Shows loyalty during Malcolm's forced resignation",
      "One of few people amused rather than intimidated by Malcolm's wit",
      "Present throughout the Goolding Inquiry supporting Malcolm",
      "Visibly concerned during Malcolm's career-ending testimony",
      "Manages Malcolm's hectic schedule and urgent communications",
      "Trusted with sensitive information and private matters",
      "Maintains professional composure despite Malcolm's explosive temperament",
    ],
    party: PARTIES.LABOUR,
    relatedProfiles: [
      { id: "malcolm", relationship: "Boss she loyally supports" },
    ],
  },
  emma: {
    name: "Emma Florence Messinger",
    shortName: "Emma",
    fullName: "Emma Florence Messinger",
    description:
      "Highly competent Special Adviser to Peter Mannion, trusted by party leadership for key assignments",
    occupation:
      "Special Adviser to the Secretary of State for Social Affairs and Citizenship",
    department: [DEPARTMENTS.DOSAC],
    role: [ROLES.SPECIAL_ADVISOR],
    personal: {
      age: 29,
      relationships: {
        past: ["Dr. Oliver Reeder (Series 2-Series 3)"],
      },
      background: {
        party: "Conservative",
        affiliation:
          "HM Government (Series 4-present), HM Opposition (Specials-Series 3)",
        career: [
          "Special Adviser to the Secretary of State, DoSAC (Series 4-present)",
          "Policy Adviser to the Shadow Secretary of State (Series 3 & Specials)",
          "Special Adviser to Minister Levitt (Series 2)",
          "Advisor in Shadow Social Affairs",
          "Advisor in Shadow Defence",
        ],
      },
    },
    details: [
      "Most competent and responsible member of Peter Mannion's advisory team",
      "Highly regarded by Stewart Pearson compared to other advisors",
      "Trusted by Peter Mannion despite him 'fearing and mistrusting' her",
      "Career progression from Shadow Defence to DoSAC Special Adviser",
      "Previously worked as advisor to Minister Levitt during Series 2",
      "Served in both Shadow Social Affairs and Shadow Defence",
      "Transitions from Opposition to Government with Conservative victory",
      "Regularly selected for important party assignments and projects",
      "Writes key speeches including Peter's CBI address",
      "Amends policy drafts for Number 10",
      "Attends high-level meetings with party leadership",
      "Cross-party relationship with Ollie Reeder during Opposition years",
      "Uses political relationship with Ollie for intelligence gathering",
      "Successfully steals Malcolm Tucker's immigration centre visit idea",
      "Demonstrates skilled political manoeuvring through personal connections",
      "Relationship with Ollie ends during leadership transition",
      "Maintains professional relationship with both Peter Mannion and Stewart Pearson",
      "Shows aptitude for both departmental and party political work",
      "Effectively balances departmental duties with wider party responsibilities",
      "Often handles the most crucial aspects of policy implementation",
      "Preferred by leadership for complex assignments over other advisors",
    ],
    party: PARTIES.CONSERVATIVE,
    relatedProfiles: [
      { id: "peter", relationship: "Secretary of State she advises" },
      { id: "phil", relationship: "Fellow Special Adviser and flatmate" },
      {
        id: "stewart",
        relationship: "Communications Director who values her competence",
      },
      {
        id: "ollie",
        relationship: "Former romantic partner and political rival",
      },
    ],
  },
  kelly: {
    name: "Kelly Grogan",
    shortName: "Kelly",
    fullName: "Kelly Grogan",
    description:
      "BBC Health Correspondent with connections to both Malcolm Tucker and Simon Hewitt",
    occupation: "BBC Health Correspondent",
    department: [DEPARTMENTS.PRESS],
    role: [ROLES.JOURNALIST],
    personal: {
      relationships: {
        past: ["Malcolm Tucker"],
        present: ["Simon Hewitt"],
      },
    },
    details: [
      "Works as Health Correspondent for the BBC",
      "Former girlfriend of Malcolm Tucker",
      "Current relationship with journalist Simon Hewitt",
      "Her relationship history creates tension between Malcolm and Simon",
      "Relationship change occurred approximately three months before events",
      "Professional role intersects with political coverage",
      "Connection to both government and press figures",
    ],
    relatedProfiles: [
      { id: "malcolm", relationship: "Former romantic partner" },
      { id: "simon", relationship: "Current romantic partner" },
    ],
  },
  tom: {
    name: "Tom Davis",
    shortName: "Tom",
    fullName: "Rt. Hon. Tom Davis MP",
    description: "Future Prime Minister and leader of the 'nutters' faction",
    occupation: "Prime Minister (Series 4)",
    department: [DEPARTMENTS.NUMBER_10],
    role: [ROLES.SENIOR_LEADERSHIP],
    personal: {
      background: {
        party: "Labour",
        affiliation: "HM Government (Series 4)",
      },
    },
    details: [
      "Rises to become Prime Minister after leadership transition",
      "Leader of the 'nutters' faction within the party",
      "Subject of leaked rumors about antidepressant use",
      "Target of Jamie McDonald's attempted political sabotage",
      "Eventually accepts Malcolm Tucker as media liaison",
      "Central figure in party's power shift",
      "Represents new generation of party leadership",
      "Gains support from key figures like Dan Miller",
      "Subject of various political machinations during transition",
      "His rise marks significant change in party dynamics",
    ],
    party: PARTIES.LABOUR,
  },
  phil: {
    name: "Philip Bartholomew Cornelius Smith",
    shortName: "Phil",
    fullName: "Phil Smith",
    description:
      "Special Adviser to Peter Mannion, known for his childish demeanour and pop culture obsession despite his serious political role",
    occupation:
      "Special Adviser to the Secretary of State for Social Affairs and Citizenship",
    department: [DEPARTMENTS.DOSAC],
    role: [ROLES.SPECIAL_ADVISOR],
    personal: {
      background: {
        party: "Conservative",
        affiliation:
          "HM Government (Series 4), HM Opposition (Series 3 & Specials)",
        career: [
          "Special Adviser to the Secretary of State, DoSAC (Series 4-present)",
          "Policy Adviser to the Shadow Secretary of State (Series 3 & Specials)",
          "Long-term advisor to Peter Mannion during Opposition years",
        ],
        interests: [
          "Fantasy literature (Lord of the Rings, The Hobbit, Harry Potter)",
          "Science Fiction (Star Wars, Star Trek)",
          "Game of Thrones",
          "Collecting mint condition action figures",
          "Wham! and Queen music",
          "Karaoke and dressing up",
        ],
      },
      relationships: {
        present: ["Flatmates: Emma Messinger, Affers"],
      },
    },
    details: [
      "Special Adviser to Peter Mannion at DoSAC",
      "Long-term member of Peter Mannion's team since Opposition years",
      "Lives in central London flat with Emma Messinger and Affers",
      "Avid fan of fantasy and science fiction, maintaining action figure collection",
      "Passion for pop culture often criticised by conservative colleagues",
      "Enthusiastic about Wham! and Queen music",
      "Known for participating in karaoke and dressing up",
      "Displays notably childish attitude despite serious political role",
      "Struggles with personal relationships and intimacy",
      "Less preferred by Stewart Pearson compared to Emma Messinger",
      "Often overshadowed by Emma's competence and effectiveness",
      "Maintains position in Mannion's team despite being less favoured",
      "Works alongside Emma on departmental policy and communications",
      "Represents more traditional Conservative advisory approach",
      "Transitions from Opposition to Government with Conservative victory",
      "Combines political work with extensive pop culture knowledge",
      "Personal interests often clash with professional environment",
      "Long-standing loyalty to Peter Mannion despite differences",
      "Maintains childlike enthusiasm despite political pressures",
      "Collection of mint condition action figures reflects personal priorities",
    ],
    party: PARTIES.CONSERVATIVE,
  },
  mary: {
    name: "Mary Drake",
    shortName: "Mary",
    fullName: "Rt. Hon. Mary Drake MP",
    description:
      "Director of Communications for Number 10, replacing Stewart Pearson",
    occupation: "Director of Communications - Number 10",
    department: [DEPARTMENTS.NUMBER_10],
    role: [ROLES.SENIOR_LEADERSHIP],
    personal: {
      background: {
        party: "Conservative",
        affiliation: "HM Government (Series 4)",
        career: [
          "Director of Communications - Number 10 (Series 4-present)",
          "Minister of State - Home Office (Previous)",
        ],
      },
    },
    details: [
      "Current Director of Communications for Number 10",
      "Replaced Stewart Pearson in the communications role",
      "Previously served as Minister of State at the Home Office",
      "Senior Conservative Party figure in government",
      "Key member of government communications team",
      "Represents Conservative interests in media strategy",
      "Manages government's public relations and messaging",
      "Coordinates communications across departments",
      "Works closely with special advisers on media strategy",
      "Part of the Conservative government's senior leadership team",
    ],
    party: PARTIES.CONSERVATIVE,
  },
  helen: {
    name: "Helen Hatley",
    shortName: "Helen",
    fullName: "Helen Hatley",
    description: "Special Adviser to Nicola Murray, former Opposition adviser",
    occupation: "Special Adviser to Nicola Murray MP",
    department: [DEPARTMENTS.OPPOSITION],
    role: [ROLES.SPECIAL_ADVISOR],
    personal: {
      background: {
        party: "Labour",
        affiliation: "HM Opposition (Series 3-4)",
        career: [
          "Special Adviser to Nicola Murray MP",
          "Special Adviser to the Leader of the Opposition",
        ],
      },
    },
    details: [
      "Special Adviser to Nicola Murray throughout her career",
      "Follows Nicola from DoSAC to Opposition leadership",
      "Key member of Nicola's advisory team",
      "Provides strategic counsel during leadership challenges",
      "Helps manage Nicola's public image and policy positions",
      "Part of Opposition's communications strategy team",
    ],
    party: PARTIES.LABOUR,
    relatedProfiles: [
      { id: "nicola", relationship: "Minister she advises through career" },
    ],
  },
  geoff: {
    name: "Geoff Holhurst",
    shortName: "Geoff",
    fullName: "Rt. Hon. Geoff Holhurst MP",
    description: "Shadow Cabinet Minister and former Defence Secretary",
    occupation: "Shadow Cabinet Minister",
    department: [DEPARTMENTS.OPPOSITION],
    role: [ROLES.MINISTER],
    personal: {
      background: {
        party: "Labour",
        affiliation: "HM Opposition (Series 4)",
        career: [
          "Shadow Cabinet Minister (Series 4)",
          "Secretary of State for Defence (Previous)",
        ],
      },
    },
    details: [
      "Current Shadow Cabinet Minister",
      "Former Secretary of State for Defence",
      "Senior figure in Labour Party",
      "Part of Opposition front bench team",
      "Experienced ministerial veteran",
      "Key player in party's defence policy",
    ],
    party: PARTIES.LABOUR,
  },
  john: {
    name: "John Duggan",
    shortName: "John",
    fullName: "John Duggan",
    description:
      "Inept Labour Party Press Officer struggling with basic communications duties",
    occupation: "Party Press Officer",
    department: [DEPARTMENTS.OPPOSITION],
    role: [ROLES.PRESS_OFFICER],
    personal: {
      age: 35,
      background: {
        party: "Labour",
        affiliation:
          "HM Opposition (Series 4-present), HM Government (Series 3-4)",
        career: [
          "Labour Party Press Officer (Series 4-present)",
          "Junior Communications Officer (Series 3-4)",
        ],
      },
    },
    details: [
      "Known by colleagues as 'JD' despite professional setting",
      "Hired to handle party-political communications beyond Civil Service remit",
      "Demonstrated chronic incompetence in basic press officer duties",
      "Failed to prevent damaging leaks about leadership challenges",
      "Struggled to manage basic media monitoring responsibilities",
      "Showed poor judgment in handling sensitive party communications",
      "First showcased incompetence at Eastbourne party conference",
      "Commented on Nicola Murray's domestic holiday photos instead of Florida trip",
      "Consistently misnamed key constituent Julie Price as 'Julie Prince'",
      "Misinterpreted 'swanning around on yacht' as reference to homosexuality",
      "Made inappropriate 'big willy' analogy about workload to Shadow Leader",
      "Infamous 'Duggan Promise' to handle issues meaning he'd do nothing",
      "Joined Ollie Reeder in making tasteless cafe collapse jokes",
      "Leaked false story about PM Tom Davis on Malcolm Tucker's orders",
      "Compared himself to Nazi guard following orders during sensitive operation",
      "Made inappropriate Hitler salute in front of constituent Julie Price",
      "Asked Julie if she was Jewish after Nazi reference, causing discomfort",
      "Triggered traumatic memories by referencing coffee near cafe collapse widow",
      "Regularly bypassed by colleagues for important press matters",
      "Unable to effectively coordinate with Number 10 communications team",
      "Known for missing obvious political implications in press statements",
      "Failed to anticipate basic follow-up questions from journalists",
      "Responsible for multiple embarrassing typos in official releases",
      "Once accidentally sent internal critique to press gallery distribution list",
      "Required constant supervision for simple communications tasks",
      "Became liability during sensitive leadership transition period",
      "Maintained position due to party loyalty rather than competence",
      "Frequently mocked by special advisers for professional shortcomings",
      "Subject of Malcolm Tucker's famous 'How hard is it to press send?' rant",
      "Career survived through bureaucratic inertia rather than merit",
      "Epitomized the decline in party political appointments' quality",
      "Became cautionary tale about patronage over competence in politics",
    ],
    party: PARTIES.LABOUR,
  },
  ed: {
    name: "Ed Atkins",
    shortName: "Ed",
    fullName: "Edward Atkins",
    description: "Number 10 Press Officer under Labour government",
    occupation: "Press Officer - Number 10",
    department: [DEPARTMENTS.NUMBER_10],
    role: [ROLES.PRESS_OFFICER],
    personal: {
      background: {
        party: "Labour",
        affiliation: "HM Government",
      },
    },
    details: [
      "Press Officer at Number 10",
      "Works under Malcolm Tucker's leadership",
      "Handles government media relations",
      "Part of Number 10's communications team",
      "Manages press office responsibilities",
    ],
    party: PARTIES.LABOUR,
  },
  doug: {
    name: "Doug Hayes",
    shortName: "Doug",
    fullName: "Rt. Hon. Doug Hayes MP",
    description: "Labour Party Backbench MP",
    occupation: "Backbench MP",
    department: [DEPARTMENTS.OPPOSITION],
    role: [ROLES.OTHER],
    personal: {
      background: {
        party: "Labour",
        affiliation: "HM Opposition",
      },
    },
    details: [
      "Labour Party Backbench MP",
      "Participates in parliamentary debates",
      "Represents constituency interests",
      "Member of Parliamentary Labour Party",
    ],
    party: PARTIES.LABOUR,
  },
  frankie: {
    name: "Frankie",
    shortName: "Frankie",
    fullName: "Frankie",
    description: "Number 10 Press Officer under Labour government",
    occupation: "Press Officer - Number 10",
    department: [DEPARTMENTS.NUMBER_10],
    role: [ROLES.PRESS_OFFICER],
    personal: {
      background: {
        party: "Labour",
        affiliation: "HM Government",
      },
    },
    details: [
      "Press Officer at Number 10",
      "Works in government communications",
      "Part of Malcolm Tucker's press team",
      "Handles media relations for government",
    ],
    party: PARTIES.LABOUR,
  },
  suzie: {
    name: "Suzie",
    shortName: "Suzie",
    fullName: "Suzie",
    description: "Special Adviser to Ben Swain",
    occupation: "Special Adviser to Ben Swain MP",
    department: [DEPARTMENTS.OPPOSITION],
    role: [ROLES.SPECIAL_ADVISOR],
    personal: {
      background: {
        party: "Labour",
        affiliation: "HM Opposition",
      },
    },
    details: [
      "Special Adviser to Ben Swain",
      "Provides policy and communications support",
      "Assists with ministerial responsibilities",
      "Part of Ben Swain's advisory team",
    ],
    party: PARTIES.LABOUR,
  },
  nick_h: {
    name: "Nick Hanway",
    shortName: "Nick",
    fullName: "Nick Hanway",
    description: "Press Officer and Spin Doctor for Tom Davis",
    occupation: "Press Officer - Number 10",
    department: [DEPARTMENTS.NUMBER_10],
    role: [ROLES.PRESS_OFFICER],
    personal: {
      background: {
        party: "Labour",
        affiliation: "HM Government",
      },
    },
    details: [
      "Press Officer and Spin Doctor for Tom Davis",
      "Handles media relations for Prime Minister's office",
      "Part of government communications team",
      "Works on Number 10's media strategy",
      "Key member of PM's press operation",
    ],
    party: PARTIES.LABOUR,
  },
  robyn: {
    name: "Robyn Murdoch",
    shortName: "Robyn",
    fullName: "Robyn Murdoch",
    description:
      "Senior Press Officer at DoSAC (Civil Service), routinely relegated to secretarial duties",
    department: [DEPARTMENTS.DOSAC],
    role: [ROLES.CIVIL_SERVANT],
    personal: {
      age: 45,
      background: {
        affiliation: "HM Government",
      },
    },
    details: [
      "Officially holds Senior Press Officer grade (SCS1) in Civil Service",
      "In practice functions as Terri Coverley's personal assistant",
      "Manages press office logistics despite theoretical strategic role",
      "Forced to handle photocopying and tea rounds for senior staff",
      "Maintains official records of ministerial engagements",
      "Secretly authors Terri's communications strategy papers",
      "Only civil servant who knows all departmental press passwords",
      "Gatekeeps access to the Minister's daily briefing folder",
      "Compiles FOI disclosures that never get properly reviewed",
      "Pretends not to notice when special advisers 'lose' sensitive documents",
      "Maintains secret archive of unminuted meetings",
      "Knows more about department operations than any special adviser",
      "Compensated at Grade 7 level for HEO responsibilities",
      "Last line of defense against ministerial code violations",
      "Only remembers to claim overtime during spending reviews",
    ],
    relatedProfiles: [
      { id: "terri", relationship: "Nominal boss who delegates all work" },
    ],
  },
  fergus: {
    name: "Fergus Williams",
    shortName: "Fergus",
    fullName: "Rt. Hon. Fergus Williams MP",
    description:
      "Liberal Democrat Minister of State for Social Affairs and Citizenship in coalition government",
    occupation: "Minister of State for Social Affairs and Citizenship",
    department: [DEPARTMENTS.DOSAC],
    role: [ROLES.MINISTER],
    personal: {
      background: {
        party: "Liberal Democrat",
        affiliation: "Coalition Government (Series 4)",
        career: [
          "Minister of State for Social Affairs and Citizenship (Series 4-present)",
        ],
        interests: [
          "Digital technology",
          "Community banking",
          "Social innovation",
        ],
      },
    },
    details: [
      "Appointed as Minister of State in coalition government",
      "Works under Conservative Secretary of State Peter Mannion",
      "Frequent conflicts with Conservative coalition partners",
      "Champion of the Silicon Playgrounds digital initiative",
      "Led failed implementation of Silicon Playgrounds project",
      "Committed £2 billion to community banking project out of social awkwardness",
      "Represents Liberal Democrat interests in coalition",
      "Often clashes with Peter Mannion over policy direction",
      "Pushes for progressive social policies within department",
      "Strong advocate for digital education initiatives",
      "Struggles with coalition power dynamics",
      "Works closely with advisor Adam Kenyon",
      "Faces challenges implementing Liberal Democrat policies",
      "Known for idealistic approach to social policy",
      "Sometimes makes impulsive decisions under pressure",
    ],
    party: PARTIES.LIBERAL_DEMOCRAT,
    relatedProfiles: [
      {
        id: "peter",
        relationship: "Conservative Secretary of State above him",
      },
      { id: "adam", relationship: "Special Adviser" },
    ],
  },
  phil_smith: {
    name: "Phil Smith",
    shortName: "Phil",
    fullName: "Phil Smith",
    description: "Special Adviser to the Secretary of State",
    occupation: "Special Adviser to the Secretary of State",
    department: [DEPARTMENTS.DOSAC],
    role: [ROLES.SPECIAL_ADVISOR],
    details: ["No additional details provided."],
  },
  adam: {
    name: "Adam Kenyon",
    shortName: "Adam",
    fullName: "Adam Kenyon",
    description: "Special Adviser to the Minister of State",
    occupation: "Special Adviser to the Minister of State",
    department: [DEPARTMENTS.DOSAC],
    role: [ROLES.SPECIAL_ADVISOR],
    details: ["No additional details provided."],
  },
  kelly_p: {
    name: "Kelly Peters",
    shortName: "Kelly Peters",
    fullName: "Kelly Peters",
    description: "Civil Servant at DoSAC",
    occupation: "Civil Servant",
    department: [DEPARTMENTS.DOSAC],
    role: [ROLES.CIVIL_SERVANT],
    details: ["No additional details provided."],
  },
  phil_davis: {
    name: "Phil Davis",
    shortName: "Phil Davis",
    fullName: "Phil Davis",
    description: "Civil Servant at DoSAC",
    occupation: "Civil Servant",
    department: [DEPARTMENTS.DOSAC],
    role: [ROLES.CIVIL_SERVANT],
    details: ["No additional details provided."],
  },
  andrew: {
    name: "Andrew",
    shortName: "Andrew",
    fullName: "Andrew",
    description: "Former Civil Servant at DoSAC (Series 3)",
    occupation: "Civil Servant",
    department: [DEPARTMENTS.DOSAC],
    role: [ROLES.CIVIL_SERVANT],
    details: ["No additional details provided."],
  },
} as const;

export type CharacterId = keyof typeof characters;

export const charactersList = Object.entries(characters).map(
  ([id, character]) => ({
    id,
    ...character,
  }),
);

export const departmentLabels: Record<Department, string> = {
  [DEPARTMENTS.NUMBER_10]: "Number 10 Downing Street",
  [DEPARTMENTS.DOSAC]: "Department of Social Affairs and Citizenship",
  [DEPARTMENTS.OPPOSITION]: "Opposition Party",
  [DEPARTMENTS.PRESS]: "Press and Media",
  [DEPARTMENTS.OTHER_GOVERNMENT]: "Other Government Departments",
  [DEPARTMENTS.EXTERNAL]: "External Figures",
  [DEPARTMENTS.CIVIL_SERVICE]: "Civil Service",
};

export const roleLabels: Record<Role, string> = {
  [ROLES.SENIOR_LEADERSHIP]: "Senior Leadership",
  [ROLES.MINISTER]: "Ministers",
  [ROLES.SPECIAL_ADVISOR]: "Special Advisors",
  [ROLES.PRESS_OFFICER]: "Press Officers",
  [ROLES.CIVIL_SERVANT]: "Civil Servants",
  [ROLES.JOURNALIST]: "Journalists",
  [ROLES.CANDIDATE]: "Candidates",
  [ROLES.OTHER]: "Other Roles",
  [ROLES.DIRECTOR_OF_COMMUNICATIONS]: "Director of Communications",
};

export const charactersByDepartment = Object.entries(characters).reduce<
  Record<Department, (Character & { id: string })[]>
>(
  (acc, [id, character]) => {
    character.department.forEach((dept) => {
      if (!acc[dept]) acc[dept] = [];
      acc[dept].push({ id, ...character });
    });
    return acc;
  },
  {
    [DEPARTMENTS.NUMBER_10]: [],
    [DEPARTMENTS.DOSAC]: [],
    [DEPARTMENTS.OPPOSITION]: [],
    [DEPARTMENTS.PRESS]: [],
    [DEPARTMENTS.OTHER_GOVERNMENT]: [],
    [DEPARTMENTS.EXTERNAL]: [],
    [DEPARTMENTS.CIVIL_SERVICE]: [],
  },
);

export const charactersByRole = Object.entries(characters).reduce<
  Record<Role, (Character & { id: string })[]>
>(
  (acc, [id, character]) => {
    character.role.forEach((role) => {
      if (!acc[role]) acc[role] = [];
      acc[role].push({ id, ...character });
    });
    return acc;
  },
  {
    [ROLES.SENIOR_LEADERSHIP]: [],
    [ROLES.MINISTER]: [],
    [ROLES.SPECIAL_ADVISOR]: [],
    [ROLES.PRESS_OFFICER]: [],
    [ROLES.CIVIL_SERVANT]: [],
    [ROLES.JOURNALIST]: [],
    [ROLES.CANDIDATE]: [],
    [ROLES.OTHER]: [],
    [ROLES.DIRECTOR_OF_COMMUNICATIONS]: [],
  },
);

// export const FEATURED_CHARACTERS = [
//   { id: "malcolm", name: "Malcolm Tucker" },
//   { id: "nicola", name: "Nicola Murray" },
//   { id: "peter", name: "Peter Mannion" },
//   { id: "terri", name: "Terri Coverley" },
// ] as const;

export const FEATURED_CHARACTERS = Object.entries(characters)
  .filter(
    ([, character]) => character.frameHighlights?.length || character.image,
  )
  .slice(0, 6)
  .map(([id, character]) => ({
    id,
    name: character.name,
  }));
