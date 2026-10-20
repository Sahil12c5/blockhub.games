const fs = require('fs');
const path = require('path');

const TOP_JSON = path.join(__dirname, '../data/top-games-content.json');
const INDEXABLE_CSV = path.join(__dirname, '../reports/indexable-games.csv');
const INDEXABLE_MD = path.join(__dirname, '../reports/indexable-games.md');
const PASSED_CSV = path.join(__dirname, '../reports/passed-games.csv');
const PASSED_MD = path.join(__dirname, '../reports/passed-games.md');
const NOT_PASSED_CSV = path.join(__dirname, '../reports/not-passed-games.csv');
const NOT_PASSED_MD = path.join(__dirname, '../reports/not-passed-games.md');
const SIMILARITY_MD = path.join(__dirname, '../reports/similarity-2026-10-20.md');
const SITEMAP_XML = path.join(__dirname, '../public/sitemap-games.xml');
const NEAR_DUPES_CSV = path.join(__dirname, '../reports/near-duplicates.csv');
const TRADEMARK_CSV = path.join(__dirname, '../reports/flagged-trademarks.csv');

console.log('=== VERIFYING REPORTS & SITEMAP SYNC ===\n');

let hasErrors = false;

// Robust CSV parser that correctly handles escaped quotes and commas inside quotes
function parseCsvLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

// 1. Check data/top-games-content.json
if (!fs.existsSync(TOP_JSON)) {
  console.error('FAIL: data/top-games-content.json does not exist');
  process.exit(1);
}
const topContent = JSON.parse(fs.readFileSync(TOP_JSON, 'utf8'));
const expectedIndexableSlugs = Object.keys(topContent).filter(s => topContent[s].indexable).sort();
const expectedIndexableCount = expectedIndexableSlugs.length;

console.log(`- Expected live indexable games in catalog: ${expectedIndexableCount}`);

// 2. Check reports/indexable-games.csv
if (!fs.existsSync(INDEXABLE_CSV)) {
  console.error('FAIL: reports/indexable-games.csv does not exist');
  process.exit(1);
}
const csvRaw = fs.readFileSync(INDEXABLE_CSV, 'utf8');
const csvLines = csvRaw.trim().split(/\r?\n/);
if (csvLines[0].startsWith('#')) {
  console.error("FAIL: reports/indexable-games.csv contains '#' comment on line 1");
  hasErrors = true;
}

const csvHeader = csvLines[0];
const csvSlugs = [];
const csvWordCounts = new Map();

for (let i = 1; i < csvLines.length; i++) {
  const line = csvLines[i].trim();
  if (!line) continue;
  const cols = parseCsvLine(line);
  const slug = cols[0];
  const wc = parseInt(cols[4], 10);
  csvSlugs.push(slug);
  csvWordCounts.set(slug, wc);
}

console.log(`- Indexable CSV data rows: ${csvSlugs.length}`);
if (csvSlugs.length !== expectedIndexableCount) {
  console.error(`FAIL: Expected ${expectedIndexableCount} rows in indexable-games.csv, got ${csvSlugs.length}`);
  hasErrors = true;
}

// 3. Check public/sitemap-games.xml
if (!fs.existsSync(SITEMAP_XML)) {
  console.error('FAIL: public/sitemap-games.xml does not exist');
  process.exit(1);
}
const xmlRaw = fs.readFileSync(SITEMAP_XML, 'utf8');
const sitemapMatches = xmlRaw.match(/<loc>https:\/\/blockhub\.games\/game\/([^<]+)<\/loc>/g) || [];
const sitemapSlugs = sitemapMatches.map(m => m.replace(/<loc>https:\/\/blockhub\.games\/game\/|<\/loc>/g, ''));

console.log(`- Sitemap URLs: ${sitemapSlugs.length}`);
if (sitemapSlugs.length !== expectedIndexableCount) {
  console.error(`FAIL: Expected ${expectedIndexableCount} URLs in sitemap-games.xml, got ${sitemapSlugs.length}`);
  hasErrors = true;
}

// Ensure Halo: Platformer, Destroy Minecraft, and near duplicate non-canonicals are NOT in sitemap
const FORBIDDEN_IN_SITEMAP = ['halo-platformer', 'destroy-minecraft', 'cargo-truck-simulator-2025'];
for (const forbidden of FORBIDDEN_IN_SITEMAP) {
  if (sitemapSlugs.includes(forbidden)) {
    console.error(`FAIL: ${forbidden} found in sitemap-games.xml (must be excluded)`);
    hasErrors = true;
  }
}

