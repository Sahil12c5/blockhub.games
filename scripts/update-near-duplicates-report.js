const fs = require('fs');
const path = require('path');
const { games } = require('../data/games.js');

const SITEMAP_XML = path.join(__dirname, '../public/sitemap-games.xml');
const sitemapRaw = fs.readFileSync(SITEMAP_XML, 'utf8');
const sitemapSlugs = new Set((sitemapRaw.match(/<loc>https:\/\/blockhub\.games\/game\/([^<]+)<\/loc>/g) || []).map(m => m.replace(/<loc>https:\/\/blockhub\.games\/game\/|<\/loc>/g, '')));

const ND_CSV = path.join(__dirname, '../reports/near-duplicates.csv');
const ndRaw = fs.readFileSync(ND_CSV, 'utf8');
const lines = ndRaw.trim().split(/\r?\n/).filter(Boolean);

const gameMap = new Map();
for (const g of games) gameMap.set(g.slug, g);

function cleanEmbed(url) {
  if (!url) return '';
  return url.trim().toLowerCase().replace(/\/+$/, '');
}

const newHeader = 'slug_a,slug_b,similarity,same_embed,which_in_sitemap,recommended_action,suggested_action,proposed_canonical';
const updatedRows = [newHeader];

for (let i = 1; i < lines.length; i++) {
  const line = lines[i];
  const cols = line.split(',').map(c => c.replace(/^"|"$/g, ''));
  const slugA = cols[0];
  const slugB = cols[1];
  const sim = parseFloat(cols[2]);
  let suggestedAction = cols[3] || 'review_differentiate_gameplay_focus';
  let proposedCanonical = cols[4] || slugA;

  const gameA = gameMap.get(slugA) || {};
  const gameB = gameMap.get(slugB) || {};

  const embedA = cleanEmbed(gameA.iframeUrl);
  const embedB = cleanEmbed(gameB.iframeUrl);
  const sameEmbed = Boolean(embedA && embedB && embedA === embedB);

  const inSitemapA = sitemapSlugs.has(slugA);
  const inSitemapB = sitemapSlugs.has(slugB);

  let whichInSitemap = 'neither';
  if (inSitemapA && inSitemapB) whichInSitemap = 'both';
  else if (inSitemapA) whichInSitemap = 'slug_a';
  else if (inSitemapB) whichInSitemap = 'slug_b';

  let recommendedAction = 'keep_both_differentiate';
  if (sameEmbed) {
    recommendedAction = '301_redirect';
  } else if (sim >= 0.98 && (suggestedAction.includes('redirect') || suggestedAction.includes('canonicalize'))) {
    recommendedAction = '301_redirect';
  } else {
    recommendedAction = 'keep_both_differentiate';
  }

  updatedRows.push(`"${slugA}","${slugB}",${sim},${sameEmbed},"${whichInSitemap}","${recommendedAction}","${suggestedAction}","${proposedCanonical}"`);
}

fs.writeFileSync(ND_CSV, updatedRows.join('\n') + '\n', 'utf8');
console.log(`Successfully updated reports/near-duplicates.csv with ${updatedRows.length - 1} rows!`);
