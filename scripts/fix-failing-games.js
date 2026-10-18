#!/usr/bin/env node
/**
 * Regenerate content for all 161 games failing quality audit (including euro-truck-parking).
 * Ensures:
 * - 150-300 words
 * - 0 repeated sentences or paragraphs
 * - 0 banned generic phrases
 * - Authentic category-fit tips (no racing tips on parking games!)
 * - Curated 8 related games
 * - meta_title (<=60 chars) & meta_description (140-160 chars)
 * - Jaccard similarity < 40%
 */

const fs = require("fs");
const path = require("path");

const { games } = require("../data/games.js");
const { generateGameContent } = require("./lib/generator.js");
const { validateQualityGates, get5WordShingles } = require("./lib/validator.js");
const { auditGame } = require("./audit-indexing.js");

const TOP_JSON = path.join(__dirname, "../data/top-games-content.json");
const TOP_JS = path.join(__dirname, "../data/top-games-content.js");

async function main() {
  console.log("=== REGENERATING FAILING GAMES CONTENT ===");

  const topContent = JSON.parse(fs.readFileSync(TOP_JSON, "utf8"));

  // Build shingle map from already passing games
  const shingleMap = {};
  const metaDescMap = new Map();

  for (const game of games) {
    if (game.content_ready && game.description) {
      const audit = auditGame(game);
      if (audit.issues.length === 0) {
        shingleMap[game.slug] = get5WordShingles(game.description);
        if (game.meta_description) metaDescMap.set(game.slug, game.meta_description);
      }
    }
  }

  console.log(`Initial passing games in similarity index: ${Object.keys(shingleMap).length}`);

  // Find all failing games that have content_ready
  const failingGames = games.filter((g) => {
    if (!g.content_ready) return false;
    const audit = auditGame(g);
    return audit.issues.length > 0;
  });

  console.log(`Total failing games to fix: ${failingGames.length}\n`);

  let fixedCount = 0;
  let failedCount = 0;

  for (let idx = 0; idx < failingGames.length; idx++) {
    const rawGame = failingGames[idx];
    console.log(`[${idx + 1}/${failingGames.length}] Processing ${rawGame.slug}...`);

    let passedContent = null;

    // Try up to 3 generation attempts
    for (let attempt = 0; attempt < 3; attempt++) {
      const genResult = generateGameContent(rawGame, games, attempt, shingleMap);
      if (!genResult.success) continue;

      const data = genResult.data;
      const val = validateQualityGates(data, shingleMap);
      if (!val.passed) {
        continue;
      }

      const audit = auditGame(data, shingleMap, metaDescMap);
      if (audit.issues.length === 0) {
        passedContent = data;
        break;
      }
    }

    if (passedContent) {
      // Mark as content_ready: true, indexable: true
      passedContent.content_ready = true;
      passedContent.indexable = true;

      // Update in topContent
      topContent[rawGame.slug] = passedContent;
      // Add to shingle map so future generations don't collide
      shingleMap[rawGame.slug] = get5WordShingles(passedContent.description);
      if (passedContent.meta_description) {
        metaDescMap.set(rawGame.slug, passedContent.meta_description);
      }

      fixedCount++;
      console.log(`  ✅ Fixed: ${passedContent.word_count} words, 0 issues`);
    } else {
      failedCount++;
      console.log(`  ❌ Failed to generate passing content`);
    }
  }

  console.log(`\n========================================`);
  console.log(`Fixed:  ${fixedCount}`);
  console.log(`Failed: ${failedCount}`);
  console.log(`========================================\n`);

  // Write updated top-games-content
  console.log("Saving top-games-content.json and top-games-content.js...");
  fs.writeFileSync(TOP_JSON, JSON.stringify(topContent, null, 2), "utf8");
  fs.writeFileSync(TOP_JS, `export const topGamesContent = ${JSON.stringify(topContent, null, 2)};\n`, "utf8");
  console.log("Saved successfully!");
}

if (require.main === module) {
  main().catch(console.error);
}
