const fs = require("fs");
const path = require("path");
const { games } = require("../data/games.js");

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
];

const flagged = [];

for (const g of games) {
  const textToScan = `${g.title} ${g.tags || ""} ${g.slug}`;
  const matchedTrademarks = [];

  for (const tm of TRADEMARK_PATTERNS) {
    if (tm.regex.test(textToScan)) {
      matchedTrademarks.push(tm.term);
    }
  }

  if (matchedTrademarks.length > 0) {
    flagged.push({
      slug: g.slug,
      title: g.title,
      category: g.category,
      matched_trademark: matchedTrademarks.join("; "),
      needs_review: true,
      iframeUrl: g.iframeUrl,
    });
  }
}

console.log(`Total games scanned: ${games.length}`);
console.log(`Games flagged for trademark review: ${flagged.length}`);

// Generate CSV
const csvHeader = "slug,title,category,matched_trademark,needs_review,iframeUrl\n";
const csvRows = flagged
  .map(
    (f) =>
      `"${f.slug.replace(/"/g, '""')}","${f.title.replace(/"/g, '""')}","${f.category.replace(/"/g, '""')}","${f.matched_trademark.replace(/"/g, '""')}",${f.needs_review},"${f.iframeUrl.replace(/"/g, '""')}"`
  )
  .join("\n");

const outputPath = path.join(__dirname, "../trademark_review.csv");
fs.writeFileSync(outputPath, csvHeader + csvRows, "utf8");

// Also save in artifacts if directory exists
const artifactDir = "C:\\Users\\sahil\\.gemini\\antigravity-ide\\brain\\2cccbd6c-a18c-45ca-b139-42c89fcc56e5";
if (fs.existsSync(artifactDir)) {
  fs.writeFileSync(path.join(artifactDir, "trademark_review.csv"), csvHeader + csvRows, "utf8");
}

console.log(`Saved trademark review report to ${outputPath}!`);
console.log("Sample flagged items:");
flagged.slice(0, 10).forEach((f) => {
  console.log(` - [${f.matched_trademark}] ${f.title} (${f.slug})`);
});
