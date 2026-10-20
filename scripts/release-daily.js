/**
 * DAILY RELEASE RUNNER
 * Command: npm run release:daily
 * 
 * Sets the next batch of 100 verified v2-prose games to indexable: true,
 * prioritising hub-associated games first, then non-hub games alphabetically.
 * Excludes commercial trademarks and non-canonical near-duplicates.
 * Updates sitemap-games.xml and regenerates all reports.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const TOP_JSON = path.join(__dirname, '../data/top-games-content.json');
const TOP_JS = path.join(__dirname, '../data/top-games-content.js');
const SITEMAP_XML = path.join(__dirname, '../public/sitemap-games.xml');
const TRADEMARKS_CSV = path.join(__dirname, '../reports/flagged-trademarks.csv');
const NEAR_DUPES_CSV = path.join(__dirname, '../reports/near-duplicates.csv');

console.log('=== RUNNING DAILY GAME RELEASE (MAX 100 GAMES) ===\n');

const topContent = JSON.parse(fs.readFileSync(TOP_JSON, 'utf8'));

// Load blocked trademarks
const blockedTrademarks = new Set();
if (fs.existsSync(TRADEMARKS_CSV)) {
  const tmRaw = fs.readFileSync(TRADEMARKS_CSV, 'utf8');
  const lines = tmRaw.trim().split(/\r?\n/).slice(1);
  for (const line of lines) {
    const cols = line.split(',');
    const slug = (cols[0] || '').replace(/"/g, '').trim();
    if (slug) blockedTrademarks.add(slug);
  }
}

// Load non-canonical near-duplicates
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

// Find pending release candidates
const candidates = [];
for (const [slug, item] of Object.entries(topContent)) {
  if (item.content_ready && item.template_version === 'v2' && !item.indexable) {
    if (blockedTrademarks.has(slug)) {
      console.log(`Skipping blocked trademark: ${slug}`);
      continue;
    }
    if (nonCanonicalNearDupes.has(slug)) {
      console.log(`Skipping non-canonical near duplicate: ${slug}`);
      continue;
    }
    const isHub = Array.isArray(item.hub_links) && item.hub_links.length > 0;
    candidates.push({ slug, item, isHub, title: item.title || slug });
  }
}

console.log(`Found ${candidates.length} pending release candidates.`);

if (candidates.length === 0) {
  console.log('No pending games ready for release today.');
  process.exit(0);
}

// Sort candidates: Hub games first alphabetically, then non-hub games alphabetically
candidates.sort((a, b) => {
  if (a.isHub && !b.isHub) return -1;
  if (!a.isHub && b.isHub) return 1;
  return a.title.localeCompare(b.title);
});

// Select up to 100 games
const releaseBatch = candidates.slice(0, 100);
const todayStr = new Date().toISOString().split('T')[0];

console.log(`\nReleasing ${releaseBatch.length} games today (${todayStr}):`);
for (let i = 0; i < releaseBatch.length; i++) {
  const { slug, title, isHub } = releaseBatch[i];
  topContent[slug].indexable = true;
  topContent[slug].release_date = todayStr;
  console.log(`  ${i + 1}. [${isHub ? 'HUB' : 'GAME'}] ${title} (${slug})`);
}

// Write back top content
fs.writeFileSync(TOP_JSON, JSON.stringify(topContent, null, 2), 'utf8');
const jsCode = `export const topGamesContent = ${JSON.stringify(topContent, null, 2)};\n`;
fs.writeFileSync(TOP_JS, jsCode, 'utf8');

// Update sitemap-games.xml with all indexable games
console.log('\nUpdating sitemap-games.xml...');
const allIndexableSlugs = Object.keys(topContent)
  .filter(s => topContent[s].indexable && !blockedTrademarks.has(s) && !nonCanonicalNearDupes.has(s))
  .sort();

const xmlUrls = allIndexableSlugs.map(slug => {
  return `  <url>\n    <loc>https://blockhub.games/game/${slug}</loc>\n    <lastmod>${todayStr}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>`;
});

const sitemapXmlContent = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${xmlUrls.join('\n')}\n</urlset>\n`;
fs.writeFileSync(SITEMAP_XML, sitemapXmlContent, 'utf8');
console.log(`Sitemap updated with ${allIndexableSlugs.length} indexable URLs.`);

// Regenerate all reports
console.log('\nRegenerating all reports...');
execSync('node scripts/regenerate-all-reports.js', { stdio: 'inherit' });

// Run sync verification
console.log('\nRunning report sync verification...');
execSync('node scripts/verify-reports-sync.js', { stdio: 'inherit' });

console.log(`\nDaily release completed successfully! ${releaseBatch.length} games released to index.`);