// 4. Check reports/indexable-games.md
if (!fs.existsSync(INDEXABLE_MD)) {
  console.error('FAIL: reports/indexable-games.md does not exist');
  process.exit(1);
}
const mdRaw = fs.readFileSync(INDEXABLE_MD, 'utf8');
const mdTableMatches = mdRaw.match(/^\|\s*\d+\s*\|\s*\[.*?\]\(.*?\)\s*\|\s*`([^`]+)`/gm) || [];
const mdSlugs = mdTableMatches.map(m => {
  const match = m.match(/`([^`]+)`/);
  return match ? match[1] : '';
}).filter(Boolean);

console.log(`- Markdown table rows in indexable-games.md: ${mdSlugs.length}`);
if (mdSlugs.length !== expectedIndexableCount) {
  console.error(`FAIL: Expected ${expectedIndexableCount} table rows in indexable-games.md, got ${mdSlugs.length}`);
  hasErrors = true;
}

// 5. Cross-check slug identity
const slugSetCsv = new Set(csvSlugs);
const slugSetXml = new Set(sitemapSlugs);
const slugSetMd = new Set(mdSlugs);

for (const slug of csvSlugs) {
  if (!slugSetXml.has(slug)) {
    console.error(`FAIL: Slug "${slug}" in CSV but missing from sitemap-games.xml`);
    hasErrors = true;
  }
  if (!slugSetMd.has(slug)) {
    console.error(`FAIL: Slug "${slug}" in CSV but missing from indexable-games.md`);
    hasErrors = true;
  }
  if (!topContent[slug]) {
    console.error(`FAIL: Slug "${slug}" in CSV but missing from topContent`);
    hasErrors = true;
  }
}

// 6. Check passed-games.csv columns & values
if (!fs.existsSync(PASSED_CSV)) {
  console.error('FAIL: reports/passed-games.csv does not exist');
  process.exit(1);
}
const passedRaw = fs.readFileSync(PASSED_CSV, 'utf8');
const passedLines = passedRaw.trim().split(/\r?\n/);
const passedHeader = passedLines[0];

const requiredCols = ['template_version', 'facts_used', 'release_date', 'status'];
for (const col of requiredCols) {
  if (!passedHeader.includes(col)) {
    console.error(`FAIL: reports/passed-games.csv missing '${col}' column`);
    hasErrors = true;
  }
}

const passedWordCounts = new Map();
let v1Count = 0;
let v2LiveCount = 0;
let v2ScheduledCount = 0;

for (let i = 1; i < passedLines.length; i++) {
  const line = passedLines[i];
  const cols = parseCsvLine(line);
  const slug = cols[0];
  const wc = parseInt(cols[5], 10);
  const version = cols[6];
  const relDate = cols[7];
  const status = cols[8];

  passedWordCounts.set(slug, wc);

  if (version === 'v1-slot') {
    v1Count++;
    if (status !== 'needs_regeneration') {
      console.error(`FAIL: Game "${slug}" on v1-slot has status "${status}" (must be "needs_regeneration")`);
      hasErrors = true;
    }
  } else if (version === 'v2-prose') {
    if (status === 'PASS_LIVE') {
      v2LiveCount++;
    } else if (status === 'PASS_SCHEDULED') {
      v2ScheduledCount++;
    }
  }
}

console.log(`- passed-games.csv: ${v2LiveCount} v2-prose PASS_LIVE, ${v2ScheduledCount} v2-prose PASS_SCHEDULED, ${v1Count} v1-slot needs_regeneration`);
if (v2LiveCount !== expectedIndexableCount) {
  console.error(`FAIL: Expected ${expectedIndexableCount} live indexable games in passed-games.csv, got ${v2LiveCount}`);
  hasErrors = true;
}

// 7. Compare per-game word counts across passed-games.csv, indexable-games.csv, and page data
console.log('- Comparing per-game word counts across CSVs and page data...');
let wordCountMismatches = 0;

