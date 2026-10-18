/**
 * BLOCKHUB.GAMES - TRADEMARK DETECTION & NEUTRAL TITLE SUGGESTER
 * Identifies games with third-party intellectual property in title or slug
 * and proposes clean, generic alternative titles for editorial review.
 */

const TRADEMARK_PATTERNS = [
  { term: "GTA / Grand Theft Auto", regex: /\b(gta|grand theft auto)\b/i, neutral: "City Gangster" },
  { term: "Call of Duty / Warzone", regex: /\b(call of duty|warzone)\b/i, neutral: "Combat Ops" },
  { term: "Resident Evil", regex: /\b(resident evil)\b/i, neutral: "Biohazard Survival" },
  { term: "Mario / Luigi / Bowser", regex: /\b(mario|luigi|bowser)\b/i, neutral: "Mushroom Kart" },
  { term: "Minecraft / Creeper / Herobrine", regex: /\b(minecraft|creeper|herobrine)\b/i, neutral: "Block Craft" },
  { term: "Brawl Stars", regex: /\b(brawl stars)\b/i, neutral: "Arena Brawlers" },
  { term: "Hollow Knight", regex: /\b(hollow knight)\b/i, neutral: "Hollow Warrior" },
  { term: "Gears of War", regex: /\b(gears of war)\b/i, neutral: "Gears of Combat" },
  { term: "Half-Life / Counter-Strike", regex: /\b(half[- ]life|counter[- ]strike|csgo|cs:go)\b/i, neutral: "Tactical Strike" },
  { term: "Elden Ring / Dark Souls", regex: /\b(elden ring|dark souls|bloodborne)\b/i, neutral: "Elden Quest" },
  { term: "Doom", regex: /\bdoom\b/i, neutral: "Hellfire Slayer" },
  { term: "FNAF / Five Nights", regex: /\b(fnaf|five nights at freddy|freddy)\b/i, neutral: "Midnight Animatronic" },
  { term: "Roblox", regex: /\broblox\b/i, neutral: "Blocky Obby" },
  { term: "Poppy Playtime / Huggy Wuggy", regex: /\b(poppy playtime|huggy wuggy|huggy)\b/i, neutral: "Toy Factory Escape" },
  { term: "Halo", regex: /\bhalo\b/i, neutral: "Spartan Combat" },
  { term: "F.E.A.R.", regex: /\b(f\.e\.a\.r\.|fear)\b/i, neutral: "Paranormal Ops" },
  { term: "Sonic the Hedgehog", regex: /\bsonic\b/i, neutral: "Speed Runner" },
  { term: "Pokemon / Pikachu", regex: /\b(pokemon|pikachu)\b/i, neutral: "Pocket Monster" },
  { term: "Fortnite / PUBG / Apex", regex: /\b(fortnite|pubg|apex legends)\b/i, neutral: "Battle Royale" },
  { term: "Among Us / Impostor", regex: /\b(among us|impostor)\b/i, neutral: "Space Crew" },
  { term: "Subway Surfers", regex: /\bsubway surfers\b/i, neutral: "Subway Runner" },
  { term: "Squid Game", regex: /\bsquid game\b/i, neutral: "Survival Challenge" },
  { term: "Skibidi Toilet", regex: /\bskibidi(\s+toilet)?\b/i, neutral: "Camera Man" },
  { term: "Marvel / Spider-Man / Batman", regex: /\b(spiderman|spider-man|batman|superman|avengers|marvel)\b/i, neutral: "Super Hero" },
  { term: "The Last of Us", regex: /\b(last of us|ellie and joel)\b/i, neutral: "Post-Apocalypse Survivors" },
  { term: "Angry Birds", regex: /\bangry birds\b/i, neutral: "Slingshot Birds" },
  { term: "Plants vs Zombies", regex: /\bplants vs zombies\b/i, neutral: "Garden Defense" },
];

function checkTrademark(game) {
  const textToScan = `${game.title || ""} ${game.slug || ""}`;
  const matched = [];
  let suggestedTitle = game.title || "";

  for (const tm of TRADEMARK_PATTERNS) {
    if (tm.regex.test(textToScan)) {
      matched.push(tm.term);
      suggestedTitle = suggestedTitle.replace(tm.regex, tm.neutral);
    }
  }

  // Clean up any double spaces or hanging punctuation in suggested title
  suggestedTitle = suggestedTitle.replace(/\s+/g, " ").trim();

  if (matched.length > 0) {
    return {
      flagged: true,
      term: matched.join("; "),
      suggestedTitle: suggestedTitle !== game.title ? suggestedTitle : `${game.title} (Neutral Edition)`,
    };
  }

  return {
    flagged: false,
    term: null,
    suggestedTitle: game.title,
  };
}

module.exports = {
  TRADEMARK_PATTERNS,
  checkTrademark,
};
