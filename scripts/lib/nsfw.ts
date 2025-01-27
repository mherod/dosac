/**
 * Checks if a hostname contains NSFW terms
 * @param hostName The hostname to check
 * @returns boolean indicating if the hostname contains NSFW terms
 */
export function isHostNSFW(hostName: string): boolean {
  return !!hostName.match(
    /porn|pornhub|xhamster|xvideos|redtube|youporn|pornstar|xxx|nsfw|adult|pussy|cunt|twat|vagina|cock|dick|penis|phallus|ass|arse|anal|butthole|tits|boobs|breasts|nipples|bitch|whore|slut|hoe|thot|cum|jizz|sperm|semen|sex|fuck|fucking|fart|nude|naked|nudes|gay|lesbian|glamour|erotic|erotica|hentai|rule34|onlyfans|camgirl|stripper|escort|brothel|fetish|kink|bdsm|bondage|dildo|vibrator|masturbate|orgasm|horny|aroused|hardcore|softcore|playboy|penthouse|hustler|bangbros|brazzers|onlyfans|chaturbate|myfreecams|livejasmin|flirt4free|streamate|camsoda|stripchat|bongacams|adultwork|seeking|ashleymadison|fling|nostrings|casualsex|hookup|booty|thicc|pawg|milf|gilf|dilf|daddy|mommy|stepmom|stepsister|incest|taboo|gangbang|orgy|threesome|cuckold|hotwife|swinger|creampie|facial|bukkake|deepthroat|blowjob|handjob|rimjob|fingering|fisting|squirt|ahegao|harem|ecchi|doujin|yaoi|yuri|futanari|tentacle|loli|shota|twink|wank|twink|boy|guy|69|queer|tumb|malegeneral|wetpic|x\w|nstud|torrent|girls+/i,
  );
}