for (const slug of csvSlugs) {
  const csvWc = csvWordCounts.get(slug);
  const passedWc = passedWordCounts.get(slug);
  const pageItem = topContent[slug];
  const pageWc = pageItem ? pageItem.word_count : null;
  const descActualWc = (pageItem && pageItem.description) ? pageItem.description.split(/\s+/).filter(Boolean).length : null;

  if (csvWc !== pageWc || passedWc !== pageWc || descActualWc !== pageWc) {
    console.error(`FAIL: Word count mismatch for "${slug}": indexable.csv=${csvWc}, passed.csv=${passedWc}, topContent=${pageWc}, descActual=${descActualWc}`);
    hasErrors = true;
    wordCountMismatches++;
  }
}

// Also verify word counts for all 50 regenerated scheduled games
for (let i = 1; i < passedLines.length; i++) {
  const cols = parseCsvLine(passedLines[i]);
  const slug = cols[0];
  const passedWc = parseInt(cols[5], 10);
  const pageItem = topContent[slug];
  if (pageItem && pageItem.template_version === 'v2') {
    const pageWc = pageItem.word_count;
    const descActualWc = pageItem.description ? pageItem.description.split(/\s+/).filter(Boolean).length : null;
    if (passedWc !== pageWc || descActualWc !== pageWc) {
      console.error(`FAIL: Word count mismatch for v2 game "${slug}": passed.csv=${passedWc}, topContent=${pageWc}, descActual=${descActualWc}`);
      hasErrors = true;
      wordCountMismatches++;
    }
  }
}

if (wordCountMismatches === 0) {
  console.log('✓ 100% word count parity verified across indexable-games.csv, passed-games.csv, and topContent.');
}

// 8. Timestamp synchronization across reports
console.log('- Verifying unified timestamps across all markdown reports...');

function extractTimestamp(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const content = fs.readFileSync(filePath, 'utf8');
  const m = content.match(/>\s*\*\*Last updated\*\*:\s*([^\r\n]+)/);
  return m ? m[1].trim() : null;
}

const tsIndexable = extractTimestamp(INDEXABLE_MD);
const tsPassed = extractTimestamp(PASSED_MD);
const tsNotPassed = extractTimestamp(NOT_PASSED_MD);
const tsSimilarity = extractTimestamp(SIMILARITY_MD);

console.log(`  indexable-games.md   : ${tsIndexable}`);
console.log(`  passed-games.md      : ${tsPassed}`);
console.log(`  not-passed-games.md  : ${tsNotPassed}`);
console.log(`  similarity report    : ${tsSimilarity}`);

if (!tsIndexable || !tsPassed || !tsNotPassed || !tsSimilarity) {
  console.error('FAIL: Missing "Last updated" timestamp in one or more markdown reports');
  hasErrors = true;
} else if (
  tsIndexable !== tsPassed ||
  tsIndexable !== tsNotPassed ||
  tsIndexable !== tsSimilarity
) {
  console.error('FAIL: Timestamp mismatch between reports!');
  hasErrors = true;
} else {
  console.log('✓ Exact timestamp parity verified across all reports.');
}

// 9. Check near-duplicates.csv headers
if (fs.existsSync(NEAR_DUPES_CSV)) {
  const ndRaw = fs.readFileSync(NEAR_DUPES_CSV, 'utf8');
  const ndLines = ndRaw.trim().split(/\r?\n/);
  const ndHeader = ndLines[0];
  const ndRequiredCols = ['same_embed', 'which_in_sitemap', 'recommended_action', 'proposed_canonical'];
  for (const col of ndRequiredCols) {
    if (!ndHeader.includes(col)) {
      console.error(`FAIL: near-duplicates.csv missing "${col}" column`);
      hasErrors = true;
    }
  }
  console.log(`- near-duplicates.csv header verified (${ndLines.length - 1} rows)`);
}

// 10. Check flagged-trademarks.csv
if (!fs.existsSync(TRADEMARK_CSV)) {
  console.error('FAIL: reports/flagged-trademarks.csv does not exist');
  hasErrors = true;
} else {
  const tmRaw = fs.readFileSync(TRADEMARK_CSV, 'utf8');
  if (!tmRaw.includes('halo-platformer') || !tmRaw.includes('destroy-minecraft')) {
    console.error('FAIL: flagged-trademarks.csv missing halo-platformer or destroy-minecraft');
    hasErrors = true;
  } else {
    console.log('- flagged-trademarks.csv verified with blocked indexability games.');
  }
}

if (hasErrors) {
  console.error('\nSYNC CHECK FAILED: One or more discrepancies found!');
  process.exit(1);
} else {
  console.log('\nALL REPORTS AND PAGE DATA ARE 100% IN SYNC AND VERIFIED.');
}
