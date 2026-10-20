const fs = require('fs');
const path = require('path');
const { rawGames, games } = require('../data/games.js');
const { synthesizeFactualProse } = require('./lib/factual-synthesizer.js');
const {
  validateQualityGates,
  validateCatalogPatterns,
  get5WordShingles,
  computeJaccardSimilarity,
} = require('./lib/validator.js');
const { checkTrademark } = require('./lib/trademark.js');
const { generateRelatedGames } = require('./lib/generator-v2.js');

console.log('=== ORCHESTRATE ALL 623 GAMES REGENERATION ===\n');

// 1. Load Data
const TOP_JSON = path.join(__dirname, '../data/top-games-content.json');
const TOP_JS = path.join(__dirname, '../data/top-games-content.js');
const topContent = JSON.parse(fs.readFileSync(TOP_JSON, 'utf8'));

const rawMap = new Map();
for (const r of rawGames) rawMap.set(r.slug, r);
for (const g of games) if (!rawMap.has(g.slug)) rawMap.set(g.slug, g);

// Backup 155 live indexable games to guarantee 0 mutations
const live155Backup = {};
for (const [slug, item] of Object.entries(topContent)) {
  if (item.indexable) {
    live155Backup[slug] = JSON.parse(JSON.stringify(item));
  }
}
console.log(`Live indexable games backed up: ${Object.keys(live155Backup).length}`);

// 2. Identify 623 Eligible Slugs
const allSlugs = Object.keys(topContent).sort();
const eligibleSlugs = allSlugs.filter(s => topContent[s].template_version !== 'v2').sort();
console.log(`Total games in store: ${allSlugs.length}`);
console.log(`Eligible games to regenerate: ${eligibleSlugs.length}`);

if (eligibleSlugs.length !== 623) {
  console.error(`ERROR: Expected 623 eligible games, found ${eligibleSlugs.length}!`);
  process.exit(1);
}

// 3. Load Near-Duplicates and Trademarks
const ND_PATH = path.join(__dirname, '../reports/near-duplicates.csv');
const ndRaw = fs.readFileSync(ND_PATH, 'utf8');
const ndLines = ndRaw.trim().split(/\r?\n/).slice(1);
const nonCanonicalNearDupes = new Set();

for (const line of ndLines) {
  const parts = line.split(',').map(s => s.replace(/^"|"$/g, '').trim());
  const [slugA, slugB, sim, sameEmbed, inSitemap, recAction, sugAction, canonical] = parts;
  if (canonical) {
    if (slugA && slugA !== canonical) nonCanonicalNearDupes.add(slugA);
    if (slugB && slugB !== canonical) nonCanonicalNearDupes.add(slugB);
  }
}
console.log(`Identified ${nonCanonicalNearDupes.size} non-canonical near-duplicates from reports/near-duplicates.csv.`);

const trademarkBlockedSlugs = new Set();
for (const slug of eligibleSlugs) {
  const item = topContent[slug] || {};
  const tm = checkTrademark({ slug, title: item.title });
  if (tm.flagged && tm.blocksIndex) {
    trademarkBlockedSlugs.add(slug);
  }
}
console.log(`Identified ${trademarkBlockedSlugs.size} trademark-blocked games among eligible.`);

// 4. Pre-fill shingleMap & catalogSentenceCounts with existing 207 v2 games
const shingleMap = {};
const catalogSentenceCounts = new Map();

for (const [slug, item] of Object.entries(topContent)) {
  if (item.template_version === 'v2') {
    shingleMap[slug] = get5WordShingles(item.description);
    const rawSentences = (item.description || '').split(/(?<=[.!?])\s+/).filter(s => s.length > 20);
    for (const s of rawSentences) {
      const cleanNorm = s.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').trim();
      catalogSentenceCounts.set(cleanNorm, (catalogSentenceCounts.get(cleanNorm) || 0) + 1);
    }
  }
}
console.log(`Pre-filled shingles & sentences from ${Object.keys(shingleMap).length} existing v2 games.`);

// 5. Generate Content for all 623 games
console.log('\nGenerating content for all 623 games...');
const generatedMap = {};
const generatedList = [];

let nearDupeCount = 0;
let trademarkCount = 0;
let scheduledCount = 0;

for (let i = 0; i < eligibleSlugs.length; i++) {
  const slug = eligibleSlugs[i];
  const orig = topContent[slug] || {};
  const rawG = rawMap.get(slug) || {};

  const crafted = synthesizeFactualProse(orig, rawG, i);
  const related = generateRelatedGames(slug, crafted.category, crafted.subgenre, games);
  crafted.related = related;

  if (nonCanonicalNearDupes.has(slug)) {
    crafted.status = 'PASS_NOINDEX_NEAR_DUPE';
    crafted.release_date = 'NONE';
    crafted.indexable = false;
    nearDupeCount++;
  } else if (trademarkBlockedSlugs.has(slug)) {
    crafted.status = 'BLOCKED_TRADEMARK';
    crafted.release_date = 'NONE';
    crafted.indexable = false;
    trademarkCount++;
  } else {
    crafted.status = 'PASS_SCHEDULED';
    crafted.release_date = '2026-10-21';
    crafted.indexable = false;
    scheduledCount++;
  }

  generatedMap[slug] = crafted;
  generatedList.push(crafted);

  // Track shingles & sentences
  shingleMap[slug] = get5WordShingles(crafted.description);
  const rawSentences = (crafted.description || '').split(/(?<=[.!?])\s+/).filter(s => s.length > 20);
  for (const s of rawSentences) {
    const cleanNorm = s.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').trim();
    catalogSentenceCounts.set(cleanNorm, (catalogSentenceCounts.get(cleanNorm) || 0) + 1);
  }
}

