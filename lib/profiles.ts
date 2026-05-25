import type { StaticImageData } from "next/image";
import ben from "@/public/characters/ben.png";
import cal from "@/public/characters/cal.jpg";
import cliff from "@/public/characters/cliff.png";
import dan from "@/public/characters/danmiller.webp";
import emma from "@/public/characters/emma.jpg";
import glenn from "@/public/characters/glenn.jpg";
import helen from "@/public/characters/helen-flag.png";
import hugh from "@/public/characters/hugh-flag.png";
import jamie from "@/public/characters/jamie.png";
import julius from "@/public/characters/julius.jpg";
import malcolm from "@/public/characters/malcom-flag.png";
import mary from "@/public/characters/mary.png";
import nicola from "@/public/characters/nicola-flag.png";
import ollie from "@/public/characters/ollie.png";
import peter from "@/public/characters/peter-flag.png";
import phil_smith from "@/public/characters/phil.png";
import robyn from "@/public/characters/robyn-flag.png";
import steve from "@/public/characters/steve.jpg";
import stewart from "@/public/characters/stewart.png";
import terri from "@/public/characters/terri.webp";

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
      "Former Director of Communications for Number 10 and Opposition, Scottish political operative responsible for government communications strategy",
    image: malcolm,
    occupation:
      "Media Adviser to the Leader of the Opposition, Former Director of Communications for Number 10",
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
        affiliation: "HM Opposition, Former HM Government",
        career: [
          "Media Adviser to the Leader of the Opposition",
          "General Election Advisor",
          "Former Director of Communications - Number 10",
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
      "Former Director of Communications for Number 10",
      "Later becomes Director of Communications for the Opposition",
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
      "Functions as the unofficial continuity between departments, Number 10, and party command",
      "Uses leaks, lobby pressure, and personal fear as parallel tools of government",
      "Treats DoSAC as both a policy department and a convenient damage sink for central government",
      "Struggles with the rise of the 'nutters' loyal to the future PM Tom",
      "Orchestrates complex political manipulations during leadership transition",
      "Successfully manoeuvres to become Tom's media liaison despite opposition",
      "Returns to power after Steve Fleming's brief victory but with visibly reduced invulnerability",
      "Goolding Inquiry testimony turns his private threat culture into public institutional evidence",
      "Arrest and resignation statement mark the end of his top-tier political career",
      "Guardian election-era columns extend him as an in-universe political commentator beyond the episodes",
      "Eventually falls from power during the Goolding Inquiry",
    ],
    party: PARTIES.LABOUR,
    frameHighlights: [
      "s01e01-01-01.360", // "He's absolutely useless! He is! He's useless! He's as useless as a marzipan dildo."
      "s02e01-10-12.480", // "How much fucking shit is there on the menu, and what fucking flavour is it?!"
      "s02e02-04-45.520", // "Come the fuck in or fuck the fuck off."
      "s02e03-21-16.400", // "you massive, gay SHITE!"
      "s03e01-00-15.400", // "He's so dense that light bends around him."
      "s03e01-06-39.680", // "Malcolm Tucker, Malcolm Tucker, Malcolm Tucker. Malcolm."
      "s03e01-07-17.120", // "Malcolm Tucker. The real deal. Hello."
      "s03e05-03-35.120", // "Is this my new anal beads?"
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
      {
        id: "jamie",
        relationship:
          "Right-hand man and enforcer - Scottish deputy who shares his aggressive approach, later betrays him during leadership crisis",
      },
      {
        id: "sam",
        relationship:
          "Trusted personal secretary - One of few people he shows genuine affection for, loyal through his downfall",
      },
      {
        id: "julius",
        relationship:
          "Professional rival turned ally - Initially enemies over departmental cuts, later unite against Steve Fleming",
      },
      {
        id: "steve",
        relationship:
          "Former colleague and bitter enemy - Forced his resignation in 2003, returns briefly before Malcolm destroys him again",
      },
      {
        id: "kelly",
        relationship:
          "Former romantic relationship - BBC correspondent, now with Simon Hewitt causing personal tension",
      },
      {
        id: "hugh",
        relationship:
          "Minister whose PR disasters he managed - Incompetent Secretary of State requiring constant damage control",
      },
      {
        id: "nicola",
        relationship:
          "Minister he initially supported then ousted - Hand-picked replacement for Hugh, later orchestrates her resignation for Dan Miller",
      },
      {
        id: "tom",
        relationship:
          "Future PM he manoeuvred to serve - Leader of 'nutters' faction, accepts Malcolm despite initial resistance",
      },
      {
        id: "ollie",
        relationship:
          "Useful pawn in political schemes - Ambitious adviser he manipulates while finding him irritating",
      },
      {
        id: "cal",
        relationship:
          "Professional rival and occasional tennis partner - Conservative enforcer nicknamed 'The Fucker', mutual respect despite opposition",
      },
      {
        id: "glenn",
        relationship:
          "Respected adviser - Shows rare warmth due to Glenn's loyalty and common sense",
      },
      {
        id: "terri",
        relationship:
          "Departmental press officer - Civil servant he considers incompetent but tolerates",
      },
      {
        id: "ben",
        relationship:
          "Failed ministerial project - Junior minister whose Paxman interview becomes legendary disaster",
      },
    ],
  },
  jamie: {
    name: "Jamie McDonald",
    shortName: "Jamie",
    fullName: "James McDonald",
    description:
      "Senior Press Officer and Deputy Communications Director at Number 10",
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
        affiliation: "HM Government",
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
      "Spinners and Losers shows him trying to replace Malcolm through raw panic rather than strategy",
      "His 'Motherwell rules' approach makes him effective in a brawl and useless in a settlement",
      "The Tom Davis antidepressant leak reveals how quickly loyalty collapses during succession chaos",
      "Unlike Malcolm, he lacks the patience to turn violence into lasting institutional control",
      "Functions as the show's purest version of enforcement without statecraft",
    ],
    frameHighlights: ["s02e01-05-53.200"],
    relatedProfiles: [
      {
        id: "malcolm",
        relationship:
          "Boss and mentor - Serves as Malcolm's violent enforcer, shares Scottish background and seminary training",
      },
      {
        id: "cal",
        relationship:
          "Professional rival - Conservative counterpart in aggression and intimidation tactics",
      },
      {
        id: "tom",
        relationship:
          "Leaked damaging story about his antidepressant use - Attempted to sabotage during leadership transition",
      },
      {
        id: "ben",
        relationship:
          "Failed to prepare for Paxman interview - Disastrous attempt at media training ends in humiliation",
      },
      {
        id: "ollie",
        relationship:
          "Threatened over Al Jolson insult - Nearly assaulted him for mocking his musical tastes",
      },
      {
        id: "hugh",
        relationship:
          "Terrorized minister - Regular target of intimidation campaigns",
      },
      {
        id: "nicola",
        relationship:
          "Later ministerial target - Continues intimidation tactics under new Secretary of State",
      },
      {
        id: "glenn",
        relationship:
          "Fellow enforcer target - Despite being on same side, frequently threatens",
      },
    ],
  },
  nicola: {
    name: "Nicola Murray",
    shortName: "Nicola",
    fullName: "Rt. Hon. Nicola Allison Murray MP",
    description:
      "Former Leader of the Opposition (2010-2012) and Secretary of State for DoSAC",
    occupation:
      "Former Leader of the Opposition (2010-2012) and Secretary of State for DoSAC",
    department: [DEPARTMENTS.DOSAC],
    role: [ROLES.SENIOR_LEADERSHIP],
    image: nicola,
    personal: {
      family: {
        spouse: {
          name: "James Murray",
          occupation:
            "Works at Albany (company with DoSAC prison PFI contract)",
        },
        children: {
          daughters: 3,
          sons: 1,
        },
      },
      background: {
        party: "Labour",
        affiliation: "HM Opposition, Former HM Government",
        interests: ["Yoga", "Karaoke"],
        career: [
          "Leader of the Opposition (2010-2012)",
          "Former Secretary of State for Social Affairs and Citizenship",
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
      "Has four children, with Katie identified in transcripts as the 16-year-old eldest child",
      "Plans to change daughter Ella's school, creating political controversy around social mobility",
      "Suffers from claustrophobia, leading Malcolm to label her an 'omnishambles'",
      "Victim of Malcolm's staged 'I AM BENT' photo during Leamington Spa by-election",
      "Forced to choose between damaging Ella's school life or her husband's professional future",
      "Ella's threatened exclusion later collides with Nicola's attempt to recruit a Fourth Sector Pathfinder",
      "Colleagues weaponise small personal details such as yoga and karaoke during Opposition crises",
      "Develops social mobility initiatives with Malcolm's promised support",
      "Struggles with her public image and media appearances",
      "Deals with various personal issues affecting her political career",
      "Often clashes with Malcolm over policy decisions and PR strategy",
      "Attempts to implement her 'Fourth Sector' initiative",
      "Rises to Leader of the Opposition despite initial inexperience",
      "Leadership ends through Malcolm Tucker's political manoeuvring",
      "Replaced by Dan Miller after losing party confidence",
      "Wins the Opposition leadership on a technicality despite Dan Miller's stronger media position",
      "Her domestic life repeatedly becomes part of the political record rather than a private refuge",
      "The Fourth Sector initiative becomes the signature policy that defines her DoSAC tenure",
      "Her Opposition leadership inherits government-era habits: panic, loyalty tests, and dependence on Malcolm",
      "Goolding forces her to account for leak culture from both government and opposition periods",
      "Faces constant challenges balancing family life with political career",
      "Known for her somewhat neurotic personality and claustrophobia",
    ],
    frameHighlights: [
      "s03e01-08-57.600", // Katie identified as Nicola's eldest child
      "s03e01-22-52.240", // "I am bent" photo fallout
      "s03e01-26-24.320", // "omni-shambles"
      "s03e01-27-35.960", // Changing Ella's school
      "s03e04-09-39.920", // Fourth Sector Pathfinder pitch
      "s03e04-27-24.320", // Ella not excluded
      "s03e06-06-13.640", // Back On Track versus Unify
      "s03e06-16-22.920", // "Nicola Murray is back"
      "s04e06-00-35-03.040", // "gold to lead"
      "s04e07-00-13-34.960", // No longer Leader of the Opposition
    ],
    party: PARTIES.LABOUR,
    relatedProfiles: [
      {
        id: "malcolm",
        relationship:
          "Director of Communications and nemesis - Initially supportive, becomes her destroyer through 'omnishambles' campaign",
      },
      {
        id: "helen",
        relationship:
          "Special Adviser - Loyal aide throughout DoSAC and Opposition leadership",
      },
      {
        id: "dan",
        relationship:
          "Leadership rival and successor - Lost to her on technicality, ultimately replaces her through Malcolm's scheme",
      },
      {
        id: "ollie",
        relationship:
          "Special Adviser at DoSAC - Inherited from Hugh, ambitious and unreliable",
      },
      {
        id: "glenn",
        relationship:
          "Special Adviser at DoSAC - Inherited from Hugh, more reliable but she insults his appearance",
      },
      {
        id: "terri",
        relationship:
          "Civil Service communications - Bureaucratic obstacle to her initiatives",
      },
      {
        id: "ben",
        relationship:
          "Junior minister she sacked - Removed him from Immigration post",
      },
      {
        id: "jamie",
        relationship: "Malcolm's enforcer - Frequent target of his aggression",
      },
    ],
  },
  peter: {
    name: "Peter Mannion",
    shortName: "Peter",
    fullName: "Rt. Hon. Peter Mannion MP",
    description:
      "Secretary of State for Social Affairs and Citizenship, veteran 'One Nation' Conservative politician with over three decades of parliamentary experience",
    image: peter,
    occupation: "Secretary of State for Social Affairs and Citizenship",
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
        affiliation: "HM Government, Former HM Opposition, House of Commons",
        career: [
          "Secretary of State for Social Affairs and Citizenship",
          "Former Shadow Secretary of State for Social Affairs",
          "Former Conservative Party Leadership Candidate",
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
      "Challenged JB for Conservative Party leadership",
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
      "Coalition government leaves him sharing DoSAC authority with Fergus Williams",
      "Silicon Playgrounds forces him to front a digital policy he instinctively dislikes",
      "The community bank and Mr Tickel crisis drag him from grumbling observer into active culpability",
      "Goolding exposes the gap between his old-school instincts and the modern leak machine",
      "Survives by presenting exhaustion and contempt as political authenticity",
      "Long-standing member of Parliament since the 1980s",
      "Survived multiple personal scandals throughout his political career",
      "Represents the old guard of Conservative politics",
    ],
    frameHighlights: [
      "s03e04-21-05.880", // "Ah Stewart, what flavour of nut-brown piss are you gonna pour into my ear?"
      "s03e08-23-09.360", // "The Fucker?! And here you thought he was just a myth created to frighten naughty MPs into eating their truffles and swan."
      "s04e01-00-21-27.000", // "I'm bored of this. I'm going for a Twix."
      "s04e03-00-03-35.040", // "When it's at your house? Peter!"
    ],
    party: PARTIES.CONSERVATIVE,
    relatedProfiles: [
      {
        id: "emma",
        relationship:
          "Trusted but feared Special Adviser - Most competent aide, respects while mistrusting her",
      },
      {
        id: "phil",
        relationship:
          "Long-term Special Adviser - Childish pop culture obsessive, loyal but less effective",
      },
      {
        id: "stewart",
        relationship:
          "Communications Director and moderniser - Jargon-spouting guru he despises, forces unwanted changes",
      },
      {
        id: "fergus",
        relationship:
          "Coalition partner and Junior Minister - Liberal Democrat forced on him, frequent policy clashes",
      },
      {
        id: "malcolm",
        relationship:
          "Opposition communications chief - Occasional cooperation despite party differences",
      },
      {
        id: "nicola",
        relationship:
          "Opposition counterpart - Shadow minister in same department",
      },
      {
        id: "terri",
        relationship:
          "Civil Service bureaucrat - Represents everything wrong with government machinery",
      },
    ],
  },
  terri: {
    name: "Terri Coverley",
    shortName: "Terri",
    fullName: "Teresa Jessica Coverley",
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
          father: "Deceased (stroke)",
          mother: "In care home (as of Specials)",
        },
      },
      background: {
        previousCareer: "Press roles at Sainsbury's and Waitrose",
        affiliation: "Civil Service",
        career: [
          "Director of Communications - DoSAC (Present)",
          "Head of Press - Waitrose (Previous)",
          "Press role - Sainsbury's (Previous)",
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
      "Full legal name confirmed under oath as Teresa Jessica Coverley",
      "Identified in dialogue as Head of Press, Civil Service",
      "Joined Civil Service from private sector as part of initiative to bring business expertise to government",
      "Worked in supermarket PR before government, including a Sainsbury's press role and Head of Press at Waitrose",
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
      "Takes extended leave during personal crises, including father's death from stroke",
      "Known for 'mopping up' the department's bad press",
      "Masters the art of avoiding responsibility while maintaining position",
      "Active member of an amateur dramatic and musical society, often organising rehearsals during work hours",
      "Has a diabetic dog named Max who she attempts to get on Britain's Got Talent",
      "Sister works in mental health sector in Hastings",
      "Mother resides in a care home as of the Specials",
      "Later references suggest her mother has alcohol-related health issues",
      "Likes musicals enough for colleagues to weaponise West Side Story at her",
      "Regularly attends wine-tasting, which colleagues treat as a personality diagnosis",
      "Has enough procedural authority that ministers complain when she is left off departmental lists",
      "Series 4 repeatedly treats her admiration for Peter Mannion as open office knowledge",
      "Enjoys wine tasting and gardening in her spare time",
    ],
    frameHighlights: [
      "s04e03-00-17-38.080", // "Two hundred years ago, they wouldn't have let him milk a cow."
      "s04e06-00-23-55.920", // Goolding Inquiry oath as Teresa Jessica Coverley
      "s01e02-01-29.320", // Waitrose reference
      "s02e01-01-28.320", // Father's stroke
      "s03e03-19-05.320", // Max, diabetic dog
      "s04e04-00-11-04.480", // Dog for Britain's Got Talent
      "s04e01-00-10-56.360", // Musicals reference
      "s03e02-19-21.320", // Wine-tasting
    ],
    relatedProfiles: [
      {
        id: "robyn",
        relationship:
          "Press Office assistant - Delegates all actual work while taking credit",
      },
      {
        id: "glenn",
        relationship:
          "Departmental colleague - Senior adviser she considers beneath her Civil Service status",
      },
      {
        id: "ollie",
        relationship:
          "Departmental colleague - Junior adviser she finds irritating and unreliable",
      },
      {
        id: "malcolm",
        relationship: "Number 10 enforcer - Lives in fear of his interventions",
      },
      {
        id: "hugh",
        relationship: "Former minister - Managed his numerous PR disasters",
      },
      {
        id: "nicola",
        relationship:
          "Later minister - Introduces her to department, continues crisis management",
      },
      {
        id: "peter",
        relationship:
          "Coalition minister - Serves under Conservative leadership",
      },
    ],
  },
  hugh: {
    name: "Hugh Abbot",
    shortName: "Hugh",
    fullName: "Rt. Hon. Hugh Abbot MP",
    description: "Former Secretary of State for Social Affairs",
    image: hugh,
    occupation: "Former Secretary of State for Social Affairs",
    department: [DEPARTMENTS.DOSAC],
    role: [ROLES.SENIOR_LEADERSHIP],
    personal: {
      background: {
        party: "Labour",
        affiliation: "Former HM Government",
        career: ["Former Secretary of State for Social Affairs"],
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
      "Character sources consistently spell his surname Abbot, despite some subtitles using Abbott",
      "Married to Kate Abbot with children Alicia and Charlie in extended character material",
      "Old-school Labour instincts make him uneasy with the New Labour presentation machine",
      "The London flat scandal turns a personal convenience into the defining contradiction of his housing policy",
      "His disappearance after Series 2 leaves DoSAC structurally intact but politically leaderless until Nicola arrives",
      "Serves as the clearest early example of Malcolm protecting a minister by repeatedly humiliating him",
    ],
    frameHighlights: [
      "s01e01-16-42.960", // "You've fucking cracked! Are you mad?"
      "s01e01-21-45.280", // "I'm not quite sure what level of reality I'm supposed to be operating on"
      "s01e02-00-39.120", // "I work, I eat, I shower..."
      "s01e03-00-43.880", // "I'm the fucking daddy!"
      "s01e03-13-27.280", // "This is madness. I just own a flat, I haven't raped somebody."
      "s01e03-14-52.800", // "They should just clone ministers..."
      "s01e03-15-09.640", // "like that fucking brushed-aluminium Dan Miller cyberprick!"
      "s01e01-28-47.480", // "Smiling. Inappropriate smiling. And smirking. Smiling and smirking."
      "s02e01-08-21.800", // "Robyn, all events are regional..."
      "s02e03-11-21.840", // "I'm gonna tell the PM straight up, this bill is a load of old bollocks!"
      "s02e03-15-47.480", // "Just one expert? Only one? Not two experts? Less than three but not two?"
      "s01e01-17-21.720", // "We trick them. We trick them. Tinselly thing and they come along and then we say..."
    ],
    party: PARTIES.LABOUR,
    relatedProfiles: [
      {
        id: "malcolm",
        relationship:
          "Communications Director who managed his crises - Constant source of intimidation and forced policy U-turns",
      },
      {
        id: "glenn",
        relationship:
          "Senior Special Adviser and confidant - Loyal supporter, shares concerns about conscience",
      },
      {
        id: "ollie",
        relationship:
          "Junior Special Adviser - Ambitious young aide, jealous of his relationship with Dan Miller",
      },
      {
        id: "terri",
        relationship:
          "Civil Service Press Secretary - Bureaucratic communications head, often clashes over protocol",
      },
      {
        id: "dan",
        relationship:
          "Co-author of housing bill and strategic rival - Junior minister who outmanoeuvres him through strategic resignation",
      },
      {
        id: "cliff",
        relationship:
          "Predecessor as Secretary of State - Previous minister forced out by Malcolm",
      },
      {
        id: "angela",
        relationship:
          "Journalist covering scandals - Exposes his empty flat controversy",
      },
      {
        id: "jamie",
        relationship:
          "Malcolm's enforcer - Frequent source of aggressive intimidation",
      },
      {
        id: "julius",
        relationship:
          "PM's adviser - Threatens departmental cuts, helps plot against him",
      },
    ],
  },
  glenn: {
    name: "Glenn Cullen",
    shortName: "Glenn",
    fullName: "Glenn Cullen",
    description: "Former Senior Special Adviser at DoSAC, Labour Party veteran",
    image: glenn,
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
        affiliation: "Former HM Government",
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
      "Personal experience with special educational needs gives him a sharper conscience on the SEN bill",
      "Becomes one of the few advisers whose moral discomfort is more than tactical positioning",
      "Survives from Hugh's department into Nicola's, making him institutional memory for two ministerial regimes",
      "Series 4 pushes him to breaking point as accumulated loyalty turns into open contempt",
      "His late outburst functions as a career obituary for the exhausted special adviser class",
    ],
    frameHighlights: [
      "s01e01-17-46.960", // "And we've probably got ten million we can throw at it."
      "s01e01-17-50.760", // "That's good, that, because it sounds like a lot, doesn't it?"
      "s03e01-22-05.480", // "What does it say, Terri!?"
    ],
    relatedProfiles: [
      {
        id: "hugh",
        relationship:
          "Minister he served as Senior Adviser - Close confidant, provides emotional support during crises",
      },
      {
        id: "ollie",
        relationship:
          "Fellow Special Adviser - Younger colleague, generational and ideological differences",
      },
      {
        id: "malcolm",
        relationship:
          "Respected for loyalty and common sense - Rare recipient of Malcolm's genuine warmth",
      },
      {
        id: "terri",
        relationship:
          "Civil Service colleague - Works alongside despite her bureaucratic approach",
      },
      {
        id: "nicola",
        relationship:
          "Later minister he advised - New boss who insults his appearance, compares to menswear salesman",
      },
      {
        id: "jamie",
        relationship:
          "Occasional intimidator - Target of threats despite being allies",
      },
      {
        id: "julius",
        relationship:
          "Plotting partner - Helps scheme against during reshuffle",
      },
      {
        id: "dan",
        relationship: "Ministerial colleague - Works with during Hugh's tenure",
      },
    ],
  },
  ollie: {
    name: "Oliver Reeder",
    shortName: "Ollie",
    fullName: "Dr. Oliver Francis Reeder",
    description:
      "Director of Communications and Policy Adviser to the Leader of the Opposition, former DoSAC Special Advisor",
    image: ollie,
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
        affiliation: "HM Opposition, Former HM Government",
        career: [
          "Director of Communications for the Opposition",
          "Policy Adviser to the Leader of the Opposition",
          "Former Special Adviser to the Secretary of State, DoSAC",
          "Former Junior Policy Adviser to the Secretary of State, DoSAC",
          "Political Analyst at Millbank Think Tank (3 years post-Cambridge)",
        ],
      },
      relationships: {
        past: [
          "Emma Messinger (Opposition Advisor, ended during leadership transition)",
          "Angela Heaney (Political Journalist, ended via email)",
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
      "Past relationship with journalist Angela Heaney ended via email",
      "Dated Opposition advisor Emma Messinger",
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
      "His relationship with Emma makes him a cross-party intelligence risk long before coalition politics",
      "By the end of the series he inherits the communications vacuum left by Malcolm's fall",
      "His rise works because he learns enough of Malcolm's methods without carrying Malcolm's mythic authority",
      "Frequently survives by being useful at exactly the moment senior figures need a disposable operator",
      "The profile arc turns him from junior policy irritant into the next version of the machine",
    ],
    frameHighlights: [
      "s01e01-15-55.000", // "Return of capital punishment."
      "s03e02-04-25.320", // "You can't just overwrite minutes! You specifically can't do it, 'cause you can't unlock a PDF file."
    ],
    party: PARTIES.LABOUR,
    relatedProfiles: [
      {
        id: "hugh",
        relationship:
          "First minister as Junior Adviser - Bumbling boss whose mistakes he often inadvertently causes",
      },
      {
        id: "malcolm",
        relationship:
          "Used in various political schemes - Manipulates him as 'wannabe Malcolm', eventual successor",
      },
      {
        id: "glenn",
        relationship:
          "Fellow Special Adviser - Senior colleague, often clash over approaches and generation gap",
      },
      {
        id: "emma",
        relationship:
          "Former romantic relationship and political rival - Opposition adviser, used relationship for intelligence gathering",
      },
      {
        id: "angela",
        relationship:
          "Former girlfriend turned journalist - Ended via email, maintains press connections through her",
      },
      {
        id: "dan",
        relationship:
          "Squash partner and eventual boss - Regular sports companion, becomes his Communications Director",
      },
      {
        id: "nicola",
        relationship:
          "Minister at DoSAC - Second departmental boss, continues advisory role",
      },
      {
        id: "jamie",
        relationship:
          "Target of threats - Nearly assaulted over Al Jolson comment",
      },
      {
        id: "terri",
        relationship:
          "Departmental bureaucrat - Frequent conflicts over press strategy",
      },
      {
        id: "ben",
        relationship:
          "Fellow political climber - Both represent ambitious younger generation",
      },
    ],
  },
  julius: {
    name: "Julius Nicholson",
    shortName: "Julius",
    fullName: "Rt. Hon. the Lord Julius Nicholson of Arnage",
    description: "Life Peer and former Special Adviser to the Prime Minister",
    image: julius,
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
      "Operates as the Prime Minister's policy-intellectual counterweight to Malcolm's communications control",
      "His Advanced Implementation Unit gives bureaucratic shape to Number 10's abstract ambitions",
      "The reshuffle plot shows that policy imagination is still vulnerable to old-fashioned briefing",
      "Later alliance with Malcolm proves that shared survival can override ideological contempt",
      "His inquiry work becomes a weapon against Steve Fleming during Malcolm's counterattack",
    ],
    frameHighlights: [
      "s02e02-04-12.080", // Julius and his blue-sky vision
      "s02e02-12-10.600", // Malcolm Tucker versus Julius Nicholson
      "s02e02-23-02.880", // Julius pushes the reshuffle logic
      "s02e02-28-50.240", // Advanced Implementation Unit
      "s03e07-22-02.520", // Julius's inquiry
      "s03e08-15-37.040", // Malcolm and Julius alliance
      "s03e08-18-54.080", // Steve Fleming report counterattack
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
    image: ben,
    occupation:
      "Former Shadow Cabinet Minister, Former Minister of State for Immigration - DoSAC",
    department: [DEPARTMENTS.DOSAC],
    role: [ROLES.MINISTER],
    personal: {
      background: {
        party: "Labour",
        affiliation: "HM Opposition, Former HM Government",
        career: [
          "Shadow Cabinet Minister",
          "Former Minister of State for Immigration - DoSAC",
          "Former Minister of State for Social Affairs and Citizenship",
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
      "His immigration brief makes him useful to plots despite his limited media competence",
      "The Paxman disaster becomes a shorthand for political unreadiness under direct questioning",
      "As a Tom loyalist, he marks the rising faction Malcolm initially fails to control",
      "Nicola's decision to sack him shows her trying to assert ministerial authority over inherited chaos",
      "In Opposition, he remains more valuable as a symbol and factional number than as an operator",
    ],
    frameHighlights: [
      "s03e06-05-09.840", // Ben's arrival at DoSAC
      "s03e06-05-44.960", // Back On Track
      "s03e06-06-13.640", // Back On Track versus Unify
      "s03e06-26-13.320", // Paxman reference
      "s04e04-00-09-19.920", // Ben Swain resigning rumour
      "s04e04-00-14-29.320", // Ben Swain, Chancellor
      "s04e04-00-23-10.440", // Benjamin Trevor Swain statement
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
    name: "Nick Hanway",
    shortName: "Nick",
    fullName: "Nick Hanway",
    description:
      "Tom Davis loyalist and 'Nutter' faction operator during the leadership transition",
    occupation: "Government press relations officer",
    department: [DEPARTMENTS.OPPOSITION],
    role: [ROLES.PRESS_OFFICER],
    personal: {
      background: {
        party: "Labour",
        affiliation: "Tom Davis faction",
      },
    },
    details: [
      "Nick Hanway is introduced in local transcripts by Malcolm's nickname, 'Nice Nutter Nick'",
      "Works around Tom Davis rather than the core DoSAC ministerial office",
      "Represents the Tom-loyal 'Nutters' faction during the leadership transition",
      "Gathers support for Tom while Malcolm tries to regain control of the succession story",
      "Falls for Malcolm's manipulation regarding Clare Ballentine",
      "Claims Ballentine suggestion as his own idea",
      "Further compromised by suggesting Ben Swain as candidate",
      "Exposed as disloyal to Tom through Malcolm's scheming",
      "Ultimately outmanoeuvred when Dan Miller reveals he was backing Tom Davis all along",
      "Later references place him at the Treasury after the specials",
    ],
    party: PARTIES.LABOUR,
    relatedProfiles: [
      {
        id: "tom",
        relationship: "Future Prime Minister whose succession he supports",
      },
      {
        id: "malcolm",
        relationship:
          "Opposing fixer who manipulates him through the succession night",
      },
      {
        id: "ben",
        relationship: "Fallback candidate floated during the succession panic",
      },
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
      "Used as a pawn in Malcolm's political manoeuvring",
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
    image: dan,
    occupation:
      "Leader of the Opposition and Leader of the Labour Party, Former Deputy Leader of the Opposition, Former Minister of State for Social Affairs",
    department: [DEPARTMENTS.DOSAC],
    role: [ROLES.SENIOR_LEADERSHIP],
    personal: {
      background: {
        party: "Labour",
        affiliation: "HM Opposition, Former HM Government",
        career: [
          "Leader of the Opposition and Labour Party",
          "Deputy Leader of the Opposition under Nicola Murray",
          "Leadership candidate (lost to Murray on technicality)",
          "Former Minister of State for Social Affairs",
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
      "Known for smooth political manoeuvring and strategic ambition",
      "Popular with both press and public throughout career",
      "Built career through carefully timed political moves",
      "Successfully navigated multiple leadership transitions",
      "Back On Track gives him a policy platform that mirrors government social policy from the opposition side",
      "His smoothness makes him the party's anti-Nicola: less authentic, but far easier to package",
      "The technical leadership loss to Nicola becomes the grievance that later makes his succession feel inevitable",
      "Malcolm's final manoeuvres around Nicola turn Dan into the beneficiary of the machine he does not fully control",
      "His police visit in the finale shows him trying to turn administrative failure into statesmanlike gravity",
    ],
    frameHighlights: [
      "s01e03-01-10.120", // Dan Miller introduced as junior minister
      "s01e03-15-09.640", // Hugh calls him "Dan Miller cyberprick"
      "s03e06-05-44.960", // Back On Track policy
      "s03e08-19-47.000", // Ollie joins Dan Miller's team
      "s04e04-00-08-06.360", // Deputy Leader succession plan
      "s04e07-00-05-31.840", // Police station visit
      "s04e07-00-17-46.600", // Dan at Lewisham station
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
    image: cliff,
    occupation: "Backbench MP, Former Secretary of State for Social Affairs",
    department: [DEPARTMENTS.DOSAC],
    role: [ROLES.SENIOR_LEADERSHIP, ROLES.OTHER],
    personal: {
      background: {
        party: "Labour",
        affiliation: "HM Opposition",
        career: [
          "Backbench MP (Present)",
          "Former Secretary of State for Social Affairs",
        ],
      },
    },
    details: [
      "Original Secretary of State for Social Affairs before department became DoSAC",
      "Forced to resign due to press pressure orchestrated by Malcolm Tucker",
      "Given the illusion of resigning voluntarily ('jumping before being pushed')",
      "Replaced by Hugh Abbot as Secretary of State",
      "Victim of Malcolm Tucker's strategic political manoeuvring",
      "His resignation marks one of Malcolm's typical power plays",
      "Currently serves as backbench MP after ministerial career",
      "Led department during its original incarnation as Social Affairs",
      "One of Malcolm Tucker's early ministerial casualties",
      "His removal sets the template for Number 10 making a minister believe a forced resignation is voluntary",
      "Functions as the ghost at the start of DoSAC: everyone after him knows the job can vanish in a morning",
      "His backbench afterlife shows the soft landing offered to ministers useful enough not to destroy",
      "The profile marks the department's first visible transition from person-led scandal to system-led chaos",
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
    frameHighlights: [
      "s01e01-07-19.120", // Angela on the anti-benefit fraud story
      "s01e01-25-22.680", // Hugh greeting Angela
      "s01e01-25-31.240", // Malcolm steers the Angela story
      "s01e02-21-13.920", // Leak to Angela Heaney
      "s01e02-21-42.480", // Calling Angela
      "s01e03-07-24.880", // Daily Mail and Angela
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
    frameHighlights: [
      "s01e02-02-14.680", // Simon Hewitt's column
      "s01e02-17-36.600", // Simon Hewitt's cornflakes
      "s01e02-25-47.200", // Simon Hewitt insult line
      "s01e02-25-56.680", // Hugh spoke to Simon
      "s01e02-26-19.800", // Identifying Hewitt
    ],
    relatedProfiles: [
      {
        id: "malcolm",
        relationship:
          "Professional and personal rival - Dating Malcolm's ex Kelly, frequent conflict target",
      },
      {
        id: "kelly",
        relationship:
          "Current romantic partner - BBC correspondent, Malcolm's former girlfriend",
      },
      {
        id: "hugh",
        relationship:
          "Ministerial target - Writes critical coverage of his failures",
      },
      {
        id: "angela",
        relationship: "Fellow journalist - Both cover political beat",
      },
    ],
  },
  liam: {
    name: "Liam Bentley",
    shortName: "Liam",
    fullName: "Liam Bentley",
    description: "Labour candidate in Leamington Spa by-election",
    occupation: "Labour Party Candidate (later MP for Leamington Spa)",
    department: [DEPARTMENTS.OPPOSITION],
    role: [ROLES.CANDIDATE],
    personal: {
      background: {
        party: "Labour",
        affiliation: "HM Opposition",
        career: ["Labour candidate in Leamington Spa by-election"],
      },
    },
    details: [
      "Labour Party candidate in the Leamington Spa by-election",
      "By-election triggered by death of previous MP Jim Lane",
      "Campaign threatened by Jim Lane's daughter running as independent",
      "Central to famous 'I AM BENT' poster incident with Nicola Murray",
      "Malcolm Tucker deliberately positioned Nicola in front of his campaign poster",
      "Letters of his name were blocked to spell 'I AM BENT' behind Nicola",
      "Incident became part of Nicola's first day 'omnishambles'",
    ],
    frameHighlights: [
      "s03e01-15-49.680", // Liam Bentley contrast
      "s03e01-16-00.280", // Supporting Liam Bentley
      "s03e01-21-20.720", // Looking at Liam's campaign material
      "s03e01-22-07.400", // Liam Bentley sign
      "s03e01-22-52.240", // "I am bent" poster fallout
    ],
  },
  cal: {
    name: "Cal Richards",
    shortName: "Cal",
    fullName: "Cal Richards",
    description:
      "Conservative Party's Chief Election Strategist, nicknamed 'The Fucker'",
    image: cal,
    occupation: "Chief Election Strategist",
    department: [DEPARTMENTS.OTHER_GOVERNMENT],
    role: [ROLES.SENIOR_LEADERSHIP],
    personal: {
      background: {
        party: "Conservative",
        affiliation: "HM Government",
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
      "His reputation works as political folklore before he even appears directly",
      "Functions as proof that Malcolm's methods are not unique to Labour, only differently branded",
      "His bullying of Stewart exposes how fragile the modernising project is under older campaign violence",
      "Maintains enough mutual recognition with Malcolm to make cross-party hostility feel professional",
    ],
    frameHighlights: [
      "s03e08-07-40.560", // "The Fucker" is coming
      "s03e08-22-58.760", // The Fucker downstairs
      "s03e08-23-06.760", // Cal arrival panic
      "s03e08-27-05.840", // JB and Cal Richards
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
    image: steve,
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
      "His 2003 fall gives Malcolm a founding myth as the man who removed another communications chief",
      "Uses process and formal authority more than Malcolm, but lacks Malcolm's instinct for timing",
      "His brief return shows how fragile Malcolm's power becomes once Number 10 stops fearing him",
      "Being destroyed twice makes him a cautionary figure for anyone mistaking office title for control",
      "Julius's report weaponises bureaucracy against him in the same way Malcolm weaponises the press",
    ],
    frameHighlights: [
      "s03e07-02-56.040", // Steve Fleming returns
      "s03e07-03-58.680", // "Steve Fleming! Hello"
      "s03e07-06-22.600", // Malcolm still running the show
      "s03e07-12-10.960", // Steve "fucking Nicola" Fleming
      "s03e08-18-21.360", // Steve leaned on the desk
      "s03e08-20-03.880", // "You're a joke, Steve"
      "s03e08-20-26.840", // Steve Fleming reckons
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
    image: stewart,
    occupation:
      "Director of Communications - Cabinet Office, Former Opposition Director of Communications",
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
        affiliation: "HM Government, Former HM Opposition",
        career: [
          "Director of Communications - Cabinet Office",
          "Former Opposition Director of Communications",
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
      "Close personal friend of JB, though influence has declined",
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
      "His ten-year project to detoxify the Conservatives collapses into open contempt by the finale",
      "Mary Drake removes him from the action side of government and sends him toward think-tank exile",
      "Thought Camp shows his managerial language as a substitute for practical political control",
      "His rivalry with Malcolm is partly ideological: mindfulness bureaucracy against threat theatre",
      "His final outburst reveals how much anger sits beneath the soft modernising vocabulary",
    ],
    frameHighlights: [
      "s03e04-07-20.600", // "I like the plasmic nature of your data modelling! Nice!"
      "s04e03-00-03-31.640", // "When is a party not a party?"
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
      "Stays emotionally legible in a world where most loyalty is transactional",
      "Her presence makes Malcolm's office feel like a working institution rather than only a threat chamber",
      "During Malcolm's fall, she becomes the quiet witness to what his power cost him personally",
      "Functions as the closest thing Malcolm has to a non-strategic professional relationship",
      "Manages Malcolm's hectic schedule and urgent communications",
      "Trusted with sensitive information and private matters",
      "Maintains professional composure despite Malcolm's explosive temperament",
    ],
    frameHighlights: [
      "s02e01-05-15.800", // Malcolm's office shorthand with Sam
      "s03e07-11-03.520", // "Sam, prepare my horse"
      "s03e08-18-16.960", // "Sam, no pissy biscuits"
      "s03e07-24-44.680", // Sam handles Malcolm's official Blackberry
      "s04e04-00-27-11.760", // Sam gets Malcolm the call
      "s04e07-00-04-44.760", // Sam at Brentford
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
      "Special Adviser to Peter Mannion, trusted by party leadership for key assignments",
    image: emma,
    occupation:
      "Special Adviser to the Secretary of State for Social Affairs and Citizenship",
    department: [DEPARTMENTS.DOSAC],
    role: [ROLES.SPECIAL_ADVISOR],
    personal: {
      age: 29,
      relationships: {
        past: ["Dr. Oliver Reeder"],
      },
      background: {
        party: "Conservative",
        affiliation: "HM Government, Former HM Opposition",
        career: [
          "Special Adviser to the Secretary of State, DoSAC",
          "Former Policy Adviser to the Shadow Secretary of State",
          "Former Special Adviser to Minister Levitt",
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
      "Previously worked as advisor to Minister Levitt",
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
      "Her relationship with Ollie turns personal intimacy into a practical intelligence channel",
      "Stewart's preference for her over Phil makes her the modernising wing's trusted operator inside Mannion's office",
      "She can write, amend, and sell policy while still reading the room faster than her minister",
      "Her competence makes her dangerous because she rarely needs to announce it",
      "In coalition government, she becomes one of the few figures who can translate between Mannion's instincts and Number 10's demands",
    ],
    frameHighlights: [
      "s03e05-08-49.440", // Emma in the flat
      "s03e05-13-12.200", // Stewart calls Emma over-emotional
      "s03e05-21-52.600", // Emma backing Peter's narrative
      "s04e03-00-12-26.000", // Policy jamming with Emma
      "s04e05-00-28-16.560", // Goolding oath as Emma Florence Messinger
      "s04e07-00-06-53.600", // Emma meets Mary Drake
      "s04e07-00-23-02.080", // Stewart lashes out at Emma
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
    occupation: "Prime Minister",
    department: [DEPARTMENTS.NUMBER_10],
    role: [ROLES.SENIOR_LEADERSHIP],
    personal: {
      background: {
        party: "Labour",
        affiliation: "HM Government",
      },
    },
    details: [
      "Rises to become Prime Minister after leadership transition",
      "Leader of the 'nutters' faction within the party",
      "Subject of leaked rumours about antidepressant use",
      "Target of Jamie McDonald's attempted political sabotage",
      "Eventually accepts Malcolm Tucker as media liaison",
      "Central figure in party's power shift",
      "Represents new generation of party leadership",
      "Gains support from key figures like Dan Miller",
      "Subject of various political machinations during transition",
      "His rise marks significant change in party dynamics",
      "His antidepressant rumour becomes the succession crisis's most damaging piece of personal ammunition",
      "Tom's victory weakens Malcolm's old certainty about who controls the party machine",
      "His faction's rise gives Ben Swain and Nick temporary leverage they cannot use well",
      "He accepts Malcolm because usefulness still matters more than factional purity",
      "His premiership begins with the old communications system patched onto a new power base",
    ],
    frameHighlights: [
      "s03e06-04-14.960", // Tom as best man for the job
      "s03e06-15-58.000", // Tom to lead the country
      "s03e06-16-02.040", // Tom as man of the moment
      "s03e08-04-45.080", // Anti-Tom cabal
      "s03e08-14-54.400", // Anti-Tom brigade
      "s03e07-24-34.960", // Malcolm needs to talk to Tom
      "s03e07-24-36.920", // Tom not available
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
        affiliation: "HM Government, Former HM Opposition",
        career: [
          "Special Adviser to the Secretary of State, DoSAC",
          "Former Policy Adviser to the Shadow Secretary of State",
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
      "His pop-culture fixation makes him look unserious even when he is doing real advisory work",
      "Mannion's team keeps him because loyalty and institutional memory still have value",
      "His flatshare with Emma creates a domestic extension of the Conservative advisory office",
      "Stewart's impatience with him reflects the modernising wing's contempt for unreconstructed party culture",
      "By the finale he survives Stewart's fall mostly by being too peripheral to become the main target",
    ],
    frameHighlights: [
      "s04e05-00-02-22.080", // "Wider? That's mental! We want to shut it down."
      "s04e05-00-16-07.840", // "Exactly. He was a male nurse. That's not just mad, that's mental."
    ],
    party: PARTIES.CONSERVATIVE,
  },
  mary: {
    name: "Mary Drake",
    shortName: "Mary",
    fullName: "Rt. Hon. Mary Drake MP",
    description:
      "Director of Communications for Number 10, replacing Stewart Pearson",
    image: mary,
    occupation: "Director of Communications - Number 10",
    department: [DEPARTMENTS.NUMBER_10],
    role: [ROLES.SENIOR_LEADERSHIP],
    personal: {
      background: {
        party: "Conservative",
        affiliation: "HM Government",
        career: [
          "Director of Communications - Number 10",
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
      "Arrives as the government's answer to Stewart's exhausted modernisation project",
      "Signals a move from thought and tone back toward action and message discipline",
      "Her removal of Stewart shows Number 10 choosing operational control over brand therapy",
      "Takes over at a moment when the coalition needs visible grip after Goolding and the arrest backlog crisis",
      "Functions as the Conservative mirror of Malcolm's hard communications office without his personal mythology",
    ],
    frameHighlights: [
      "s04e03-00-04-02.080", // Mary Drake from Home Office
      "s04e03-00-15-11.240", // "megaphone Mary"
      "s04e05-00-18-40.560", // "Mary Queen of..."
      "s04e07-00-01-54.080", // Mary Drake arrives
      "s04e07-00-06-30.120", // Mary on her way up
      "s04e07-00-06-53.600", // Mary meets Emma
      "s04e07-00-22-09.600", // Authority over Stewart
    ],
    party: PARTIES.CONSERVATIVE,
  },
  helen: {
    name: "Helen Hatley",
    shortName: "Helen",
    fullName: "Helen Hatley",
    description: "Special Adviser to Nicola Murray, former Opposition adviser",
    image: helen,
    occupation: "Special Adviser to Nicola Murray MP",
    department: [DEPARTMENTS.OPPOSITION],
    role: [ROLES.SPECIAL_ADVISOR],
    personal: {
      background: {
        party: "Labour",
        affiliation: "HM Opposition",
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
      "Acts as Nicola's continuity aide while the leadership around her keeps shifting",
      "Often has to soften Nicola's instincts before Malcolm turns them into a public problem",
      "Her loyalty makes her useful, but also ties her career to Nicola's collapsing authority",
      "In Opposition, she becomes part of the smaller, more defensive team around a wounded leader",
      "Her presence helps show that Nicola's political isolation is not absolute, just insufficient",
    ],
    frameHighlights: [
      "s04e02-00-08-30.800", // Helen's notes borrowed
      "s04e02-00-09-03.360", // "Normality as a kind of superpower"
      "s04e02-00-25-38.080", // Wreath lecture
      "s04e04-00-05-20.280", // Nicola's number two
      "s04e04-00-12-43.240", // Helen in the vestibule
      "s04e07-00-13-38.040", // Helen with Declan
      "s04e07-00-14-37.280", // Helen takes the hit
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
        affiliation: "HM Opposition",
        career: [
          "Shadow Cabinet Minister",
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
    frameHighlights: [
      "s02e01-07-22.640", // Geoff Holhurst in Defence
      "s02e01-16-18.400", // Geoff up to his neck
      "s02e01-16-25.120", // Bad day for Geoff
      "s03e07-06-30.960", // Geoffrey call
    ],
    party: PARTIES.LABOUR,
  },
  john: {
    name: "John Duggan",
    shortName: "John",
    fullName: "John Duggan",
    description:
      "Labour Party Press Officer struggling with basic communications duties",
    occupation: "Party Press Officer",
    department: [DEPARTMENTS.OPPOSITION],
    role: [ROLES.PRESS_OFFICER],
    personal: {
      age: 35,
      background: {
        party: "Labour",
        affiliation: "HM Opposition, Former HM Government",
        career: [
          "Labour Party Press Officer",
          "Former Junior Communications Officer",
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
    frameHighlights: [
      "s03e03-04-15.600", // John Duggan responsibility
      "s03e03-04-51.440", // John Duggan, press officer
      "s04e04-00-05-24.480", // JD introduction
    ],
    party: PARTIES.LABOUR,
    relatedProfiles: [
      {
        id: "nicola",
        relationship:
          "Boss during Opposition - Manages her communications incompetently",
      },
      {
        id: "malcolm",
        relationship:
          "Forced to leak false stories - Malcolm orders him to spread Tom Davis rumours",
      },
      {
        id: "ollie",
        relationship:
          "Fellow incompetent - Makes tasteless jokes together about disasters",
      },
    ],
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
      "Operates in the same communications chain as Jamie McDonald",
      "Represents the routine press-office labour beneath Malcolm's crisis management",
      "Likely responsible for monitoring lobby chatter before Malcolm escalates issues",
      "Functions as one of the staffers who turns Number 10 pressure into calls, lines, and briefings",
    ],
    party: PARTIES.LABOUR,
    relatedProfiles: [
      {
        id: "malcolm",
        relationship:
          "Boss at Number 10 - Works under his aggressive leadership",
      },
      {
        id: "jamie",
        relationship: "Fellow press officer - Part of same communications team",
      },
    ],
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
      "Sits outside the ministerial machine, making him less exposed to Malcolm Tucker's direct control",
      "Useful as a backbench weather vane when leadership pressure builds",
      "Represents the quieter parliamentary layer beneath the show's headline crises",
      "Likely pulled into factional conversations during leadership uncertainty",
    ],
    frameHighlights: [
      "s03e01-01-15.840", // Doug factional chatter
      "s04e04-00-00-45.400", // Doug in leadership panic
      "s04e04-00-15-52.840", // Doug to Scotland reshuffle line
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
      "Represents the junior operational layer of the Number 10 grid",
      "Likely handles calls and briefing logistics while Malcolm and Jamie set the line",
      "Works in an environment where routine press work can become a national crisis within minutes",
      "Serves as connective tissue between departmental messes and central government messaging",
    ],
    frameHighlights: [
      "s02e01-19-37.120", // Frankie upstairs at Number 10
      "s04e04-00-15-52.840", // Frank to international development
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
      "Works around one of the least media-safe ministers in the Labour operation",
      "Likely spends much of her time translating Ben's instincts into usable briefing lines",
      "Sits close to the 'nutters' faction without holding independent power",
      "Exposed to Malcolm and Jamie's attempts to turn Ben into a viable television performer",
      "Represents the staff cost of propping up an ambitious but unstable junior minister",
    ],
    party: PARTIES.LABOUR,
    relatedProfiles: [
      {
        id: "ben",
        relationship: "Boss - Provides advisory support to failed minister",
      },
      {
        id: "malcolm",
        relationship:
          "Communications chief - Witnesses his attempts to save Ben",
      },
    ],
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
      "Represents the post-Malcolm communications generation around Tom Davis",
      "Likely benefits from the leadership transition that weakens Malcolm's old guard",
      "Works in the rebuilt press operation after the 'nutters' faction consolidates power",
      "Carries the risk of managing a Prime Minister whose personal rumours have already been weaponised",
    ],
    party: PARTIES.LABOUR,
    relatedProfiles: [
      {
        id: "tom",
        relationship: "Prime Minister - Handles his media relations",
      },
      {
        id: "malcolm",
        relationship:
          "Former communications director - Part of new regime after Malcolm",
      },
    ],
  },
  robyn: {
    name: "Robyn Murdoch",
    shortName: "Robyn",
    fullName: "Robyn Murdoch",
    description:
      "Senior Press Officer at DoSAC (Civil Service), relegated to secretarial duties",
    image: robyn,
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
      "Last line of defence against ministerial code violations",
      "Only remembers to claim overtime during spending reviews",
    ],
    frameHighlights: [
      "s02e01-02-04.840", // Robyn Murdoch identification
      "s02e01-04-37.120", // Malcolm explodes at Robyn
      "s02e02-02-17.720", // "This is the delightful Robyn"
      "s03e02-23-19.320", // Robyn's weak tea reputation
      "s04e05-00-12-54.800", // Carer's Pass timing
      "s04e06-00-25-30.520", // Terri cites Robyn
      "s04e06-00-40-48.160", // Robyn and the leaked email
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
        affiliation: "Coalition Government",
        previousCareer:
          "Public relations work for nPower and Territorial Army service",
        career: ["Minister of State for Social Affairs and Citizenship"],
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
      "Committed GBP 2 billion to community banking project out of social awkwardness",
      "Represents Liberal Democrat interests in coalition",
      "Often clashes with Peter Mannion over policy direction",
      "Pushes for progressive social policies within department",
      "Strong advocate for digital education initiatives",
      "Struggles with coalition power dynamics",
      "Works closely with advisor Adam Kenyon",
      "Worked in public relations for nPower before Parliament",
      "Extended character sources record multiple Territorial Army stints before ministerial office",
      "Persuaded Adam Kenyon to leave journalism and become his special adviser",
      "Faces challenges implementing Liberal Democrat policies",
      "Known for idealistic approach to social policy",
      "Sometimes makes impulsive decisions under pressure",
      "Silicon Playgrounds starts as his optimistic digital education project before Stewart orders Peter to front the launch",
      "The community bank commitment shows his weakness for agreeing before he has institutional cover",
      "His coalition position gives him formal proximity to power without full control over outcomes",
      "Adam Kenyon helps make his ideas sound more workable than the office around him allows",
      "Mr Tickel's death turns his social-policy idealism into part of the Goolding chain of accountability",
    ],
    frameHighlights: [
      "s04e01-00-00-59.480", // Ready for Silicon Playgrounds
      "s04e01-00-01-04.000", // "Silicon Playgrounds are... is go"
      "s04e01-00-04-32.080", // Fergus loses the launch
      "s04e01-00-20-53.800", // Fergus relaunches Silicon Playgrounds
      "s04e01-00-25-47.880", // Silicon Playgrounds dead
      "s04e05-00-22-12.760", // Email chain reaches Fergus
      "s04e05-00-28-15.120", // Goolding oath with Adam
      "s04e06-00-11-52.160", // Fergus raised at inquiry
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
    image: phil_smith,
    occupation: "Special Adviser to the Secretary of State",
    department: [DEPARTMENTS.DOSAC],
    role: [ROLES.SPECIAL_ADVISOR],
    details: [
      "Profile image alias for Phil Smith, Peter Mannion's long-serving adviser",
      "Attached to the Conservative DoSAC operation under Peter Mannion",
      "Works in the same advisory orbit as Emma Messinger",
      "Represents the loyal but less strategically trusted side of Mannion's team",
      "Often overshadowed by Emma's competence and Stewart Pearson's modernising agenda",
      "Carries the department's awkward mix of old Conservative instincts and coalition-era media demands",
      "Best read alongside the main Phil Smith profile for the fuller character dossier",
      "Useful in the archive as a disambiguation point for character images and frame tagging",
    ],
    relatedProfiles: [
      {
        id: "phil",
        relationship: "Main profile record for the same advisory figure",
      },
      {
        id: "peter",
        relationship: "Secretary of State he advises",
      },
      {
        id: "emma",
        relationship: "Fellow adviser and flatmate in the Conservative team",
      },
    ],
  },
  adam: {
    name: "Adam Kenyon",
    shortName: "Adam",
    fullName: "Adam Kenyon",
    description: "Special Adviser to the Minister of State",
    occupation: "Special Adviser to the Minister of State",
    department: [DEPARTMENTS.DOSAC],
    role: [ROLES.SPECIAL_ADVISOR],
    personal: {
      background: {
        party: "Liberal Democrat",
        affiliation: "Coalition Government",
        previousCareer: "Daily Mail night editor",
        interests: ["Squash", "Digital policy", "Media vendettas"],
      },
    },
    details: [
      "Special Adviser to Fergus Williams in the coalition-era DoSAC team",
      "Operates from the Liberal Democrat side of the coalition arrangement",
      "Supports Fergus during the Silicon Playgrounds digital education push",
      "Acts as a policy buffer between Fergus's idealism and Peter Mannion's scepticism",
      "Previously worked at the Daily Mail night desk during the leadership succession chaos",
      "Leaves journalism after Fergus persuades him to join government as a special adviser",
      "Plays squash with Fergus, making the adviser-minister relationship unusually matey by DoSAC standards",
      "Threatens Ollie Reeder with a lasting media vendetta after the Ben Swain succession mess",
      "Works in a department where junior coalition priorities can be overruled by Conservative presentation needs",
      "Represents the technocratic optimism that Series 4 repeatedly punctures",
      "Functions as a quiet counterweight to Stewart Pearson's louder modernisation language",
      "Goolding evidence places him directly beside Fergus in discussions with the Leader of the Opposition",
    ],
    frameHighlights: [
      "s04e01-00-10-44.120", // Adam challenges the office line
      "s04e01-00-21-33.160", // Adam joining the relaunch
      "s04e03-00-16-38.400", // Adam secures the economist
      "s04e05-00-22-16.360", // Fergus blames Adam
      "s04e05-00-28-15.120", // Adam Kenyon at Goolding
      "s04e06-00-19-29.720", // Mr Kenyon asked to add evidence
      "s04e06-00-19-55.760", // Adam agrees at inquiry
      "s04e07-00-20-49.280", // "Adam, make it happen"
    ],
    party: PARTIES.LIBERAL_DEMOCRAT,
    relatedProfiles: [
      {
        id: "fergus",
        relationship: "Minister of State he advises",
      },
      {
        id: "peter",
        relationship:
          "Senior coalition minister whose priorities often clash with Fergus",
      },
    ],
  },
  kelly_p: {
    name: "Kelly Peters",
    shortName: "Kelly Peters",
    fullName: "Kelly Peters",
    description: "Civil Servant at DoSAC",
    occupation: "Civil Servant",
    department: [DEPARTMENTS.DOSAC],
    role: [ROLES.CIVIL_SERVANT],
    details: [
      "Civil servant attached to the Department of Social Affairs and Citizenship",
      "Part of the permanent machinery that survives ministerial reshuffles",
      "Likely handles administrative continuity while special advisers chase the daily line",
      "Represents the department's unglamorous paperwork layer beneath public policy announcements",
      "Works inside a culture shaped by FOI risk, press handling, and ministerial code anxiety",
      "Provides useful archive coverage for frames where non-political DoSAC staff appear",
      "Best treated as a lower-confidence profile until tied to a named episode guide reference",
      "Helps round out the civil service side of the DoSAC ecosystem",
    ],
    frameHighlights: [
      "s03e02-22-44.360", // Kelly Peters on the redundancy list
      "s03e02-22-46.640", // "She's a very nice girl"
    ],
  },
  phil_davis: {
    name: "Phil Davis",
    shortName: "Phil Davis",
    fullName: "Phil Davis",
    description: "Civil Servant at DoSAC",
    occupation: "Civil Servant",
    department: [DEPARTMENTS.DOSAC],
    role: [ROLES.CIVIL_SERVANT],
    details: [
      "Civil servant in the Department of Social Affairs and Citizenship",
      "Represents the operational staff who keep departmental process moving",
      "Likely works around briefing packs, clearance chains, and internal correspondence",
      "Sits below the political fight between ministers, advisers, and Number 10",
      "Exposed to the same procedural risk culture that defines Terri Coverley's office",
      "Useful as a frame-tagging profile for background DoSAC staff appearances",
      "Best handled as extended archive lore until an episode-level source is attached",
      "Adds texture to DoSAC as a working department rather than only a ministerial stage",
    ],
    frameHighlights: [
      "s03e02-07-18.600", // Phil Davis / Davies uncertainty
      "s03e02-07-23.160", // Davis name check
    ],
  },
  andrew: {
    name: "Andrew",
    shortName: "Andrew",
    fullName: "Andrew",
    description: "Former Civil Servant at DoSAC",
    occupation: "Civil Servant",
    department: [DEPARTMENTS.DOSAC],
    role: [ROLES.CIVIL_SERVANT],
    details: [
      "Former civil servant associated with DoSAC",
      "Represents staff turnover inside a department repeatedly disrupted by political crises",
      "Likely left behind institutional knowledge that newer advisers do not fully understand",
      "Useful as archive lore for tracking minor civil service appearances across frames",
      "Sits in the procedural culture around records, meetings, and internal clearance",
      "Shows that DoSAC has a wider staff ecosystem beyond ministers and named advisers",
      "Best treated as low-confidence expanded lore pending a direct transcript or episode source",
      "Helps the profile index preserve background continuity across the department",
    ],
    frameHighlights: [
      "s03e02-26-50.520", // Andrew cleared out
      "s03e02-27-09.160", // Andrew takes it badly
      "s03e02-27-12.880", // Sorting out Andrew
    ],
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
