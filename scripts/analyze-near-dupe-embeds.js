const fs = require('fs');
const { games } = require('../data/games.js');

const ndCsv = fs.readFileSync('reports/near-duplicates.csv', 'utf8');
const lines = ndCsv.trim().split('\n').filter(Boolean);
const header = lines[0];

const sitemapXml = fs.readFileSync('public/sitemap-games.xml', 'utf8');
const sitemapSlugs = new Set((sitemapXml.match(/<loc>https:\/\/blockhub\.games\/game\/([^<]+)<\/loc>/g) || []).map(m => m.replace(/<loc>https:\/\/blockhub\.games\/game\/|<\/loc>/g, '')));

// Extract game map for quick lookup
const gameMap = new Map();
for (const g of games) {
  gameMap.set(g.slug, g);
}

function cleanEmbed(url) {
  if (!url) return '';
  return url.trim().toLowerCase().replace(/\/+$/, '');
}

const highSimRows = [];

for (let i = 1; i < lines.length; i++) {
  const line = lines[i];
  // Parse CSV line
  const cols = line.split(',').map(c => c.replace(/^"|"$/g, ''));
  const slugA = cols[0];
  const slugB = cols[1];
  const sim = parseFloat(cols[2]);
  const suggestedAction = cols[3];
  const proposedCanonical = cols[4];

  if (sim >= 0.98) {
    const gameA = gameMap.get(slugA) || {};
    const gameB = gameMap.get(slugB) || {};

    const embedA = cleanEmbed(gameA.iframeUrl);
    const embedB = cleanEmbed(gameB.iframeUrl);

    const sameEmbed = (embedA && embedB && embedA === embedB);

    const inSitemapA = sitemapSlugs.has(slugA);
    const inSitemapB = sitemapSlugs.has(slugB);

    let whichInSitemap = 'neither';
    if (inSitemapA && inSitemapB) whichInSitemap = 'both';
    else if (inSitemapA) whichInSitemap = 'slug_a';
    else if (inSitemapB) whichInSitemap = 'slug_b';

    let recommendedAction = 'keep_both_differentiate';
    if (sameEmbed) {
      recommendedAction = '301_redirect';
    } else if (suggestedAction.includes('redirect') || suggestedAction.includes('canonicalize')) {
      recommendedAction = '301_redirect';
    } else {
      recommendedAction = 'keep_both_differentiate';
    }

    highSimRows.push({
      slug_a: slugA,
      slug_b: slugB,
      similarity: sim,
      suggested_action: suggestedAction,
      proposed_canonical: proposedCanonical,
      same_embed: sameEmbed,
      which_in_sitemap: whichInSitemap,
      recommended_action: recommendedAction,
      embed_a: embedA,
      embed_b: embedB,
    });
  }
}

console.log(`Analyzed ${highSimRows.length} high-similarity pairs:`);
for (const r of highSimRows) {
  console.log(`${r.slug_a} vs ${r.slug_b}`);
  console.log(`  A: ${r.embed_a}`);
  console.log(`  B: ${r.embed_b}`);
  console.log(`  Same: ${r.same_embed} | Sitemap: ${r.which_in_sitemap} | Action: ${r.recommended_action}`);
}