console.log(`Generation complete:`);
console.log(`- Scheduled Release : ${scheduledCount}`);
console.log(`- Near-Dupe Noindex : ${nearDupeCount}`);
console.log(`- Trademark Blocked : ${trademarkCount}`);
console.log(`- Total Regenerated : ${generatedList.length}`);

// 6. Validate Quality Gates on ALL 623 games
console.log('\nValidating all 20 Quality Gates on all 623 games...');
let passedCount = 0;
let failedCount = 0;
const failureDetails = [];

for (const game of generatedList) {
  const res = validateQualityGates(game, shingleMap, catalogSentenceCounts);
  const isTrademarkBlocked = game.status === 'BLOCKED_TRADEMARK';
  const realErrors = isTrademarkBlocked
    ? res.errors.filter(e => !e.startsWith('trademark_detected_blocks_indexability'))
    : res.errors;

  if (realErrors.length > 0) {
    failedCount++;
    failureDetails.push({ slug: game.slug, errors: realErrors });
  } else {
    passedCount++;
  }
}

console.log(`Quality Gates Result: ${passedCount} passed, ${failedCount} failed / 623 total.`);

if (failedCount > 0) {
  console.error('\nFAILURES ENCOUNTERED:');
  for (const f of failureDetails.slice(0, 10)) {
    console.error(`- ${f.slug}:`);
    for (const e of f.errors) console.error(`    ${e}`);
  }
  if (failureDetails.length > 10) {
    console.error(`...and ${failureDetails.length - 10} more.`);
  }
  process.exit(1);
}

// 7. Validate Pattern Distribution across all 623 games
console.log('\nValidating catalog opener pattern distributions...');
const patRes = validateCatalogPatterns(generatedList);
console.log(`Passed pattern rules: ${patRes.passed}`);
console.log('P1 distribution:', patRes.p1Distribution);
console.log('P2 distribution:', patRes.p2Distribution);
console.log(`Primary objective count: ${patRes.primaryObjectiveCount} (${patRes.primaryObjectivePct.toFixed(1)}%)`);

if (!patRes.passed) {
  console.error('Pattern validation failed:', patRes.errors);
  process.exit(1);
}

// 8. Validate Pairwise Jaccard Similarity across all 623 games
console.log('\nChecking max pairwise Jaccard similarity across regenerated games...');
let maxSim = 0;
let maxPair = null;

for (let i = 0; i < generatedList.length; i++) {
  const sA = generatedList[i].slug;
  const shinglesA = shingleMap[sA];
  for (let j = i + 1; j < generatedList.length; j++) {
    const sB = generatedList[j].slug;
    const sim = computeJaccardSimilarity(shinglesA, shingleMap[sB]);
    if (sim > maxSim) {
      maxSim = sim;
      maxPair = { sA, sB, sim };
    }
  }
}
console.log(`Max Pairwise Jaccard Similarity: ${(maxSim * 100).toFixed(2)}% between "${maxPair ? maxPair.sA : ''}" and "${maxPair ? maxPair.sB : ''}"`);
if (maxSim >= 0.40) {
  console.error(`FAIL: Jaccard similarity ${(maxSim * 100).toFixed(2)}% exceeds 40% threshold!`);
  process.exit(1);
}
console.log('✓ Similarity check passed (< 40%).');

// 9. Verify 155 Live Indexable Games Preservation
for (const [slug, original] of Object.entries(live155Backup)) {
  const current = topContent[slug];
  if (JSON.stringify(current) !== JSON.stringify(original)) {
    console.error(`CRITICAL ERROR: Live indexable game "${slug}" was mutated!`);
    process.exit(1);
  }
}
console.log('✓ 100% preservation of all 155 live indexable games verified.');

// 10. Merge into topContent and Save
console.log('\nMerging regenerated games into catalog...');
for (const [slug, crafted] of Object.entries(generatedMap)) {
  topContent[slug] = crafted;
}

// Double-check total count and template_version
const updatedSlugs = Object.keys(topContent);
console.log(`Catalog games post-merge: ${updatedSlugs.length}`);
const v2Count = updatedSlugs.filter(s => topContent[s].template_version === 'v2').length;
console.log(`v2-prose games post-merge: ${v2Count} / ${updatedSlugs.length}`);

if (v2Count !== updatedSlugs.length) {
  console.error(`ERROR: Not all games are v2-prose! (${v2Count} != ${updatedSlugs.length})`);
  process.exit(1);
}

fs.writeFileSync(TOP_JSON, JSON.stringify(topContent, null, 2), 'utf8');
fs.writeFileSync(TOP_JS, `export const topGamesContent = ${JSON.stringify(topContent, null, 2)};\n`, 'utf8');
console.log('✓ Successfully wrote data/top-games-content.json and data/top-games-content.js!');

console.log('\n=== ALL 623 GAMES SUCCESSFULLY REGENERATED AND VALIDATED ===');
