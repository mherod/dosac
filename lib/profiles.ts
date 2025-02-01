export const DEPARTMENTS = {
  NUMBER_10: "Number 10",
  DOSAC: "DoSAC/DSA",
  OPPOSITION: "Opposition",
  PRESS: "Press",
  OTHER_GOVERNMENT: "Other Government",
  EXTERNAL: "External",
} as const;

export const ROLES = {
  SENIOR_LEADERSHIP: "Senior Leadership",
  MINISTER: "Minister",
  SPECIAL_ADVISOR: "Special Advisor",
  PRESS_OFFICER: "Press Officer",
  CIVIL_SERVANT: "Civil Servant",
  JOURNALIST: "Journalist",
  CANDIDATE: "Candidate",
  OTHER: "Other",
} as const;

export type Department = (typeof DEPARTMENTS)[keyof typeof DEPARTMENTS];
export type Role = (typeof ROLES)[keyof typeof ROLES];

export interface CharacterOrigin {
  city?: string;
  area?: string;
  country: string;
}

export interface CharacterPersonal {
  age?: number;
  birthYear?: number;
  family?: {
    spouse?:
      | boolean
      | {
          name: string;
          occupation?: string;
        };
    children?: boolean;
    siblings?: boolean;
    nieces?: boolean;
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

export interface Character {
  name: string;
  shortName: string;
  fullName: string;
  description: string;
  image?: string;
  occupation?: string;
  nationality?: string;
  department: Department;
  role: Role;
  origin?: CharacterOrigin;
  personal?: CharacterPersonal;
  details: string[];
}

export const characters: Record<string, Character> = {
  malcolm: {
    name: "Malcolm Tucker",
    shortName: "Malcolm",
    fullName: "Malcolm Tucker",
    description:
      "Former Director of Communications for Number 10 and Opposition, feared Scottish enforcer of government policy",
    image: "/characters/malcom.jpg",
    occupation:
      "Media Adviser to the Leader of the Opposition (Series 4), Director of Communications for Number 10 (Series 1-3)",
    nationality: "Scottish",
    department: DEPARTMENTS.NUMBER_10,
    role: ROLES.SENIOR_LEADERSHIP,
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
  },
  jamie: {
    name: "James 'Jamie' McDonald",
    shortName: "Jamie",
    fullName: "James McDonald",
    description:
      "Senior Press Officer and Malcolm Tucker's enforcer at Number 10",
    image: "/characters/jamie.jpg",
    occupation: "Senior Press Officer at Number 10",
    nationality: "Scottish",
    department: DEPARTMENTS.NUMBER_10,
    role: ROLES.SENIOR_LEADERSHIP,
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
  },
  nicola: {
    name: "Rt Hon Nicola Allison Murray MP",
    shortName: "Nicola",
    fullName: "The Right Honourable Nicola Allison Murray MP",
    description:
      "Former Leader of the Opposition (2010-2012) and Secretary of State for DoSAC",
    occupation:
      "Leader of the Opposition (2010-2012), Secretary of State for DoSAC (Series 3)",
    department: DEPARTMENTS.OPPOSITION,
    role: ROLES.SENIOR_LEADERSHIP,
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
  },
  peter: {
    name: "Peter Mannion",
    shortName: "Peter",
    fullName: "The Right Honourable Peter Mannion MP",
    description:
      "Secretary of State for Social Affairs and Citizenship, veteran 'One Nation' Conservative politician with over three decades of parliamentary experience",
    image: "/characters/peter.jpg",
    occupation:
      "Secretary of State for Social Affairs and Citizenship (Series 4-present)",
    department: DEPARTMENTS.DOSAC,
    role: ROLES.MINISTER,
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
          "Shadow Secretary of State for Social Affairs and Citizenship (Series 3 & Specials)",
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
  },
  terri: {
    name: "Terri",
    shortName: "Terri",
    fullName: "Terri Coverley",
    description: "Director of Communications at DoSAC, formerly from Waitrose",
    image: "/characters/terri.webp",
    department: DEPARTMENTS.DOSAC,
    role: ROLES.PRESS_OFFICER,
    details: [
      "Director of Communications for the department, responsible for press relations",
      "Recruited from Waitrose as part of a scheme to make government run like a business",
      "Professional and prudish in nature, often managing departmental PR crises",
      "Takes pride in her civil servant status and job security",
      "Takes a leave of absence during series 2 due to her father's death",
      "Known for 'mopping up' the department's bad press",
    ],
  },
  hugh: {
    name: "Rt Hon Hugh Abbot MP",
    shortName: "Hugh",
    fullName: "The Right Honourable Hugh Abbot MP",
    description: "Former Secretary of State for Social Affairs and Citizenship",
    occupation:
      "Secretary of State for Social Affairs and Citizenship (Series 1-2)",
    department: DEPARTMENTS.DOSAC,
    role: ROLES.MINISTER,
    personal: {
      background: {
        party: "Labour",
        affiliation: "HM Government (Series 1-2)",
        career: [
          "Secretary of State for Social Affairs and Citizenship (Series 1-2)",
        ],
      },
    },
    details: [
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
  },
  glenn: {
    name: "Glenn Cullen",
    shortName: "Glenn",
    fullName: "Glenn Cullen",
    description: "Former Senior Special Adviser at DoSAC, Labour Party veteran",
    occupation:
      "Former Senior Special Adviser to the Secretary of State, DoSAC",
    department: DEPARTMENTS.DOSAC,
    role: ROLES.SPECIAL_ADVISOR,
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
  },
  ollie: {
    name: "Dr. Oliver 'Ollie' Francis Reeder",
    shortName: "Ollie",
    fullName: "Dr. Oliver Francis Reeder",
    description:
      "Director of Communications and Policy Adviser to the Leader of the Opposition, former DoSAC Special Advisor",
    occupation: "Director of Communications and Policy Adviser to Dan Miller",
    department: DEPARTMENTS.OPPOSITION,
    role: ROLES.SENIOR_LEADERSHIP,
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
  },
  julius: {
    name: "Rt Hon the Lord Julius Nicholson of Arnage",
    shortName: "Julius",
    fullName: "The Right Honourable the Lord Julius Nicholson of Arnage",
    description: "Life Peer and former Special Adviser to the Prime Minister",
    occupation:
      "Special Adviser and Head of Advanced Implementation Unit, Number 10",
    department: DEPARTMENTS.NUMBER_10,
    role: ROLES.SPECIAL_ADVISOR,
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
  },
  ben: {
    name: "Rt Hon Ben Swain MP",
    shortName: "Ben",
    fullName: "The Right Honourable Ben Swain MP",
    description: "Former Shadow Cabinet Minister and Minister of State",
    occupation: "Former Shadow Cabinet Minister",
    department: DEPARTMENTS.OPPOSITION,
    role: ROLES.MINISTER,
    personal: {
      background: {
        party: "Labour",
        affiliation: "HM Opposition (Series 4), HM Government (Series 1-3)",
        career: [
          "Shadow Cabinet Minister",
          "Minister of State - Department of Education",
          "Minister of State for Immigration - DoSAC",
        ],
      },
    },
    details: [
      "Junior minister aligned with the 'nutters' faction loyal to future PM Tom",
      "Suffers catastrophic interview with Jeremy Paxman on immigration",
      "Failed to properly prepare despite Malcolm and Jamie's efforts",
      "Embarrasses himself and the government on national television",
      "Briefly suggested as potential leadership candidate",
      "Quickly dismissed as a serious contender",
      "Used by Malcolm to further discredit Nick's judgment",
      "Represents the rising influence of those loyal to the future PM",
      "Part of the new generation challenging Malcolm's control",
      "Notable for his disastrous media appearances",
    ],
  },
  nick: {
    name: "Nice Nutter Nick",
    shortName: "Nick",
    fullName: "The Right Honourable Nick",
    description: "Junior Minister and leadership transition player",
    occupation: "Junior Minister",
    department: DEPARTMENTS.OPPOSITION,
    role: ROLES.CANDIDATE,
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
    name: "Rt Hon Clare Ballentine MP",
    shortName: "Clare",
    fullName: "The Right Honourable Clare Ballentine MP",
    description:
      "Labour Backbench MP and Chair of the Education Select Committee",
    occupation: "Chair of the Select Committee on Education",
    department: DEPARTMENTS.OPPOSITION,
    role: ROLES.OTHER,
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
    name: "Rt Hon Dan Miller MP",
    shortName: "Dan",
    fullName: "The Right Honourable Dan Miller MP",
    description: "Leader of the Opposition, former Minister of State at DSA",
    occupation:
      "Leader of the Opposition (Series 4), Former Deputy Leader of the Opposition, Former Minister of State for Social Affairs",
    department: DEPARTMENTS.OPPOSITION,
    role: ROLES.SENIOR_LEADERSHIP,
    personal: {
      background: {
        party: "Labour",
        affiliation: "HM Opposition (Series 4), HM Government (Series 1-3)",
        career: [
          "Leader of the Opposition (Series 4)",
          "Deputy Leader of the Opposition",
          "Minister of State for Social Affairs",
        ],
      },
    },
    details: [
      "Initially serves as Junior Minister under Hugh Abbot at DSA",
      "Co-authored the controversial housing bill with Hugh Abbot",
      "Bill prohibited owning empty second properties",
      "Strategically resigned to save Hugh Abbot during the flat scandal",
      "Used resignation to boost his long-term political career",
      "Emerges as a crucial kingmaker during leadership transition",
      "Makes decisive intervention supporting Tom's leadership bid",
      "Influences Tom's choice of Malcolm as media liaison",
      "Known for his smooth political maneuvering and ambition",
      "Popular with both the press and public",
      "Masters the art of political timing and public perception",
      "Sacrificed short-term position for long-term career benefits",
    ],
  },
  cliff: {
    name: "Cliff Lawton",
    shortName: "Cliff",
    fullName: "The Right Honourable Cliff Lawton MP",
    description: "Former Minister for the Department of Social Affairs",
    occupation: "Former DSA Minister",
    department: DEPARTMENTS.DOSAC,
    role: ROLES.MINISTER,
    details: [
      "Original Minister for the Department of Social Affairs",
      "Forced to resign due to press pressure orchestrated by Malcolm Tucker",
      "Given the illusion of resigning voluntarily ('jumping before being pushed')",
      "Replaced by Hugh Abbot as DSA Minister",
      "Victim of Malcolm Tucker's strategic political maneuvering",
      "His resignation marks one of Malcolm's typical power plays",
    ],
  },
  angela: {
    name: "Angela Heaney",
    shortName: "Angela",
    fullName: "Angela Heaney",
    description: "Political journalist and former girlfriend of Ollie Reeder",
    occupation: "Journalist",
    department: DEPARTMENTS.DOSAC,
    role: ROLES.JOURNALIST,
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
  },
  simon: {
    name: "Simon Hewitt",
    shortName: "Simon",
    fullName: "Simon Hewitt",
    description:
      "Sharp journalistic critic of Hugh Abbot with personal connection to Malcolm Tucker",
    occupation: "Journalist",
    department: DEPARTMENTS.PRESS,
    role: ROLES.JOURNALIST,
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
    name: "Rt Hon Liam Bentley MP",
    shortName: "Liam",
    fullName: "The Right Honourable Liam Bentley MP",
    description: "Labour MP for Leamington Spa",
    occupation: "Member of Parliament for Leamington Spa",
    department: DEPARTMENTS.OPPOSITION,
    role: ROLES.OTHER,
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
    department: DEPARTMENTS.OTHER_GOVERNMENT,
    role: ROLES.SENIOR_LEADERSHIP,
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
  },
  steve: {
    name: "Rt Hon Steve Fleming MP",
    shortName: "Steve",
    fullName: "The Right Honourable Steve Fleming MP",
    description:
      "Former Chief Whip and Acting Director of Communications for Number 10",
    occupation:
      "Acting Director of Communications - Number 10, Former Chief Whip",
    department: DEPARTMENTS.NUMBER_10,
    role: ROLES.SENIOR_LEADERSHIP,
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
  },
  stewart: {
    name: "Dr Stewart Pearson",
    shortName: "Stewart",
    fullName: "Dr. Stewart Pearson",
    description:
      "Former Director of Communications at Cabinet Office, eco-friendly moderniser known for incomprehensible jargon",
    occupation:
      "Director of Communications - Cabinet Office (Series 4), Opposition Director of Communications (Series 3 & Specials)",
    department: DEPARTMENTS.OTHER_GOVERNMENT,
    role: ROLES.SENIOR_LEADERSHIP,
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
  },
  sam: {
    name: "Sam Cassidy",
    shortName: "Sam",
    fullName: "Samantha Cassidy",
    description: "Malcolm Tucker's loyal and capable personal secretary",
    occupation: "Personal Secretary",
    department: DEPARTMENTS.NUMBER_10,
    role: ROLES.CIVIL_SERVANT,
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
  },
  emma: {
    name: "Emma Florence Messinger",
    shortName: "Emma",
    fullName: "Emma Florence Messinger",
    description:
      "Highly competent Special Adviser to Peter Mannion, trusted by party leadership for key assignments",
    occupation:
      "Special Adviser to the Secretary of State for Social Affairs and Citizenship",
    department: DEPARTMENTS.DOSAC,
    role: ROLES.SPECIAL_ADVISOR,
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
  },
  kelly: {
    name: "Kelly Grogan",
    shortName: "Kelly",
    fullName: "Kelly Grogan",
    description:
      "BBC Health Correspondent with connections to both Malcolm Tucker and Simon Hewitt",
    occupation: "BBC Health Correspondent",
    department: DEPARTMENTS.PRESS,
    role: ROLES.JOURNALIST,
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
  },
  tom: {
    name: "Tom Davis",
    shortName: "Tom",
    fullName: "The Right Honourable Tom Davis MP",
    description: "Future Prime Minister and leader of the 'nutters' faction",
    occupation: "Prime Minister (Series 4)",
    department: DEPARTMENTS.NUMBER_10,
    role: ROLES.SENIOR_LEADERSHIP,
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
  },
  phil: {
    name: "Philip Bartholomew Cornelius Smith",
    shortName: "Phil",
    fullName: "Philip Bartholomew Cornelius Smith",
    description:
      "Special Adviser to Peter Mannion, known for his childish demeanour and pop culture obsession despite his serious political role",
    occupation:
      "Special Adviser to the Secretary of State for Social Affairs and Citizenship",
    department: DEPARTMENTS.DOSAC,
    role: ROLES.SPECIAL_ADVISOR,
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
  },
  mary: {
    name: "Rt Hon Mary Drake MP",
    shortName: "Mary",
    fullName: "The Right Honourable Mary Drake MP",
    description:
      "Director of Communications for Number 10, replacing Stewart Pearson",
    occupation: "Director of Communications - Number 10",
    department: DEPARTMENTS.NUMBER_10,
    role: ROLES.SENIOR_LEADERSHIP,
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
  },
  helen: {
    name: "Helen Hatley",
    shortName: "Helen",
    fullName: "Helen Hatley",
    description: "Special Adviser to Nicola Murray, former Opposition adviser",
    occupation: "Special Adviser to Nicola Murray MP",
    department: DEPARTMENTS.OPPOSITION,
    role: ROLES.SPECIAL_ADVISOR,
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
  },
  geoff: {
    name: "Rt Hon Geoff Holhurst MP",
    shortName: "Geoff",
    fullName: "The Right Honourable Geoff Holhurst MP",
    description: "Shadow Cabinet Minister and former Defence Secretary",
    occupation: "Shadow Cabinet Minister",
    department: DEPARTMENTS.OPPOSITION,
    role: ROLES.MINISTER,
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
  },
  john: {
    name: "John Duggan",
    shortName: "John",
    fullName: "John Duggan",
    description: "Labour Party Press Officer",
    occupation: "Party Press Officer",
    department: DEPARTMENTS.OPPOSITION,
    role: ROLES.PRESS_OFFICER,
    personal: {
      background: {
        party: "Labour",
        affiliation: "HM Opposition",
      },
    },
    details: [
      "Press Officer for the Labour Party",
      "Works on party communications strategy",
      "Handles media relations for Opposition",
      "Part of the party's press team",
      "Manages day-to-day media interactions",
    ],
  },
  ed: {
    name: "Ed Atkins",
    shortName: "Ed",
    fullName: "Edward Atkins",
    description: "Number 10 Press Officer under Labour government",
    occupation: "Press Officer - Number 10",
    department: DEPARTMENTS.NUMBER_10,
    role: ROLES.PRESS_OFFICER,
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
  },
  doug: {
    name: "Rt Hon Doug Hayes MP",
    shortName: "Doug",
    fullName: "The Right Honourable Doug Hayes MP",
    description: "Labour Party Backbench MP",
    occupation: "Backbench MP",
    department: DEPARTMENTS.OPPOSITION,
    role: ROLES.OTHER,
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
  },
  frankie: {
    name: "Frankie",
    shortName: "Frankie",
    fullName: "Frankie",
    description: "Number 10 Press Officer under Labour government",
    occupation: "Press Officer - Number 10",
    department: DEPARTMENTS.NUMBER_10,
    role: ROLES.PRESS_OFFICER,
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
  },
  suzie: {
    name: "Suzie",
    shortName: "Suzie",
    fullName: "Suzie",
    description: "Special Adviser to Ben Swain",
    occupation: "Special Adviser to Ben Swain MP",
    department: DEPARTMENTS.OPPOSITION,
    role: ROLES.SPECIAL_ADVISOR,
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
  },
  nick_h: {
    name: "Nick Hanway",
    shortName: "Nick",
    fullName: "Nick Hanway",
    description: "Press Officer and Spin Doctor for Tom Davis",
    occupation: "Press Officer - Number 10",
    department: DEPARTMENTS.NUMBER_10,
    role: ROLES.PRESS_OFFICER,
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
};

export const charactersByDepartment = Object.entries(characters).reduce<
  Record<Department, (Character & { id: string })[]>
>(
  (acc, [id, character]) => {
    if (!acc[character.department]) acc[character.department] = [];
    acc[character.department].push({ id, ...character });
    return acc;
  },
  {
    [DEPARTMENTS.NUMBER_10]: [],
    [DEPARTMENTS.DOSAC]: [],
    [DEPARTMENTS.OPPOSITION]: [],
    [DEPARTMENTS.PRESS]: [],
    [DEPARTMENTS.OTHER_GOVERNMENT]: [],
    [DEPARTMENTS.EXTERNAL]: [],
  },
);

export const charactersByRole = Object.entries(characters).reduce<
  Record<Role, (Character & { id: string })[]>
>(
  (acc, [id, character]) => {
    if (!acc[character.role]) acc[character.role] = [];
    acc[character.role].push({ id, ...character });
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
  },
);
