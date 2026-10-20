const fs = require("fs");
const path = require("path");

const b1 = require("./batches/prose-batch-1.js");
const b2 = require("./batches/prose-batch-2.js");
const b3 = require("./batches/prose-batch-3.js");
const b4 = require("./batches/prose-batch-4.js");
const b5 = require("./batches/prose-batch-5.js");
const b6 = require("./batches/prose-batch-6.js");
const b7 = require("./batches/prose-batch-7.js");

const all157Prose = { ...b1, ...b2, ...b3, ...b4, ...b5, ...b6, ...b7 };

const TOP_JSON = path.join(__dirname, "../data/top-games-content.json");
const TOP_JS = path.join(__dirname, "../data/top-games-content.js");
const INDEXABLE_CSV = path.join(__dirname, "../reports/indexable-games.csv");

const { rawGames } = require("../data/games.js");
const {
  validateQualityGates,
  get5WordShingles,
  computeJaccardSimilarity,
} = require("./lib/validator.js");

// Read indexable slugs from CSV (skipping header)
const csvContent = fs.readFileSync(INDEXABLE_CSV, "utf8");
const csvLines = csvContent.split(/\r?\n/).filter((l) => l.trim().length > 0);
const header = csvLines[0]; // slug,title,category,subgenre,word_count,...
const indexableSlugs = csvLines.slice(1).map((l) => {
  // extract slug (first field before comma, strip quotes)
  const m = l.match(/^"([^"]+)"|^([^,]+)/);
  return m ? (m[1] || m[2]) : "";
}).filter(Boolean);

console.log(`Indexable slugs count in CSV: ${indexableSlugs.length}`);
console.log(`Prose keys count in batches: ${Object.keys(all157Prose).length}`);

if (indexableSlugs.length !== 157 || Object.keys(all157Prose).length !== 157) {
  console.error("Mismatch: expected exactly 157 indexable slugs!");
  process.exit(1);
}

// Check every slug exists in prose batches
const missing = indexableSlugs.filter((s) => !all157Prose[s]);
if (missing.length > 0) {
  console.error("Missing slugs in batches:", missing);
  process.exit(1);
}

// Load topContent
const topContent = JSON.parse(fs.readFileSync(TOP_JSON, "utf8"));
console.log(`Total games in topContent: ${Object.keys(topContent).length}`);

// Update ONLY the 157 indexable games
for (const slug of indexableSlugs) {
  if (!topContent[slug]) {
    console.warn(`Slug ${slug} missing in topContent, creating entry...`);
    topContent[slug] = { slug };
  }
  const prose = all157Prose[slug].trim();
  topContent[slug].description = prose;
  topContent[slug].word_count = prose.split(/\s+/).filter(Boolean).length;
}

// Save back to JSON and JS
fs.writeFileSync(TOP_JSON, JSON.stringify(topContent, null, 2), "utf8");
fs.writeFileSync(TOP_JS, `export const topGamesContent = ${JSON.stringify(topContent, null, 2)};\n`, "utf8");
console.log("Successfully updated top-games-content.json and top-games-content.js for the 157 indexable games.");

// Build shingleMap and catalogSentenceCounts for the 157 games
const shingleMap = {};
const catalogSentenceCounts = new Map();

for (const slug of indexableSlugs) {
  const item = topContent[slug];
  if (item && item.description) {
    shingleMap[slug] = get5WordShingles(item.description);
    const sentences = item.description.split(/(?<=[.!?])\s+/);
    for (const s of sentences) {
      const norm = s.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
      if (norm.length > 20) {
        catalogSentenceCounts.set(norm, (catalogSentenceCounts.get(norm) || 0) + 1);
      }
    }
  }
}

// Full audit on the 157 games
console.log("\nAuditing all 157 updated games with strict Quality Gates...");
let passCount = 0;
let failCount = 0;
const failureReport = [];

for (const slug of indexableSlugs) {
  const game = topContent[slug];
  if (!game.raw_description || !game.raw_how_to) {
    const rawG = rawGames.find((r) => r.slug.toLowerCase() === slug.toLowerCase());
    if (rawG) {
      game.raw_description = rawG.description;
      game.raw_how_to = rawG.howToPlay;
    }
  }

  const valResult = validateQualityGates(game, shingleMap, catalogSentenceCounts);
  if (valResult.passed) {
    passCount++;
  } else {
    failCount++;
    failureReport.push({ slug, errors: valResult.errors, words: game.word_count });
  }
}

// Pairwise Jaccard similarity among the 157 games
console.log("\nChecking pairwise similarity among all 157 indexable games...");
let highSimilarityPairs = 0;
for (let i = 0; i < indexableSlugs.length; i++) {
  const sA = indexableSlugs[i];
  for (let j = i + 1; j < indexableSlugs.length; j++) {
    const sB = indexableSlugs[j];
    const sim = computeJaccardSimilarity(shingleMap[sA], shingleMap[sB]);
    if (sim > 0.40) {
      highSimilarityPairs++;
      console.warn(`High similarity between ${sA} and ${sB}: ${(sim * 100).toFixed(1)}%`);
    }
  }
}

console.log(`\n======================================================`);
console.log(`157 Indexable Games Validation Summary:`);
console.log(`Passed: ${passCount} / 157`);
console.log(`Failed: ${failCount} / 157`);
console.log(`High-similarity pairs (>40%): ${highSimilarityPairs}`);
console.log(`======================================================\n`);

if (failCount > 0) {
  console.error("FAILURES DETECTED:");
  for (const f of failureReport) {
    console.error(`- ${f.slug} (${f.words}w): ${f.errors.join("; ")}`);
  }
  process.exit(1);
} else {
  console.log("All 157 indexable games PASS 100% with ZERO errors!");
}
