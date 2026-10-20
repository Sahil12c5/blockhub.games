/**
 * BULK RELEASE RUNNER: Release All 642 Scheduled Games
 * Command: node scripts/release-all-642.js
 * 
 * Releasing all 642 verified scheduled v2-prose games to indexable: true,
 * preserving existing 155 live games, and strictly preserving:
 * - 14 trademark blocked games (noindex, release_date: NONE)
 * - 19 near-duplicate non-canonical games (noindex, release_date: NONE)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const TOP_JSON = path.join(__dirname, '../data/top-games-content.json');
const TOP_JS = path.join(__dirname, '../data/top-games-content.js');
const TRADEMARKS_CSV = path.join(__dirname, '../reports/flagged-trademarks.csv');
const NEAR_DUPES_CSV = path.join(__dirname, '../reports/near-duplicates.csv');

console.log('=== ONE-TIME BULK RELEASE: ALL 642 SCHEDULED GAMES ===\n');

// 1. Load Data
const topContent = JSON.parse(fs.readFileSync(TOP_JSON, 'utf8'));

// 2. Load Exclusions
const blockedTrademarks = new Set();
if (fs.existsSync(TRADEMARKS_CSV)) {
  const tmRaw = fs.readFileSync(TRADEMARKS_CSV, 'utf8');
  const lines = tmRaw.trim().split(/\r?\n/).slice(1);
  for (const line of lines) {
    const cols = line.split(',');
    const slug = (cols[0] || '').replace(/"/g, '').trim();
    const blocked = (cols[5] || '').replace(/"/g, '').trim();
    if (slug && blocked === 'true') blockedTrademarks.add(slug);
  }
}
console.log(`Loaded ${blockedTrademarks.size} blocked trademarks.`);

const nonCanonicalNearDupes = new Set();
if (fs.existsSync(NEAR_DUPES_CSV)) {
  const ndRaw = fs.readFileSync(NEAR_DUPES_CSV, 'utf8');
  const lines = ndRaw.trim().split(/\r?\n/).slice(1);
  for (const line of lines) {
    const cols = line.split(',');
    const slugA = (cols[0] || '').replace(/"/g, '').trim();
    const slugB = (cols[1] || '').replace(/"/g, '').trim();
    const canonical = (cols[7] || '').replace(/"/g, '').trim();
    if (canonical && slugA && slugB) {
      if (slugA !== canonical) nonCanonicalNearDupes.add(slugA);
      if (slugB !== canonical) nonCanonicalNearDupes.add(slugB);
    }
  }
}
console.log(`Loaded ${nonCanonicalNearDupes.size} non-canonical near-duplicates.`);

// 3. Backup 155 Original Live Indexable Games
const originalLiveGames = {};
for (const [slug, item] of Object.entries(topContent)) {
  if (item.indexable) {
    originalLiveGames[slug] = JSON.parse(JSON.stringify(item));
  }
}
console.log(`Backed up original live games: ${Object.keys(originalLiveGames).length}`);
if (Object.keys(originalLiveGames).length !== 155) {
  console.error(`ERROR: Expected 155 original live games, found ${Object.keys(originalLiveGames).length}!`);
  process.exit(1);
}

// 4. Derive Scheduled Candidates for Bulk Release
const candidates = [];
const skippedTrademarks = [];
const skippedNearDupes = [];

for (const [slug, item] of Object.entries(topContent)) {
  if (item.indexable) continue;

  if (blockedTrademarks.has(slug)) {
    skippedTrademarks.push(slug);
    continue;
  }
  if (nonCanonicalNearDupes.has(slug)) {
    skippedNearDupes.push(slug);
    continue;
  }

  if (item.content_ready && item.template_version === 'v2') {
    candidates.push({ slug, item });
  }
}

console.log(`\nEligibility Verification:`);
console.log(`- Scheduled candidates found : ${candidates.length}`);
console.log(`- Trademarks excluded        : ${skippedTrademarks.length}`);
console.log(`- Near-duplicates excluded   : ${skippedNearDupes.length}`);

if (candidates.length !== 642) {
  console.error(`ERROR: Expected exactly 642 scheduled games to release, found ${candidates.length}!`);
  process.exit(1);
}
if (skippedTrademarks.length !== 14) {
  console.error(`ERROR: Expected 14 trademark exclusions, found ${skippedTrademarks.length}!`);
  process.exit(1);
}
if (skippedNearDupes.length !== 19) {
  console.error(`ERROR: Expected 19 near-duplicate exclusions, found ${skippedNearDupes.length}!`);
  process.exit(1);
}

// 5. Execute Bulk Release
const RELEASE_DATE = '2026-10-21';
console.log(`\nReleasing all ${candidates.length} games on ${RELEASE_DATE}...`);

for (const { slug, item } of candidates) {
  item.indexable = true;
  item.status = 'PASS_LIVE';
  item.release_date = RELEASE_DATE;
}

// Verify original 155 were NOT modified
for (const [slug, orig] of Object.entries(originalLiveGames)) {
  const current = topContent[slug];
  if (current.description !== orig.description || current.word_count !== orig.word_count) {
    console.error(`CRITICAL ERROR: Original live game "${slug}" description/word count was modified!`);
    process.exit(1);
  }
}
console.log('✓ Verified 100% preservation of all 155 original live game descriptions.');

// 6. Verify Catalog Totals
const allSlugs = Object.keys(topContent);
const liveCount = allSlugs.filter(s => topContent[s].indexable).length;
const tmCount = allSlugs.filter(s => !topContent[s].indexable && blockedTrademarks.has(s)).length;
const ndCount = allSlugs.filter(s => !topContent[s].indexable && nonCanonicalNearDupes.has(s)).length;
const remainingScheduled = allSlugs.filter(s => !topContent[s].indexable && !blockedTrademarks.has(s) && !nonCanonicalNearDupes.has(s)).length;

console.log(`\nPost-Release Catalog Audit:`);
console.log(`- Live Indexable Games       : ${liveCount} (Target: 797)`);
console.log(`- Trademark Excluded (noindex): ${tmCount} (Target: 14)`);
console.log(`- Near-Dupe Excluded (noindex): ${ndCount} (Target: 19)`);
console.log(`- Remaining Scheduled        : ${remainingScheduled} (Target: 0)`);
console.log(`- Total Catalog Size         : ${allSlugs.length} (Target: 830)`);

if (liveCount !== 797 || tmCount !== 14 || ndCount !== 19 || remainingScheduled !== 0 || allSlugs.length !== 830) {
  console.error('ERROR: Post-release counts do not match expected targets!');
  process.exit(1);
}

// 7. Write Back topContent
fs.writeFileSync(TOP_JSON, JSON.stringify(topContent, null, 2), 'utf8');
fs.writeFileSync(TOP_JS, `export const topGamesContent = ${JSON.stringify(topContent, null, 2)};\n`, 'utf8');
console.log('✓ Successfully saved data/top-games-content.json and data/top-games-content.js.');

// 8. Regenerate Sitemap
console.log('\nRegenerating sitemap with all 797 live indexable games...');
execSync('node scripts/generate-sitemap.js', { stdio: 'inherit' });

// 9. Regenerate All Reports
console.log('\nRegenerating all reports...');
execSync('node scripts/regenerate-all-reports.js', { stdio: 'inherit' });

// 10. Run Sync Verification
console.log('\nRunning report sync verification...');
execSync('node scripts/verify-reports-sync.js', { stdio: 'inherit' });

console.log(`\n=== BULK RELEASE OF ALL 642 GAMES COMPLETED SUCCESSFULLY ===`);
