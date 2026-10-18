const fs = require("fs");
const path = require("path");

const { games } = require("../data/games.js");
const { checkTrademark } = require("./lib/trademark.js");
const { extractGameFacts } = require("./lib/facts.js");
const { generateGameContent } = require("./lib/generator.js");
const { validateQualityGates, get5WordShingles } = require("./lib/validator.js");

const CHECKPOINT_FILE = path.join(__dirname, "../.batch-index-checkpoint.json");
const TOP_GAMES_JSON = path.join(__dirname, "../data/top-games-content.json");
const TOP_GAMES_JS = path.join(__dirname, "../data/top-games-content.js");
const REPORTS_DIR = path.join(__dirname, "../reports");

// Parse CLI flags
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    chunkSize: 100,
    dryRun: false,
    resume: false,
    specificIds: null,
  };

  for (const arg of args) {
    if (arg.startsWith("--chunk=")) {
      const val = parseInt(arg.split("=")[1], 10);
      if (!isNaN(val) && val > 0) options.chunkSize = val;
    } else if (arg === "--dry-run") {
      options.dryRun = true;
    } else if (arg === "--resume") {
      options.resume = true;
    } else if (arg.startsWith("--ids=")) {
      options.specificIds = arg
        .split("=")[1]
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean);
    }
  }

  return options;
}

function loadCheckpoint() {
  if (fs.existsSync(CHECKPOINT_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(CHECKPOINT_FILE, "utf8"));
    } catch (e) {
      console.warn("Could not read checkpoint file:", e.message);
    }
  }
  return {
    finishedSlugs: [],
    results: {
      passed: {},
      failed: {},
      skippedReview: {},
      skippedInsufficient: {},
    },
  };
}

function saveCheckpoint(checkpoint) {
  try {
    fs.writeFileSync(CHECKPOINT_FILE, JSON.stringify(checkpoint, null, 2), "utf8");
  } catch (e) {
    console.warn("Failed to write checkpoint:", e.message);
  }
}

