const fs = require("fs");
const path = require("path");

const gamesFile = path.join(__dirname, "../data/games.js");
const outputFile = path.join(__dirname, "../public/search-index.json");

console.log("Generating lightweight search index from data/games.js...");

// Read rawGames directly to avoid loading topGamesContent into memory
const content = fs.readFileSync(gamesFile, "utf8");
const rawGamesMatch = content.match(/const rawGames = (\[[\s\S]*?\]);\s*function enrichGame/);

if (!rawGamesMatch) {
  console.error("Could not find rawGames in data/games.js");
  process.exit(1);
}

let rawGames;
try {
  rawGames = JSON.parse(rawGamesMatch[1]);
} catch (e) {
  console.error("Failed to parse rawGames JSON:", e.message);
  process.exit(1);
}

// Map to minimal search index items
const searchIndex = rawGames.map((g) => ({
  slug: g.slug,
  title: g.title,
  category: g.category,
  thumbnail: g.thumbnail,
}));

fs.writeFileSync(outputFile, JSON.stringify(searchIndex), "utf8");
console.log(
  `Successfully generated public/search-index.json with ${searchIndex.length} games (${Math.round(
    fs.statSync(outputFile).size / 1024
  )} KB)!`
);
