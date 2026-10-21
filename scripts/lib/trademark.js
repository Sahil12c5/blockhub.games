/**
 * BLOCKHUB.GAMES - TRADEMARK DETECTION & NEUTRAL TITLE SUGGESTER
 * Identifies games with third-party intellectual property in title or slug
 * and proposes clean, generic alternative titles for editorial review.
 */

const TRADEMARK_PATTERNS = [
  { term: "GTA / Grand Theft Auto", regex: /\b(gta|grand theft auto)\b/i, neutral: "City Gangster", blocks_index: true },
  { term: "Call of Duty / Warzone", regex: /\b(call of duty|warzone)\b/i, neutral: "Combat Ops", blocks_index: true },
  { term: "Resident Evil", regex: /\b(resident evil)\b/i, neutral: "Biohazard Survival", blocks_index: true },
  { term: "Mario / Luigi / Bowser", regex: /\b(mario|luigi|bowser)\b/i, neutral: "Mushroom Kart", blocks_index: true },
  { term: "Minecraft / Creeper / Herobrine", regex: /\b(minecraft|creeper|herobrine)\b/i, neutral: "Block Craft", blocks_index: true },
  { term: "Brawl Stars", regex: /\b(brawl stars)\b/i, neutral: "Arena Brawlers", blocks_index: true },
  { term: "Hollow Knight", regex: /\b(hollow knight)\b/i, neutral: "Hollow Warrior", blocks_index: true },
  { term: "Gears of War", regex: /\b(gears of war)\b/i, neutral: "Gears of Combat", blocks_index: true },
  { term: "Half-Life / Counter-Strike", regex: /\b(half[- ]life|counter[- ]strike|csgo|cs:go)\b/i, neutral: "Tactical Strike", blocks_index: true },
  { term: "Elden Ring / Dark Souls", regex: /\b(elden ring|dark souls|bloodborne)\b/i, neutral: "Elden Quest", blocks_index: true },
  { term: "Doom", regex: /\bdoom\b/i, neutral: "Hellfire Slayer", blocks_index: true },
  { term: "FNAF / Five Nights", regex: /\b(fnaf|five nights at freddy|freddy)\b/i, neutral: "Midnight Animatronic", blocks_index: true },
  { term: "Roblox", regex: /\broblox\b/i, neutral: "Blocky Obby", blocks_index: true },
  { term: "Poppy Playtime / Huggy Wuggy", regex: /\b(poppy playtime|huggy wuggy|huggy)\b/i, neutral: "Toy Factory Escape", blocks_index: true },
  { term: "Halo", regex: /\bhalo\b/i, neutral: "Spartan Combat", blocks_index: true },
  { term: "F.E.A.R.", regex: /\bf\.e\.a\.r\.\b/i, neutral: "Paranormal Ops", blocks_index: false },
  { term: "Sonic the Hedgehog", regex: /\bsonic\b/i, neutral: "Speed Runner", blocks_index: true },
  { term: "Pokemon / Pikachu", regex: /\b(pokemon|pikachu)\b/i, neutral: "Pocket Monster", blocks_index: true },
  { term: "Fortnite / PUBG / Apex", regex: /\b(fortnite|pubg|apex legends)\b/i, neutral: "Battle Royale", blocks_index: true },
  { term: "Among Us / Impostor", regex: /\bamong us\b/i, neutral: "Space Crew", blocks_index: false },
  { term: "Subway Surfers", regex: /\bsubway surfers\b/i, neutral: "Subway Runner", blocks_index: true },
  { term: "Squid Game", regex: /\bsquid game\b/i, neutral: "Survival Challenge", blocks_index: true },
  { term: "Skibidi Toilet", regex: /\bskibidi(\s+toilet)?\b/i, neutral: "Camera Man", blocks_index: true },
  { term: "Barbee / Barbie", regex: /\b(barbee|barbie)\b/i, neutral: "Fashion Doll", blocks_index: true },
  { term: "Bluey", regex: /\bbluey\b/i, neutral: "Blue Pup", blocks_index: true },
  { term: "Labubu", regex: /\blabubu\b/i, neutral: "Monster Toy", blocks_index: true },
  { term: "Fireboy and Watergirl", regex: /\bfireboy(\s+and\s+)?watergirl\b/i, neutral: "Elemental Duo", blocks_index: true },
  { term: "Paccoman / Pac-Man", regex: /\b(paccoman|pacman|pac-man)\b/i, neutral: "Maze Chomp", blocks_index: true },
  { term: "Marvel / Spider-Man / Batman", regex: /\b(spiderman|spider-man|batman|superman|avengers|marvel)\b/i, neutral: "Super Hero", blocks_index: true },
  { term: "The Last of Us", regex: /\b(last of us|ellie and joel)\b/i, neutral: "Post-Apocalypse Survivors", blocks_index: true },
  { term: "Angry Birds", regex: /\bangry birds\b/i, neutral: "Slingshot Birds", blocks_index: true },
  { term: "Plants vs Zombies", regex: /\bplants vs zombies\b/i, neutral: "Garden Defense", blocks_index: true },
];

function checkTrademark(game) {
  const textToScan = `${game.title || ""} ${game.slug || ""}`;
  const matched = [];
  let suggestedTitle = game.title || "";
  let blocksIndex = false;

  for (const tm of TRADEMARK_PATTERNS) {
    if (tm.regex.test(textToScan)) {
      matched.push(tm.term);
      if (tm.blocks_index) blocksIndex = true;
      suggestedTitle = suggestedTitle.replace(tm.regex, tm.neutral);
    }
  }

  // Clean up any double spaces or hanging punctuation in suggested title
  suggestedTitle = suggestedTitle.replace(/\s+/g, " ").trim();

  if (matched.length > 0) {
    return {
      flagged: true,
      blocksIndex,
      term: matched.join("; "),
      suggestedTitle: suggestedTitle !== game.title ? suggestedTitle : `${game.title} (Neutral Edition)`,
    };
  }

  return {
    flagged: false,
    blocksIndex: false,
    term: null,
    suggestedTitle: game.title,
  };
}

module.exports = {
  TRADEMARK_PATTERNS,
  checkTrademark,
};
