const fs = require("fs");
const path = require("path");

const EXPLICIT_BLOCKLIST = [
  "standout free online racing game",
  "high-velocity speed",
  "testing your skills and strategic execution",
  "zero latency",
  "enter the arena",
];

let cachedBlocklist = null;

function getBlocklist() {
  if (cachedBlocklist) return cachedBlocklist;

  const blocklist = new Set(EXPLICIT_BLOCKLIST.map((p) => p.toLowerCase()));

  try {
    const topGamesPath = path.join(__dirname, "../../data/top-games-content.json");
    if (fs.existsSync(topGamesPath)) {
      const topGames = JSON.parse(fs.readFileSync(topGamesPath, "utf8"));
      const phraseDocCounts = new Map();

      for (const slug of Object.keys(topGames)) {
        const item = topGames[slug];
        const text = (item.description || "").toLowerCase().replace(/[^a-z0-9\s]/g, " ");
        const words = text.split(/\s+/).filter(Boolean);

        const seenInDoc = new Set();
        // 4-word, 5-word, and 6-word shingles
        for (let len of [4, 5, 6]) {
          for (let i = 0; i <= words.length - len; i++) {
            const phrase = words.slice(i, i + len).join(" ");
            if (!seenInDoc.has(phrase)) {
              seenInDoc.add(phrase);
              phraseDocCounts.set(phrase, (phraseDocCounts.get(phrase) || 0) + 1);
            }
          }
        }
      }

      // Add phrases appearing on more than 20 pages
      for (const [phrase, count] of phraseDocCounts.entries()) {
        if (count > 20) {
          blocklist.add(phrase);
        }
      }
    }
  } catch (err) {
    console.warn("Notice: Unable to auto-derive blocklist from top-games-content.json:", err.message);
  }

  cachedBlocklist = Array.from(blocklist);
  return cachedBlocklist;
}

function checkBlocklist(text) {
  const normalized = (text || "").toLowerCase().replace(/[^a-z0-9\s]/g, " ");
  const list = getBlocklist();
  const matched = [];

  for (const phrase of list) {
    if (normalized.includes(phrase)) {
      matched.push(phrase);
    }
  }

  return matched;
}

module.exports = {
  EXPLICIT_BLOCKLIST,
  getBlocklist,
  checkBlocklist,
};
