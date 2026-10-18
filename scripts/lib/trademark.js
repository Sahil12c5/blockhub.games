const TRADEMARK_PATTERNS = [
  { term: "GTA / Grand Theft Auto", regex: /\b(gta|grand theft auto)\b/i },
  { term: "Call of Duty / Warzone", regex: /\b(call of duty|warzone)\b/i },
  { term: "Resident Evil", regex: /\b(resident evil)\b/i },
  { term: "Mario / Luigi / Bowser", regex: /\b(mario|luigi|bowser)\b/i },
  { term: "Minecraft / Creeper / Herobrine", regex: /\b(minecraft|creeper|herobrine)\b/i },
  { term: "Brawl Stars", regex: /\b(brawl stars)\b/i },
  { term: "Hollow Knight", regex: /\b(hollow knight)\b/i },
  { term: "Gears of War", regex: /\b(gears of war)\b/i },
  { term: "Half-Life / Counter-Strike", regex: /\b(half[- ]life|counter[- ]strike|csgo|cs:go)\b/i },
  { term: "Elden Ring / Dark Souls", regex: /\b(elden ring|dark souls|bloodborne)\b/i },
  { term: "Doom", regex: /\bdoom\b/i },
  { term: "FNAF / Five Nights", regex: /\b(fnaf|five nights at freddy|freddy)\b/i },
  { term: "Roblox", regex: /\broblox\b/i },
  { term: "Poppy Playtime / Huggy Wuggy", regex: /\b(poppy playtime|huggy wuggy|huggy)\b/i },
  { term: "Sonic the Hedgehog", regex: /\b(sonic)\b/i },
  { term: "Pokemon / Pikachu", regex: /\b(pokemon|pikachu)\b/i },
  { term: "Fortnite / PUBG / Apex", regex: /\b(fortnite|pubg|apex legends)\b/i },
  { term: "Among Us / Impostor", regex: /\b(among us|impostor)\b/i },
  { term: "Subway Surfers", regex: /\bsubway surfers\b/i },
  { term: "Squid Game", regex: /\bsquid game\b/i },
  { term: "Skibidi Toilet", regex: /\bskibidi\b/i },
  { term: "Marvel / Avengers / Spider-Man / Batman", regex: /\b(spiderman|spider-man|batman|superman|avengers|marvel)\b/i },
  { term: "The Last of Us", regex: /\b(last of us|ellie and joel)\b/i },
  { term: "Angry Birds", regex: /\bangry birds\b/i },
  { term: "Plants vs Zombies", regex: /\bplants vs zombies\b/i },
];

function checkTrademark(game) {
  const textToScan = `${game.title || ""} ${game.slug || ""} ${game.description || ""}`;
  const matched = [];

  for (const tm of TRADEMARK_PATTERNS) {
    if (tm.regex.test(textToScan)) {
      matched.push(tm.term);
    }
  }

  if (matched.length > 0) {
    return {
      flagged: true,
      term: matched.join("; "),
    };
  }

  return {
    flagged: false,
    term: null,
  };
}

module.exports = {
  TRADEMARK_PATTERNS,
  checkTrademark,
};