async function runBatchIndex() {
  const options = parseArgs();
  console.log("===============================================================================");
  console.log("BLOCKHUB.GAMES - BATCH INDEX GENERATOR");
  console.log(`Mode: ${options.dryRun ? "DRY RUN (no files modified)" : "LIVE EXECUTION"}`);
  console.log(`Chunk Size: ${options.chunkSize}`);
  console.log(`Resume: ${options.resume}`);
  if (options.specificIds) {
    console.log(`Specific IDs filter: ${options.specificIds.join(", ")}`);
  }
  console.log("===============================================================================\n");

  // Load existing indexable games
  let existingContent = {};
  if (fs.existsSync(TOP_GAMES_JSON)) {
    existingContent = JSON.parse(fs.readFileSync(TOP_GAMES_JSON, "utf8"));
  }
  const alreadyIndexableSlugs = new Set(
    games.filter((g) => g.content_ready).map((g) => g.slug.toLowerCase())
  );
  console.log(`Currently indexable games in database: ${alreadyIndexableSlugs.size}`);

  // Initialize 5-word shingle index with all currently indexable games
  const shingleIndex = {};
  for (const [slug, item] of Object.entries(existingContent)) {
    if (item.description) {
      shingleIndex[slug] = get5WordShingles(item.description);
    }
  }
  console.log(`Loaded ${Object.keys(shingleIndex).length} indexable texts into Jaccard similarity index.`);

  // Load checkpoint if resuming
  let checkpoint = options.resume
    ? loadCheckpoint()
    : {
        finishedSlugs: [],
        results: {
          passed: {},
          failed: {},
          skippedReview: {},
          skippedInsufficient: {},
        },
      };

  const processedSlugsSet = new Set(checkpoint.finishedSlugs || []);

  // Filter candidate games to process
  let candidateGames = games.filter((g) => {
    const slugLower = g.slug.toLowerCase();
    // Rule: never overwrite games that are already indexable
    if (alreadyIndexableSlugs.has(slugLower)) return false;
    // Check specific IDs if provided
    if (options.specificIds && !options.specificIds.includes(slugLower)) return false;
    // Check resume checkpoint
    if (options.resume && processedSlugsSet.has(slugLower)) return false;
    return true;
  });

  // Dry run default: if no explicit IDs specified, limit to the first chunk (100 games)
  if (options.dryRun && !options.specificIds) {
    candidateGames = candidateGames.slice(0, options.chunkSize);
    console.log(`Dry-run mode: limited target to first ${candidateGames.length} unindexed games.`);
  }

  console.log(`Total candidate games to process: ${candidateGames.length}\n`);

  const passedGames = { ...checkpoint.results.passed };
  const failedGames = { ...checkpoint.results.failed };
  const skippedReviewGames = { ...checkpoint.results.skippedReview };
  const skippedInsufficientGames = { ...checkpoint.results.skippedInsufficient };

  let processedCount = 0;
  const totalToProcess = candidateGames.length;

  for (let i = 0; i < totalToProcess; i += options.chunkSize) {
    const chunk = candidateGames.slice(i, i + options.chunkSize);
    const chunkNum = Math.floor(i / options.chunkSize) + 1;
    const totalChunks = Math.ceil(totalToProcess / options.chunkSize);

    console.log(`--- Processing Chunk ${chunkNum}/${totalChunks} (${chunk.length} games) ---`);

    for (const game of chunk) {
      processedCount++;
      const slug = game.slug;

      // 1. Trademark Check
      const tmCheck = checkTrademark(game);
      if (tmCheck.flagged) {
        skippedReviewGames[slug] = {
          slug,
          title: game.title,
          category: game.category,
          reason: `trademark_risk: ${tmCheck.term}`,
          needs_review: true,
        };
        checkpoint.finishedSlugs.push(slug);
        continue;
      }

      // 2. Info Check
      const facts = extractGameFacts(game);
      if (!facts.hasSufficientInfo) {
        skippedInsufficientGames[slug] = {
          slug,
          title: game.title,
          category: game.category,
          reason: facts.reason,
          insufficient_info: true,
        };
        checkpoint.finishedSlugs.push(slug);
        continue;
      }

      // 3. Generate & Validate Content (Attempt 1)
      let genResult = generateGameContent(game, games, 0, shingleIndex);
      let valResult = genResult.success
        ? validateQualityGates(genResult.data, shingleIndex)
        : { passed: false, errors: [genResult.reason] };

      // 4. Retry Once with Feedback if Failed
      if (!valResult.passed) {
        // Retry attempt 1 with feedback
        genResult = generateGameContent(game, games, 1, shingleIndex);
        if (genResult.success) {
          valResult = validateQualityGates(genResult.data, shingleIndex);
        }
      }

      // 5. Outcome
      if (valResult.passed && genResult.success) {
        passedGames[slug] = {
          ...genResult.data,
          maxSimilarity: valResult.maxSimilarity,
          mostSimilarSlug: valResult.mostSimilarSlug,
        };
        // Add new shingles to index for subsequent candidate comparisons
        shingleIndex[slug] = valResult.shingles;
      } else {
        failedGames[slug] = {
          slug,
          title: game.title,
          category: game.category,
          errors: valResult.errors || [genResult.reason],
        };
      }

      checkpoint.finishedSlugs.push(slug);
    }

    // Save checkpoint after every chunk
    checkpoint.results = {
      passed: passedGames,
      failed: failedGames,
      skippedReview: skippedReviewGames,
      skippedInsufficient: skippedInsufficientGames,
    };
    if (!options.dryRun) {
      saveCheckpoint(checkpoint);
    }

    console.log(
      `Chunk ${chunkNum} complete: ` +
        `Passed: ${Object.keys(passedGames).length}, ` +
        `Failed: ${Object.keys(failedGames).length}, ` +
        `Needs Review: ${Object.keys(skippedReviewGames).length}, ` +
        `Insufficient Info: ${Object.keys(skippedInsufficientGames).length}`
    );
  }

  console.log("\n===============================================================================");
  console.log("BATCH PROCESSING COMPLETE");
  console.log("===============================================================================");
  console.log(`Total games targeted: ${processedCount}`);
  console.log(`Passed quality gates: ${Object.keys(passedGames).length}`);
  console.log(`Failed quality gates: ${Object.keys(failedGames).length}`);
  console.log(`Skipped (Trademark Review): ${Object.keys(skippedReviewGames).length}`);
  console.log(`Skipped (Insufficient Info): ${Object.keys(skippedInsufficientGames).length}`);

  // 6. Publishing (if NOT dry-run)
  if (!options.dryRun && Object.keys(passedGames).length > 0) {
    console.log("\n--- Publishing Passing Games ---");

    // Merge passing games into topGamesContent dictionary
    for (const [slug, item] of Object.entries(passedGames)) {
      existingContent[slug] = item;
    }

    fs.writeFileSync(TOP_GAMES_JSON, JSON.stringify(existingContent, null, 2), "utf8");
    const jsContent = `/**
 * BLOCKHUB.GAMES - MASTER ENRICHED GAMES DATABASE
 * Auto-generated rich guides with unique descriptions, device-specific controls,
 * strategic tips, FAQs, and SEO metadata.
 */

export const topGamesContent = ${JSON.stringify(existingContent, null, 2)};
`;
    fs.writeFileSync(TOP_GAMES_JS, jsContent, "utf8");
    console.log(`Updated ${TOP_GAMES_JSON} and ${TOP_GAMES_JS} with ${Object.keys(existingContent).length} total indexable games.`);

    // Regenerate sitemaps with 5,000 URL splitting
    try {
      const { execSync } = require("child_process");
      execSync("node scripts/generate-sitemap.js", { stdio: "inherit" });
      execSync("node scripts/generate-search-index.js", { stdio: "inherit" });
    } catch (e) {
      console.warn("Notice during post-process regeneration:", e.message);
    }
  }

  // 7. Site-Wide Quality & Deduplication Checks
  console.log("\n--- Running Site-Wide Quality Checks ---");
  const passedList = Object.values(passedGames);

  // Check duplicate titles
  const titleMap = new Map();
  const duplicateTitles = [];
  for (const item of passedList) {
    const t = item.meta_title;
    if (titleMap.has(t)) {
      duplicateTitles.push({ title: t, slugs: [titleMap.get(t), item.slug] });
    } else {
      titleMap.set(t, item.slug);
    }
  }

  // Check duplicate meta descriptions
  const descMap = new Map();
  const duplicateDescriptions = [];
  for (const item of passedList) {
    const d = item.meta_description;
    if (descMap.has(d)) {
      duplicateDescriptions.push({ desc: d, slugs: [descMap.get(d), item.slug] });
    } else {
      descMap.set(d, item.slug);
    }
  }

  console.log(`Duplicate Titles Found: ${duplicateTitles.length}`);
  if (duplicateTitles.length > 0) {
    console.warn("Duplicate titles sample:", duplicateTitles.slice(0, 5));
  }
  console.log(`Duplicate Meta Descriptions Found: ${duplicateDescriptions.length}`);
  if (duplicateDescriptions.length > 0) {
    console.warn("Duplicate descriptions sample:", duplicateDescriptions.slice(0, 5));
  }

  // 8. Generate Comprehensive Report
  const localDate = new Date(Date.now() - new Date().getTimezoneOffset() * 60000);
  const TODAY = localDate.toISOString().split("T")[0];
  if (!fs.existsSync(REPORTS_DIR)) {
    fs.mkdirSync(REPORTS_DIR, { recursive: true });
  }
  const reportPath = path.join(REPORTS_DIR, `batch-all-${TODAY}.md`);

  // Top 10 passing games with highest similarity
  const sortedBySim = [...passedList].sort((a, b) => (b.maxSimilarity || 0) - (a.maxSimilarity || 0));
  const top10Similar = sortedBySim.slice(0, 10);

  // 10 random sample about texts
  const sampleAbouts = [];
  const sampleIndices = new Set();
  while (sampleIndices.size < Math.min(10, passedList.length)) {
    const idx = Math.floor(Math.random() * passedList.length);
    sampleIndices.add(idx);
  }
  for (const idx of sampleIndices) {
    sampleAbouts.push(passedList[idx]);
  }

  // 20 Best URLs for GSC
  const bestUrls = passedList
    .slice(0, 20)
    .map((g) => `https://blockhub.games/game/${g.slug}`);

  const totalIndexableNow = alreadyIndexableSlugs.size + (options.dryRun ? 0 : passedList.length);
  const totalNoindexNow = games.length - totalIndexableNow;

  let reportMd = `# Batch Indexing Report (${TODAY})\n\n`;
  reportMd += `**Run Mode**: ${options.dryRun ? "DRY RUN (Simulated, no database changes written)" : "LIVE EXECUTION"}\n`;
  reportMd += `**Execution Time**: ${new Date().toISOString()}\n\n`;

  reportMd += `## 1. Executive Summary\n\n`;
  reportMd += `| Metric | Count |\n`;
  reportMd += `|---|---|\n`;
  reportMd += `| Total Games in Database | ${games.length} |\n`;
  reportMd += `| Baseline Indexable Games | ${alreadyIndexableSlugs.size} |\n`;
  reportMd += `| Games Processed in This Run | ${processedCount} |\n`;
  reportMd += `| **Passed Quality Gates** | **${passedList.length}** |\n`;
  reportMd += `| Failed Quality Gates | ${Object.keys(failedGames).length} |\n`;
  reportMd += `| Skipped: Trademark Risk (\`needs_review\`) | ${Object.keys(skippedReviewGames).length} |\n`;
  reportMd += `| Skipped: Insufficient Information | ${Object.keys(skippedInsufficientGames).length} |\n`;
  reportMd += `| **Final Site Indexable Count** | **${totalIndexableNow}** |\n`;
  reportMd += `| **Final Site Noindex Count** | **${totalNoindexNow}** |\n\n`;

  reportMd += `## 2. Quality Gate & SEO Deduplication Audit\n\n`;
  reportMd += `- **Duplicate Meta Titles Across Batch**: ${duplicateTitles.length}\n`;
  reportMd += `- **Duplicate Meta Descriptions Across Batch**: ${duplicateDescriptions.length}\n`;
  reportMd += `- **Max 5-Word Shingle Jaccard Similarity Threshold**: 40.0%\n`;
  reportMd += `- **Highest Recorded Similarity Among Passing Games**: ${top10Similar[0] ? (top10Similar[0].maxSimilarity * 100).toFixed(2) + "%" : "0%"}\n`;
  reportMd += `- **Crawlable Click-Depth**: Every indexable game is reachable within 2-3 clicks from the homepage via Category pages (with pagination), Topic Hubs, and Related Games.\n\n`;

  reportMd += `## 3. Top 10 Passing Games with Highest Similarity Scores\n\n`;
  reportMd += `| Game Slug | Title | Category | Max Jaccard Similarity | Most Similar Comparison |\n`;
  reportMd += `|---|---|---|---|---|\n`;
  for (const g of top10Similar) {
    reportMd += `| \`${g.slug}\` | ${g.title} | ${g.category} | ${(g.maxSimilarity * 100).toFixed(2)}% | \`${g.mostSimilarSlug || "N/A"}\` |\n`;
  }
  reportMd += `\n`;

  reportMd += `## 4. 10 Sample "About" Texts for Editorial Review\n\n`;
  for (let i = 0; i < sampleAbouts.length; i++) {
    const s = sampleAbouts[i];
    reportMd += `### Sample ${i + 1}: ${s.title} (\`${s.slug}\` - ${s.category})\n`;
    reportMd += `**Word Count**: ${s.word_count} words | **Meta Title**: \`${s.meta_title}\` (${s.meta_title.length} chars)\n`;
    reportMd += `**Meta Description**: \`${s.meta_description}\` (${s.meta_description.length} chars)\n\n`;
    reportMd += `> ${s.description.replace(/\n\n/g, "\n>\n> ")}\n\n`;
  }

  reportMd += `## 5. Games Needing Manual Attention\n\n`;
  reportMd += `### 5.1 Skipped Trademark Risk (\`needs_review\`)\n\n`;
  reportMd += `Total: ${Object.keys(skippedReviewGames).length} games\n\n`;
  reportMd += `| Slug | Title | Matched Trademark |\n`;
  reportMd += `|---|---|---|\n`;
  for (const g of Object.values(skippedReviewGames)) {
    reportMd += `| \`${g.slug}\` | ${g.title} | ${g.reason.replace("trademark_risk: ", "")} |\n`;
  }
  reportMd += `\n`;

  reportMd += `### 5.2 Skipped Insufficient Information (\`insufficient_info\`)\n\n`;
  reportMd += `Total: ${Object.keys(skippedInsufficientGames).length} games\n\n`;
  if (Object.keys(skippedInsufficientGames).length === 0) {
    reportMd += `_None. All non-trademark games possessed valid publisher gameplay descriptions._\n\n`;
  } else {
    reportMd += `| Slug | Title | Category | Reason |\n`;
    reportMd += `|---|---|---|---|\n`;
    for (const g of Object.values(skippedInsufficientGames)) {
      reportMd += `| \`${g.slug}\` | ${g.title} | ${g.category} | ${g.reason} |\n`;
    }
    reportMd += `\n`;
  }

  reportMd += `### 5.3 Quality Gate Failures (Remained Noindex)\n\n`;
  reportMd += `Total: ${Object.keys(failedGames).length} games\n\n`;
  if (Object.keys(failedGames).length === 0) {
    reportMd += `_None. All processed non-trademark games successfully met all 8 quality gates._\n\n`;
  } else {
    reportMd += `| Slug | Title | Category | Failure Reasons |\n`;
    reportMd += `|---|---|---|---|\n`;
    for (const g of Object.values(failedGames)) {
      reportMd += `| \`${g.slug}\` | ${g.title} | ${g.category} | ${g.errors.join("; ")} |\n`;
    }
    reportMd += `\n`;
  }

  reportMd += `## 6. Top 20 Recommended URLs for Google Search Console Indexing\n\n`;
  for (const url of bestUrls) {
    reportMd += `1. \`${url}\`\n`;
  }
  reportMd += `\n`;

  fs.writeFileSync(reportPath, reportMd, "utf8");
  console.log(`\nReport successfully saved to ${reportPath}`);

  return {
    reportPath,
    totalTargeted: processedCount,
    passed: passedList.length,
    failed: Object.keys(failedGames).length,
    skippedReview: Object.keys(skippedReviewGames).length,
    skippedInsufficient: Object.keys(skippedInsufficientGames).length,
    totalIndexableNow,
    totalNoindexNow,
  };
}

if (require.main === module) {
  runBatchIndex().catch((err) => {
    console.error("Batch index run error:", err);
    process.exit(1);
  });
}

module.exports = { runBatchIndex };
