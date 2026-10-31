/**
 * Quality Gate: Validates that every mapped keyword from reports/seo/keyword-mapping.csv
 * appears exactly as mapped on its designated target game page.
 */
const fs = require('fs');
const path = require('path');
const { getAllGames } = require('../data/games.js');

const CSV_PATH = path.join(__dirname, '../reports/seo/keyword-mapping.csv');

if (!fs.existsSync(CSV_PATH)) {
  console.error(`ERROR: Keyword mapping file not found at ${CSV_PATH}`);
  process.exit(1);
}

const csvContent = fs.readFileSync(CSV_PATH, 'utf8');
const lines = csvContent.split(/\r?\n/);

const mappedKeywordsBySlug = new Map();

for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;
  
  // Parse CSV line handling potential quotes
  const parts = [];
  let current = '';
  let inQuotes = false;
  for (let j = 0; j < line.length; j++) {
    const char = line[j];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      parts.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  parts.push(current);

  const keyword = parts[0]?.trim();
  const targetUrl = parts[2]?.trim();
  const role = parts[3]?.trim();

  if (!keyword || !targetUrl || targetUrl === 'unmapped') continue;

  if (targetUrl.includes('/game/')) {
    const slug = targetUrl.replace(/^https?:\/\/blockhub\.games\/game\//, '').replace(/\/$/, '').trim();
    if (!mappedKeywordsBySlug.has(slug)) {
      mappedKeywordsBySlug.set(slug, []);
    }
    mappedKeywordsBySlug.get(slug).push({ keyword, role, targetUrl });
  }
}

const allGames = getAllGames();
const gamesBySlug = new Map(allGames.map(g => [g.slug, g]));

console.log('====================================================');
console.log('MAPPED KEYWORDS COMPLIANCE AUDIT');
console.log(`Source: reports/seo/keyword-mapping.csv`);
console.log(`Total mapped game URLs in source of truth: ${mappedKeywordsBySlug.size}`);
console.log('====================================================');

let violations = 0;
let checkedCount = 0;

for (const [slug, entries] of mappedKeywordsBySlug.entries()) {
  const game = gamesBySlug.get(slug);
  if (!game) {
    console.error(`❌ VIOLATION: Mapped game slug "${slug}" not found in data/games.js!`);
    violations++;
    continue;
  }

  const searchableText = [
    game.title || '',
    game.meta_title || '',
    game.meta_description || '',
    game.description || '',
    game.about || '',
    ...(game.tips || []),
    ...(game.facts_used || []),
    ...(game.faq || []).map(f => `${f.q} ${f.a}`),
    ...(game.controls || []).map(c => `${c.key} ${c.action}`)
  ].join(' ').toLowerCase();

  for (const { keyword, role } of entries) {
    checkedCount++;
    const kwLower = keyword.toLowerCase();
    
    // Check exact phrase presence
    if (!searchableText.includes(kwLower)) {
      console.error(`❌ MISSING KEYWORD on /game/${slug}: "${keyword}" (${role})`);
      violations++;
    }
  }
}

console.log(`Checked ${checkedCount} mapped keyword instances across ${mappedKeywordsBySlug.size} games.`);

if (violations > 0) {
  console.error(`FAILED: Found ${violations} keyword violations.`);
  process.exit(1);
} else {
  console.log(`CHECK RESULT: ALL MAPPED KEYWORDS PRESENT AND VERIFIED.`);
  process.exit(0);
}

